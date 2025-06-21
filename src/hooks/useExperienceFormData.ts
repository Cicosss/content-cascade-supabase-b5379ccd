
import { useState } from 'react';

export interface ExperienceFormData {
  name: string;
  description: string;
  poi_type: string;
  macro_area: string;
  category: string;
  address: string;
  latitude: string;
  longitude: string;
  price_info: string;
  duration_info: string;
  target_audience: string;
  website_url: string;
  phone: string;
  email: string;
  images: string[];
  tags: string[];
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  opening_hours: string;
}

const initialFormData: ExperienceFormData = {
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
};

export const useExperienceFormData = () => {
  const [formData, setFormData] = useState<ExperienceFormData>(initialFormData);

  const handleInputChange = (field: string, value: any) => {
    console.log(`🔄 Form update - ${field}:`, value);
    
    setFormData(prev => {
      const updated = {
        ...prev,
        [field]: value
      };
      
      // Log dello stato aggiornato per debug
      if (field === 'latitude' || field === 'longitude' || field === 'address' || field === 'name') {
        console.log('📊 Stato form aggiornato:', {
          name: updated.name,
          address: updated.address,
          latitude: updated.latitude,
          longitude: updated.longitude,
          hasCoordinates: !!(updated.latitude && updated.longitude)
        });
      }
      
      return updated;
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    handleInputChange,
    resetForm
  };
};
