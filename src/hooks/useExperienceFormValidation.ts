
import { toast } from 'sonner';
import { ExperienceFormData } from './useExperienceFormData';

export const useExperienceFormValidation = () => {
  const validateForm = (formData: ExperienceFormData, isAddressConfirmed: boolean = false): string[] => {
    const errors = [];
    
    // Basic validation
    if (!formData.name?.trim()) {
      errors.push('Nome del luogo');
    }
    
    if (!formData.address?.trim()) {
      errors.push('Indirizzo');
    } else {
      // Se c'è un indirizzo, deve essere confermato E avere coordinate
      const hasLatitude = formData.latitude && formData.latitude !== '' && formData.latitude !== '0';
      const hasLongitude = formData.longitude && formData.longitude !== '' && formData.longitude !== '0';
      
      if (!hasLatitude || !hasLongitude) {
        errors.push('Geolocalizzazione (seleziona un indirizzo dalla lista di Google Maps)');
      } else if (!isAddressConfirmed) {
        errors.push('Conferma indirizzo (attendi che l\'indirizzo sia confermato)');
      }
    }

    if (errors.length > 0) {
      const errorMessage = `Campi mancanti o incompleti: ${errors.join(', ')}`;
      toast.error(errorMessage);
      return errors;
    }

    // Numeric validation for coordinates
    if (formData.latitude && formData.longitude) {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      
      if (isNaN(lat) || isNaN(lng)) {
        const coordError = 'Coordinate non valide. Seleziona un indirizzo dalla lista di Google Maps.';
        toast.error(coordError);
        return [coordError];
      }
      
      // Italy bounds check
      if (lat < 35 || lat > 48 || lng < 6 || lng > 19) {
        const coordError = 'Coordinate fuori dall\'Italia. Verifica l\'indirizzo selezionato.';
        toast.error(coordError);
        return [coordError];
      }
    }

    return [];
  };

  // Simplified async validation - just wait a bit for address confirmation
  const validateFormAsync = async (formData: ExperienceFormData, isAddressConfirmed: boolean): Promise<string[]> => {
    // First do basic validation
    const basicErrors = validateForm(formData, isAddressConfirmed);
    
    if (basicErrors.length > 0) {
      return basicErrors;
    }
    
    // If address exists but not confirmed, wait a moment
    if (formData.address && !isAddressConfirmed) {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check again after waiting
      if (!isAddressConfirmed) {
        toast.error('Attendi la conferma dell\'indirizzo prima di inviare');
        return ['Indirizzo non confermato'];
      }
    }
    
    return [];
  };

  return { validateForm, validateFormAsync };
};
