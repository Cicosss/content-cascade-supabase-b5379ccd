
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface PersonalizedContentFilters {
  zone: string;
  withChildren: string;
  activityTypes: string[];
  period: any;
  isFirstVisit: boolean;
}

export const usePersonalizedContent = (filters: PersonalizedContentFilters) => {
  const { user } = useAuth();
  const [pois, setPois] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchPersonalizedContent();
  }, [filters, user]);

  const fetchPersonalizedContent = async () => {
    console.log('🔍 DEBUG: usePersonalizedContent - Inizio fetch con filtri:', filters);

    try {
      // *** FASE 1: STANDARD POI DA points_of_interest ***
      let placeQuery = supabase
        .from('points_of_interest')
        .select('*')
        .eq('poi_type', 'place');
      
      if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto')) {
        placeQuery = placeQuery.in('category', filters.activityTypes);
      }

      if (filters.withChildren === 'sì') {
        placeQuery = placeQuery.or('target_audience.eq.families,target_audience.eq.everyone');
      }

      console.log('🔍 DEBUG: Query per points_of_interest places:', placeQuery);
      const { data: placesFromStandardPOI, error: placesError } = await placeQuery.limit(10);
      
      if (placesError) {
        console.error('❌ Errore nel recupero places da points_of_interest:', placesError);
      } else {
        console.log('✅ Places da points_of_interest ricevute:', placesFromStandardPOI?.length || 0, placesFromStandardPOI);
      }

      // *** FASE 2: APPROVED POI DA poi_submissions ***
      let approvedPlacesQuery = supabase
        .from('poi_submissions')
        .select('*')
        .eq('status', 'approved')
        .eq('poi_type', 'place');
      
      if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto')) {
        approvedPlacesQuery = approvedPlacesQuery.in('category', filters.activityTypes);
      }

      if (filters.withChildren === 'sì') {
        approvedPlacesQuery = approvedPlacesQuery.or('target_audience.eq.families,target_audience.eq.everyone');
      }

      console.log('🔍 DEBUG: Query per poi_submissions approved places:', approvedPlacesQuery);
      const { data: placesFromApprovedPOI, error: approvedPlacesError } = await approvedPlacesQuery.limit(10);
      
      if (approvedPlacesError) {
        console.error('❌ Errore nel recupero places approvate da poi_submissions:', approvedPlacesError);
      } else {
        console.log('✅ Places approvate da poi_submissions ricevute:', placesFromApprovedPOI?.length || 0, placesFromApprovedPOI);
        
        // Debug specifico per Trattoria Gina
        const trattoriaGina = placesFromApprovedPOI?.find(poi => 
          poi.name?.toLowerCase().includes('trattoria gina') || 
          poi.id === 'f1ade38a-31eb-4586-ab71-589213826edb'
        );
        console.log('🍝 DEBUG: Trattoria Gina trovata in poi_submissions?', trattoriaGina);
      }

      // *** FASE 3: EVENTI DA points_of_interest ***
      let eventQuery = supabase
        .from('points_of_interest')
        .select('*')
        .eq('poi_type', 'event');
      
      if (filters.activityTypes.length > 0 && !filters.activityTypes.includes('tutto')) {
        eventQuery = eventQuery.in('category', filters.activityTypes);
      }

      if (filters.withChildren === 'sì') {
        eventQuery = eventQuery.or('target_audience.eq.families,target_audience.eq.everyone');
      }

      if (filters.period?.from) {
        const startDate = new Date(filters.period.from).toISOString();
        const endDate = filters.period.to ? new Date(filters.period.to).toISOString() : startDate;
        
        eventQuery = eventQuery
          .gte('start_datetime', startDate)
          .lte('start_datetime', endDate);
      }

      const { data: eventsFromPOI } = await eventQuery.limit(8);

      // *** FASE 4: EVENTI DA events TABLE ***
      let dedicatedEventsQuery = supabase
        .from('events')
        .select('*')
        .gte('start_datetime', new Date().toISOString());

      if (filters.period?.from) {
        const startDate = new Date(filters.period.from).toISOString();
        const endDate = filters.period.to ? new Date(filters.period.to).toISOString() : startDate;
        
        dedicatedEventsQuery = dedicatedEventsQuery
          .gte('start_datetime', startDate)
          .lte('start_datetime', endDate);
      }

      const { data: dedicatedEventsData } = await dedicatedEventsQuery.limit(8);

      // *** FASE 5: COMBINAZIONE DATI ***
      const standardPlaces = placesFromStandardPOI || [];
      const approvedPlaces = placesFromApprovedPOI || [];
      const allPOIs = [...standardPlaces, ...approvedPlaces];
      const allEvents = [...(eventsFromPOI || []), ...(dedicatedEventsData || [])];

      console.log('🔍 DEBUG: Dati finali combinati:');
      console.log('- Places da points_of_interest:', standardPlaces.length);
      console.log('- Places da poi_submissions approved:', approvedPlaces.length);
      console.log('- TOTALE POI:', allPOIs.length);
      console.log('- Array POI finale:', allPOIs);

      // Debug specifico per Trattoria Gina nell'array finale
      const trattoriaGinaFinal = allPOIs.find(poi => 
        poi.name?.toLowerCase().includes('trattoria gina') || 
        poi.id === 'f1ade38a-31eb-4586-ab71-589213826edb'
      );
      console.log('🍝 DEBUG: Trattoria Gina nell\'array finale?', trattoriaGinaFinal);

      setPois(allPOIs);
      setEvents(allEvents);

    } catch (error) {
      console.error('❌ Errore inaspettato in usePersonalizedContent:', error);
      setPois([]);
      setEvents([]);
    }
  };

  return { pois, events };
};
