
import { useState, useCallback } from 'react';

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
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Se l'indirizzo viene modificato manualmente, resetta la conferma
    if (field === 'address') {
      setIsAddressConfirmed(false);
    }
  }, []);

  // Atomic batch update
  const handleBatchUpdate = useCallback((updates: Partial<ExperienceFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));

    // Se l'aggiornamento include coordinate valide, considera l'indirizzo confermato
    if (updates.address && updates.latitude && updates.longitude) {
      setIsAddressConfirmed(true);
    }
  }, []);

  const handleAddressConfirmationChange = useCallback((confirmed: boolean) => {
    setIsAddressConfirmed(confirmed);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setIsAddressConfirmed(false);
  }, []);

  const resetAddressConfirmation = useCallback(() => {
    setIsAddressConfirmed(false);
  }, []);

  const isFormReadyForSubmission = useCallback(() => {
    const hasRequiredFields = !!(formData.name && formData.macro_area && formData.category);
    const hasValidAddress = !!(formData.address && formData.latitude && formData.longitude);
    
    return hasRequiredFields && hasValidAddress && isAddressConfirmed;
  }, [formData.name, formData.macro_area, formData.category, formData.address, formData.latitude, formData.longitude, isAddressConfirmed]);

  return {
    formData,
    handleInputChange,
    handleBatchUpdate,
    resetForm,
    isAddressConfirmed,
    resetAddressConfirmation,
    handleAddressConfirmationChange,
    isFormReadyForSubmission
  };
};
