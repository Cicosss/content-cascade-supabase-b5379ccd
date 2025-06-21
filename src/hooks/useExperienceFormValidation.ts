
import { toast } from 'sonner';
import { ExperienceFormData } from './useExperienceFormData';

export const useExperienceFormValidation = () => {
  const validateForm = (formData: ExperienceFormData): string[] => {
    const errors = [];
    
    // Validazione nome
    if (!formData.name?.trim()) {
      errors.push('Nome del luogo');
    }
    
    // Validazione indirizzo
    if (!formData.address?.trim()) {
      errors.push('Indirizzo');
    }
    
    // Validazione coordinate
    const hasAddress = formData.address && formData.address.trim() !== '';
    const hasLatitude = formData.latitude && formData.latitude !== '' && formData.latitude !== '0';
    const hasLongitude = formData.longitude && formData.longitude !== '' && formData.longitude !== '0';
    
    if (hasAddress && (!hasLatitude || !hasLongitude)) {
      errors.push('Geolocalizzazione (seleziona un indirizzo dalla lista di Google Maps)');
    }

    // Messaggio di errore unificato
    if (errors.length > 0) {
      const errorMessage = `Campi mancanti o incompleti: ${errors.join(', ')}`;
      toast.error(errorMessage);
      return errors;
    }

    // Verifica validità numerica coordinate
    if (formData.latitude && formData.longitude) {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        const coordError = 'Coordinate non valide. Seleziona un indirizzo dalla lista di Google Maps.';
        toast.error(coordError);
        return [coordError];
      }
      
      // Range Italia
      if (lat < 35 || lat > 48 || lng < 6 || lng > 19) {
        const coordError = 'Coordinate fuori dall\'Italia. Verifica l\'indirizzo selezionato.';
        toast.error(coordError);
        return [coordError];
      }
    }

    return [];
  };

  return { validateForm };
};
