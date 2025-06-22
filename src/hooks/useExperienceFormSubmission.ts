
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { ExperienceFormData } from './useExperienceFormData';

export const useExperienceFormSubmission = () => {
  const [isLoading, setIsLoading] = useState(false);

  const submitForm = async (formData: ExperienceFormData, onSuccess: () => void) => {
    setIsLoading(true);

    try {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);

      const submissionData = {
        name: formData.name,
        description: formData.description || null,
        poi_type: formData.poi_type,
        macro_area: formData.macro_area,
        category: formData.category,
        address: formData.address || null,
        latitude: lat,
        longitude: lng,
        price_info: formData.price_info || null,
        duration_info: formData.duration_info || null,
        target_audience: formData.target_audience,
        website_url: formData.website_url || null,
        phone: formData.phone || null,
        email: formData.email || null,
        images: formData.images.length > 0 ? formData.images : null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        status: 'approved',
        start_datetime: formData.poi_type === 'event' ? (formData.start_datetime || null) : null,
        end_datetime: formData.poi_type === 'event' ? (formData.end_datetime || null) : null,
        location_name: formData.poi_type === 'event' ? (formData.location_name || null) : null,
        organizer_info: formData.poi_type === 'event' ? (formData.organizer_info || null) : null,
        opening_hours: formData.poi_type === 'place' ? (formData.opening_hours || null) : null,
      };

      const { data, error } = await supabase
        .from('points_of_interest')
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        throw error;
      }
      
      toast.success('POI inserito con successo! L\'indirizzo è stato geolocalizzato correttamente.');
      onSuccess();

    } catch (error) {
      console.error('Errore nell\'inserimento:', error);
      toast.error('Errore nell\'inserimento del POI. Verifica i dati e riprova.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { submitForm, isLoading };
};
