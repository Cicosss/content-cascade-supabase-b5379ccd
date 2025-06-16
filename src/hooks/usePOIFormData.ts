
import { useState, useEffect } from 'react';
import { getCategoriesForMacroArea } from '@/config/categoryMapping';

interface FormData {
  submitter_email: string;
  name: string;
  description: string;
  macro_area: string;
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
  video_url: string;
  images: string[];
}

const initialFormData: FormData = {
  submitter_email: '',
  name: '',
  description: '',
  macro_area: '',
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
  video_url: '',
  images: []
};

export const usePOIFormData = () => {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    if (formData.macro_area) {
      const categories = getCategoriesForMacroArea(formData.macro_area);
      setAvailableCategories(categories);
      
      if (formData.category && !categories.includes(formData.category)) {
        setFormData(prev => ({ ...prev, category: '' }));
      }
    }
  }, [formData.macro_area]);

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
