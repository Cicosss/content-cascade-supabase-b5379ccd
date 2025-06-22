
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
  const [isAddressConfirmed, setIsAddressConfirmed] = useState(false);

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

  // Nuova funzione per aggiornamenti batch (specializzata per autocompletamento)
  const handleBatchUpdate = (updates: Partial<ExperienceFormData>) => {
    console.log('🔄 Batch form update:', updates);
    
    setFormData(prev => {
      const updated = {
        ...prev,
        ...updates
      };
      
      // Log completo per debug batch update
      console.log('📊 Batch stato form aggiornato:', {
        name: updated.name,
        address: updated.address,
        latitude: updated.latitude,
        longitude: updated.longitude,
        location_name: updated.location_name,
        hasCoordinates: !!(updated.latitude && updated.longitude),
        isComplete: !!(updated.address && updated.latitude && updated.longitude)
      });
      
      return updated;
    });
    
    // Conferma che l'indirizzo è stato processato completamente
    if (updates.address && updates.latitude && updates.longitude) {
      setIsAddressConfirmed(true);
      console.log('✅ Indirizzo confermato e geolocalizzato');
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setIsAddressConfirmed(false);
  };

  const resetAddressConfirmation = () => {
    setIsAddressConfirmed(false);
  };

  // Funzione per validazione pre-submit che aspetta la conferma
  const isFormReadyForSubmission = () => {
    const hasRequiredFields = !!(formData.name && formData.macro_area && formData.category);
    const hasValidAddress = !!(formData.address && formData.latitude && formData.longitude);
    const isAddressProcessed = isAddressConfirmed || !formData.address; // Se non c'è indirizzo, non serve conferma
    
    console.log('🔍 Controllo readiness form:', {
      hasRequiredFields,
      hasValidAddress,
      isAddressProcessed,
      isReady: hasRequiredFields && hasValidAddress && isAddressProcessed
    });
    
    return hasRequiredFields && hasValidAddress && isAddressProcessed;
  };

  return {
    formData,
    handleInputChange,
    handleBatchUpdate,
    resetForm,
    isAddressConfirmed,
    resetAddressConfirmation,
    isFormReadyForSubmission
  };
};
