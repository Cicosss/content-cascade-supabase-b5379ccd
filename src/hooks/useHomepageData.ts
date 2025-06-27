
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useHomepageRestaurants = () => {
  return useQuery({
    queryKey: ['homepage-restaurants'],
    queryFn: async () => {
      console.log('🍽️ Fetching restaurants from database...');
      
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .eq('status', 'approved')
        .eq('category', 'Ristoranti')
        .limit(10);

      if (error) {
        console.error('❌ Error fetching restaurants:', error);
        throw error;
      }

      console.log('✅ Restaurants fetched:', data?.length || 0);
      
      return data?.map(poi => ({
        name: poi.name,
        cuisine: poi.description || 'Cucina Locale',
        rating: poi.avg_rating || 4.5,
        priceRange: poi.price_info || '€€',
        location: poi.address || 'Romagna',
        image: poi.images?.[0] || '🍝',
        specialty: poi.description || 'Specialità della casa'
      })) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useHomepageExperiences = () => {
  return useQuery({
    queryKey: ['homepage-experiences'],
    queryFn: async () => {
      console.log('🎭 Fetching experiences from database...');
      
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .eq('status', 'approved')
        .neq('category', 'Ristoranti')
        .eq('poi_type', 'place')
        .limit(10);

      if (error) {
        console.error('❌ Error fetching experiences:', error);
        throw error;
      }

      console.log('✅ Experiences fetched:', data?.length || 0);
      
      return data?.map(poi => ({
        id: poi.id,
        name: poi.name,
        title: poi.name,
        image: poi.images?.[0] || '🎭',
        rating: poi.avg_rating || 4.5,
        duration: poi.duration_info || '2h',
        groupSize: 'Max 15 persone',
        price: poi.price_info || '€25',
        category: poi.category || 'Esperienza'
      })) || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useHomepageEvents = () => {
  return useQuery({
    queryKey: ['homepage-events'],
    queryFn: async () => {
      console.log('🎉 Fetching events from database...');
      
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .eq('status', 'approved')
        .eq('poi_type', 'experience')
        .not('start_datetime', 'is', null)
        .gte('start_datetime', new Date().toISOString())
        .order('start_datetime', { ascending: true })
        .limit(10);

      if (error) {
        console.error('❌ Error fetching events:', error);
        throw error;
      }

      console.log('✅ Events fetched:', data?.length || 0);
      
      return data?.map(poi => ({
        title: poi.name,
        date: poi.start_datetime ? new Date(poi.start_datetime).toLocaleDateString('it-IT') : 'Data da definire',
        time: poi.start_datetime ? new Date(poi.start_datetime).toLocaleTimeString('it-IT', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : '20:00',
        location: poi.location_name || poi.address || 'Romagna',
        category: poi.category || 'Evento',
        image: poi.images?.[0] || '🎉'
      })) || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for events (more frequent updates)
  });
};

export const useHomepageServices = () => {
  // Manteniamo i servizi come dati statici per ora
  return {
    data: [
      { icon: 'Car', label: 'Taxi', desc: 'Chiama un taxi' },
      { icon: 'Zap', label: 'Ricarica EV', desc: 'Stazioni di ricarica' },
      { icon: 'ParkingCircle', label: 'Parcheggi', desc: 'Trova parcheggio' },
    ],
    isLoading: false,
    error: null
  };
};
