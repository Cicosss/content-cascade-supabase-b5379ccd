
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
        poi_type: formData.poi_type,
        submitter_email: formData.submitter_email,
        name: formData.name,
        description: formData.description,
        macro_area: formData.macro_area,
        category: formData.category,
        tags: formData.tags,
        address: formData.address,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        price_info: formData.price_info,
        duration_info: formData.duration_info,
        target_audience: formData.target_audience,
        website_url: formData.website_url,
        phone: formData.phone,
        email: formData.email,
        location_name: formData.location_name,
        organizer_info: formData.organizer_info,
        video_url: formData.video_url,
        images: formData.images,
        cover_image: formData.cover_image,
        // Campi condizionali basati sul tipo
        start_datetime: formData.poi_type === 'event' ? (formData.start_datetime || null) : null,
        end_datetime: formData.poi_type === 'event' ? (formData.end_datetime || null) : null,
        opening_hours: formData.poi_type === 'place' ? formData.opening_hours : null,
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
