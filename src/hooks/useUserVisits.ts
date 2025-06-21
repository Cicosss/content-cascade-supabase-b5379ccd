
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface UserVisit {
  id: string;
  user_id: string;
  poi_id: string;
  visit_timestamp: string;
  notes?: string;
  poi_data?: {
    name: string;
    category: string;
    images: string[];
    address?: string;
  };
}

export const useUserVisits = () => {
  const { user } = useAuth();
  const [visits, setVisits] = useState<UserVisit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserVisits();
    }
  }, [user]);

  const fetchUserVisits = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_visits')
        .select(`
          *,
          points_of_interest (
            name,
            category,
            images,
            address
          )
        `)
        .eq('user_id', user.id)
        .order('visit_timestamp', { ascending: false });

      if (error) {
        console.error('Error fetching user visits:', error);
        return;
      }

      const visitsWithPOIData = data.map(visit => ({
        ...visit,
        poi_data: visit.points_of_interest
      }));

      setVisits(visitsWithPOIData);
    } catch (error) {
      console.error('Error fetching user visits:', error);
    } finally {
      setLoading(false);
    }
  };

  const addVisit = async (poiId: string, notes?: string) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('user_visits')
        .insert({
          user_id: user.id,
          poi_id: poiId,
          notes
        });

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          console.log('User has already visited this POI');
          return false;
        }
        console.error('Error adding visit:', error);
        return false;
      }

      await fetchUserVisits();
      return true;
    } catch (error) {
      console.error('Error adding visit:', error);
      return false;
    }
  };

  const hasVisited = (poiId: string) => {
    return visits.some(visit => visit.poi_id === poiId);
  };

  const getVisitsByCategory = (category: string) => {
    return visits.filter(visit => 
      visit.poi_data?.category?.toLowerCase().includes(category.toLowerCase())
    );
  };

  const getRecentVisits = (limit: number = 10) => {
    return visits.slice(0, limit);
  };

  return {
    visits,
    loading,
    addVisit,
    hasVisited,
    getVisitsByCategory,
    getRecentVisits,
    refetch: fetchUserVisits
  };
};
