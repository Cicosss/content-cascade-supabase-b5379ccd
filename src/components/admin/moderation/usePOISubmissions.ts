
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { POISubmission } from './POISubmission';

export const usePOISubmissions = () => {
  const [submissions, setSubmissions] = useState<POISubmission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('poi_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Errore nel caricamento delle proposte');
        return;
      }

      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected' | 'edited',
        tags: item.tags || [],
        poi_type: item.poi_type || 'place',
        opening_hours: item.opening_hours || ''
      }));

      setSubmissions(typedData);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nel caricamento delle proposte');
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = (submissionId: string, status: string, notes: string) => {
    setSubmissions(prev => 
      prev.map(sub => 
        sub.id === submissionId 
          ? { ...sub, status: status as 'pending' | 'approved' | 'rejected' | 'edited', admin_notes: notes }
          : sub
      )
    );
  };

  const deleteSubmission = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('poi_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) {
        console.error('Error deleting submission:', error);
        toast.error('Errore nell\'eliminazione della proposta');
        return;
      }

      setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
      toast.success('Proposta eliminata con successo');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'eliminazione della proposta');
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  return {
    submissions,
    loading,
    fetchSubmissions,
    updateSubmissionStatus,
    deleteSubmission
  };
};
