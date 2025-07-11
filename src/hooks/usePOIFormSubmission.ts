
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { FormData } from './usePOIFormData';

export const usePOIFormSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = async (formData: FormData, onSuccess: () => void) => {
    setIsLoading(true);

    try {
      // Validazione campi obbligatori
      if (!formData.name || !formData.submitter_email) {
        throw new Error('Nome e email sono obbligatori');
      }

      // Assicurati che latitude e longitude abbiano valori di default se non specificati
      const latitude = formData.latitude ? parseFloat(formData.latitude) : 44.0; // Default per Romagna
      const longitude = formData.longitude ? parseFloat(formData.longitude) : 12.0; // Default per Romagna

      const submissionData = {
        poi_type: formData.poi_type,
        submitter_email: formData.submitter_email,
        name: formData.name,
        description: formData.description,
        category: formData.category,
        tags: formData.tags,
        address: formData.address,
        latitude: latitude,
        longitude: longitude,
        price_info: formData.price_info,
        duration_info: formData.duration_info,
        target_audience: formData.target_audience,
        website_url: formData.website_url,
        phone: formData.phone,
        email: formData.email,
        location_name: formData.location_name,
        organizer_info: formData.organizer_info,
        images: formData.images,
        // Campi condizionali basati sul tipo
        start_datetime: formData.poi_type === 'event' ? (formData.start_datetime || null) : null,
        end_datetime: formData.poi_type === 'event' ? (formData.end_datetime || null) : null,
        opening_hours: formData.poi_type === 'place' ? formData.opening_hours : null,
      };

      console.log('🔄 Submission data:', submissionData);

      const { data, error } = await supabase
        .from('poi_submissions')
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        console.error('❌ Errore submission:', error);
        throw error;
      }

      console.log('✅ Submission inserita:', data);

      await supabase.functions.invoke('send-poi-notification', {
        body: {
          submission: data,
          type: 'new_submission'
        }
      });

      const successMessage = formData.poi_type === 'event' 
        ? "Evento inviato per revisione"
        : "Luogo inviato per revisione";
      
      const successDescription = formData.poi_type === 'event'
        ? "La tua proposta di evento è stata inviata e sarà revisionata dal team. Riceverai una email di conferma."
        : "La tua proposta di luogo è stata inviata e sarà revisionata dal team. Riceverai una email di conferma.";

      toast({
        title: successMessage,
        description: successDescription,
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
