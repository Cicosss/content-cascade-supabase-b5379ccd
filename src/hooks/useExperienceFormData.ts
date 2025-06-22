
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
    console.log(`🔄 Form field change: ${field} =`, value);
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Se l'indirizzo viene modificato manualmente, resetta la conferma
    if (field === 'address') {
      console.log('📍 Address manually changed, resetting confirmation');
      setIsAddressConfirmed(false);
    }
  }, []);

  // Atomic batch update for address data
  const handleBatchUpdate = useCallback((updates: Partial<ExperienceFormData>) => {
    console.log('🔄 Batch update:', updates);
    
    setFormData(prev => ({
      ...prev,
      ...updates
    }));

    // Se l'aggiornamento include coordinate valide, mantieni la conferma
    if (updates.address && updates.latitude && updates.longitude) {
      console.log('✅ Address batch update with coordinates, keeping confirmation');
      // Non resettare la conferma qui, sarà gestita dal callback onConfirmationChange
    }
  }, []);

  const handleAddressConfirmationChange = useCallback((confirmed: boolean) => {
    console.log('🔔 Address confirmation state change:', confirmed);
    setIsAddressConfirmed(confirmed);
  }, []);

  const resetForm = useCallback(() => {
    console.log('🔄 Resetting form');
    setFormData(initialFormData);
    setIsAddressConfirmed(false);
  }, []);

  const resetAddressConfirmation = useCallback(() => {
    console.log('🔄 Resetting address confirmation');
    setIsAddressConfirmed(false);
  }, []);

  const isFormReadyForSubmission = useCallback(() => {
    const hasRequiredFields = !!(formData.name && formData.macro_area && formData.category);
    const hasValidAddress = !!(formData.address && formData.latitude && formData.longitude);
    
    console.log('🔍 Form submission readiness check:', {
      hasRequiredFields,
      hasValidAddress,
      isAddressConfirmed,
      ready: hasRequiredFields && hasValidAddress && isAddressConfirmed
    });
    
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
