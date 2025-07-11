
import { useState, useEffect } from 'react';
import { OFFICIAL_CATEGORIES } from '@/config/categoryMapping';

interface FormData {
  poi_type: 'place' | 'event' | '';
  submitter_email: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  address: string;
  latitude: string;
  longitude: string;
  price_info: string;
  duration_info: string;
  target_audience: string;
  website_url: string;
  phone: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  images: string[];
  opening_hours: string;
}

const initialFormData: FormData = {
  poi_type: '',
  submitter_email: '',
  name: '',
  description: '',
  category: '',
  tags: [],
  address: '',
  latitude: '',
  longitude: '',
  price_info: '',
  duration_info: '',
  target_audience: 'everyone',
  website_url: '',
  phone: '',
  email: '',
  start_datetime: '',
  end_datetime: '',
  location_name: '',
  organizer_info: '',
  images: [],
  opening_hours: ''
};

export const usePOIFormData = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  // Ora usiamo direttamente tutte le 17 categorie ufficiali
  const availableCategories = [...OFFICIAL_CATEGORIES];

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagChange = (tag: string, checked: boolean) => {
    const currentTags = formData.tags || [];
    let newTags;
    
    if (checked) {
      newTags = [...currentTags, tag];
    } else {
      newTags = currentTags.filter((t: string) => t !== tag);
    }
    
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const resetForm = () => {
    setFormData(initialFormData);
  };

  return {
    formData,
    availableCategories,
    handleInputChange,
    handleTagChange,
    resetForm
  };
};

export type { FormData };
