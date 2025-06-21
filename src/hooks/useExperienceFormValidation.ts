
import { toast } from 'sonner';
import { ExperienceFormData } from './useExperienceFormData';

export const useExperienceFormValidation = () => {
  const validateForm = (formData: ExperienceFormData): string[] => {
    console.log('🚀 Tentativo di submit con dati:', {
      name: formData.name,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      poi_type: formData.poi_type
    });

    const errors = [];
    
    if (!formData.name?.trim()) {
      errors.push('Nome del luogo');
    }
    
    if (!formData.address?.trim()) {
      errors.push('Indirizzo');
    }
    
    // Controllo semplificato: se c'è un indirizzo, deve avere coordinate da Google Maps
    if (formData.address && (!formData.latitude || !formData.longitude || formData.latitude === '' || formData.longitude === '')) {
      errors.push('Geolocalizzazione (seleziona un indirizzo dalla lista di Google Maps)');
    }

    if (errors.length > 0) {
      const errorMessage = `Campi mancanti o incompleti: ${errors.join(', ')}`;
      console.error('❌ Validazione fallita:', errorMessage);
      toast.error(errorMessage);
      return errors;
    }

    // Verifica che le coordinate siano numeri validi
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    
    if (isNaN(lat) || isNaN(lng)) {
      const coordError = 'Coordinate non valide. Assicurati di aver selezionato un indirizzo dalla lista di Google Maps.';
      toast.error(coordError);
      return [coordError];
    }

    return [];
  };

  return { validateForm };
};
