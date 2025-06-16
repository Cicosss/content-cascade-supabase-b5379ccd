
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from './usePOIFormData';

export const usePOIFormSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = async (formData: FormData, onSuccess: () => void) => {
    setIsLoading(true);

    try {
      const submissionData = {
        ...formData,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        start_datetime: formData.start_datetime || null,
        end_datetime: formData.end_datetime || null,
      };

      const { data, error } = await supabase
        .from('poi_submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) throw error;

      await supabase.functions.invoke('send-poi-notification', {
        body: {
          submission: data,
          type: 'new_submission'
        }
      });

      toast({
        title: "POI inviata per revisione",
        description: "La tua proposta è stata inviata e sarà revisionata dal team. Riceverai una email di conferma.",
      });

      onSuccess();

    } catch (error) {
      console.error('Errore nell\'invio:', error);
      toast({
        title: "Errore nell'invio",
        description: "Si è verificato un errore. Riprova più tardi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { submitForm, isLoading };
};
