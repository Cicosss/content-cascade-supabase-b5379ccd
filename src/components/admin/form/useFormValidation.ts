
import { FormData } from './POIFormData';

export const useFormValidation = () => {
  const validateForm = (formData: FormData, isAddressConfirmed: boolean): string[] => {
    const errors: string[] = [];

    // Campi obbligatori
    if (!formData.name.trim()) errors.push('Il nome è obbligatorio');
    if (!formData.category) errors.push('La categoria è obbligatoria');
    if (!formData.address.trim()) errors.push('L\'indirizzo è obbligatorio');
    
    // Controllo conferma indirizzo e coordinate insieme
    if (!isAddressConfirmed || !formData.latitude || !formData.longitude) {
      errors.push('Seleziona un indirizzo valido dalla lista di Google Places');
    }

    // Validazione eventi
    if (formData.poi_type === 'event' && !formData.start_datetime) {
      errors.push('La data di inizio è obbligatoria per gli eventi');
    }

    return errors;
  };

  return { validateForm };
};
