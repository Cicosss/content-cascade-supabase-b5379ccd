
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ApprovedExperience {
  id: string;
  name: string;
  description: string;
  macro_area: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  price_info: string;
  duration_info: string;
  target_audience: string;
  images: string[];
  website_url: string;
  phone: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  status: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  poi_type: string;
  opening_hours: string;
}

interface Filters {
  status: string;
  category: string;
  macroArea: string;
  searchTerm: string;
  poiType: string;
}

export const useApprovedExperiences = () => {
  const [experiences, setExperiences] = useState<ApprovedExperience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<ApprovedExperience[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching approved experiences:', error);
        toast.error('Errore nel caricamento delle esperienze approvate');
        return;
      }

      setExperiences(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nel caricamento delle esperienze approvate');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (filters: Filters) => {
    let filtered = [...experiences];

    if (filters.status !== 'tutti') {
      filtered = filtered.filter(exp => exp.status === filters.status);
    }

    if (filters.category !== 'tutti') {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }

    if (filters.macroArea !== 'tutti') {
      filtered = filtered.filter(exp => exp.macro_area === filters.macroArea);
    }

    // Nuovo filtro per tipo POI
    if (filters.poiType !== 'tutti') {
      filtered = filtered.filter(exp => exp.poi_type === filters.poiType);
    }

    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(exp => 
        exp.name.toLowerCase().includes(searchLower) ||
        (exp.description && exp.description.toLowerCase().includes(searchLower)) ||
        (exp.address && exp.address.toLowerCase().includes(searchLower))
      );
    }

    console.log('🔍 Filtri applicati:', filters);
    console.log('📊 Risultati filtrati:', filtered.length, 'su', experiences.length);

    setFilteredExperiences(filtered);
  };

  const deleteExperience = async (experienceId: string) => {
    try {
      const { error } = await supabase
        .from('points_of_interest')
        .delete()
        .eq('id', experienceId);

      if (error) {
        console.error('Error deleting experience:', error);
        toast.error('Errore nell\'eliminazione dell\'esperienza');
        return;
      }

      setExperiences(prev => prev.filter(exp => exp.id !== experienceId));
      toast.success('Esperienza eliminata con successo');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'eliminazione dell\'esperienza');
    }
  };

  const updateExperience = (updatedExperience: ApprovedExperience) => {
    setExperiences(prev => 
      prev.map(exp => 
        exp.id === updatedExperience.id ? updatedExperience : exp
      )
    );
  };

  useEffect(() => {
    fetchApprovedExperiences();
  }, []);

  return {
    experiences,
    filteredExperiences,
    loading,
    applyFilters,
    deleteExperience,
    updateExperience
  };
};
