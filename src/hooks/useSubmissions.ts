
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface POISubmission {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  submitter_email: string;
}

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<POISubmission[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('poi_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Errore nel caricamento delle submission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return {
    submissions,
    isLoading,
    fetchSubmissions
  };
};
