
import { toast } from 'sonner';
import { ExperienceFormData } from './useExperienceFormData';

export const useExperienceFormValidation = () => {
  const validateForm = (formData: ExperienceFormData): string[] => {
    const errors = [];
    
    // Basic validation
    if (!formData.name?.trim()) {
      errors.push('Nome del luogo');
    }
    
    if (!formData.address?.trim()) {
      errors.push('Indirizzo');
    }
    
    // Enhanced coordinate validation
    const hasAddress = formData.address && formData.address.trim() !== '';
    const hasLatitude = formData.latitude && formData.latitude !== '' && formData.latitude !== '0';
    const hasLongitude = formData.longitude && formData.longitude !== '' && formData.longitude !== '0';
    
    if (hasAddress && (!hasLatitude || !hasLongitude)) {
      errors.push('Geolocalizzazione (seleziona un indirizzo dalla lista di Google Maps)');
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

  // Async validation with retry for address confirmation
  const validateFormAsync = async (formData: ExperienceFormData, isAddressConfirmed: boolean, maxRetries = 3): Promise<string[]> => {
    let retries = 0;
    
    while (retries < maxRetries) {
      const basicErrors = validateForm(formData);
      
      if (basicErrors.length > 0) {
        return basicErrors;
      }
      
      // Check address confirmation
      if (formData.address && !isAddressConfirmed) {
        if (retries < maxRetries - 1) {
          // Wait a bit for address confirmation
          await new Promise(resolve => setTimeout(resolve, 200));
          retries++;
          continue;
        } else {
          toast.error('Attendi la conferma dell\'indirizzo prima di inviare');
          return ['Indirizzo non confermato'];
        }
      }
      
      return [];
    }
    
    return ['Validazione fallita dopo tentativi multipli'];
  };

  return { validateForm, validateFormAsync };
};
