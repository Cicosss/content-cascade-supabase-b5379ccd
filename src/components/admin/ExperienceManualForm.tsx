
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import ExperienceFormFields from './ExperienceFormFields';

interface ExperienceManualFormProps {
  onExperienceAdded: () => void;
}

const ExperienceManualForm: React.FC<ExperienceManualFormProps> = ({ onExperienceAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    poi_type: 'place',
    macro_area: 'Gusto & Sapori',
    category: 'Ristoranti',
    address: '',
    latitude: '',
    longitude: '',
    price_info: '',
    duration_info: '',
    target_audience: 'everyone',
    website_url: '',
    phone: '',
    email: '',
    images: [] as string[],
    tags: [] as string[],
    // Campi specifici per eventi
    start_datetime: '',
    end_datetime: '',
    location_name: '',
    organizer_info: '',
    // Campi specifici per luoghi
    opening_hours: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.latitude || !formData.longitude) {
      toast.error('Nome, latitudine e longitudine sono obbligatori');
      return;
    }

    setIsLoading(true);

    try {
      const submissionData = {
        name: formData.name,
        description: formData.description || null,
        poi_type: formData.poi_type,
        macro_area: formData.macro_area,
        category: formData.category,
        address: formData.address || null,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        price_info: formData.price_info || null,
        duration_info: formData.duration_info || null,
        target_audience: formData.target_audience,
        website_url: formData.website_url || null,
        phone: formData.phone || null,
        email: formData.email || null,
        images: formData.images.length > 0 ? formData.images : null,
        tags: formData.tags.length > 0 ? formData.tags : null,
        status: 'approved', // Gli admin inseriscono direttamente come approvati
        // Campi condizionali basati sul tipo
        start_datetime: formData.poi_type === 'event' ? (formData.start_datetime || null) : null,
        end_datetime: formData.poi_type === 'event' ? (formData.end_datetime || null) : null,
        location_name: formData.poi_type === 'event' ? (formData.location_name || null) : null,
        organizer_info: formData.poi_type === 'event' ? (formData.organizer_info || null) : null,
        opening_hours: formData.poi_type === 'place' ? (formData.opening_hours || null) : null,
      };

      console.log('🔄 Inserimento POI:', submissionData);

      const { data, error } = await supabase
        .from('points_of_interest')
        .insert([submissionData])
        .select()
        .single();

      if (error) {
        console.error('❌ Errore inserimento POI:', error);
        throw error;
      }

      console.log('✅ POI inserito con successo:', data);
      
      toast.success('POI inserito con successo!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        poi_type: 'place',
        macro_area: 'Gusto & Sapori',
        category: 'Ristoranti',
        address: '',
        latitude: '',
        longitude: '',
        price_info: '',
        duration_info: '',
        target_audience: 'everyone',
        website_url: '',
        phone: '',
        email: '',
        images: [],
        tags: [],
        start_datetime: '',
        end_datetime: '',
        location_name: '',
        organizer_info: '',
        opening_hours: ''
      });

      onExperienceAdded();

    } catch (error) {
      console.error('❌ Errore nell\'inserimento:', error);
      toast.error('Errore nell\'inserimento del POI');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ExperienceFormFields
        formData={formData}
        onInputChange={handleInputChange}
      />

      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Inserimento...' : 'Inserisci POI'}
        </Button>
      </div>
    </form>
  );
};

export default ExperienceManualForm;
