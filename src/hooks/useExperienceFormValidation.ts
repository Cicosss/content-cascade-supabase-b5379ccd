
import { toast } from 'sonner';
import { ExperienceFormData } from './useExperienceFormData';

export const useExperienceFormValidation = () => {
  const validateForm = (formData: ExperienceFormData): string[] => {
    console.log('🚀 Validazione form - Dati ricevuti:', {
      name: formData.name,
      address: formData.address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      poi_type: formData.poi_type
    });

    const errors = [];
    
    // Validazione nome
    if (!formData.name?.trim()) {
      errors.push('Nome del luogo');
      console.log('❌ Validazione fallita: Nome mancante');
    }
    
    // Validazione indirizzo
    if (!formData.address?.trim()) {
      errors.push('Indirizzo');
      console.log('❌ Validazione fallita: Indirizzo mancante');
    }
    
    // CORREZIONE: Validazione coordinate più robusta
    const hasAddress = formData.address && formData.address.trim() !== '';
    const hasLatitude = formData.latitude && formData.latitude !== '' && formData.latitude !== '0';
    const hasLongitude = formData.longitude && formData.longitude !== '' && formData.longitude !== '0';
    
    console.log('🔍 Validazione coordinate:', {
      hasAddress,
      hasLatitude,
      hasLongitude,
      latValue: formData.latitude,
      lngValue: formData.longitude
    });
    
    if (hasAddress && (!hasLatitude || !hasLongitude)) {
      errors.push('Geolocalizzazione (seleziona un indirizzo dalla lista di Google Maps)');
      console.log('❌ Validazione fallita: Coordinate mancanti per indirizzo fornito');
    }

    // Validazione finale
    if (errors.length > 0) {
      const errorMessage = `Campi mancanti o incompleti: ${errors.join(', ')}`;
      console.error('❌ Validazione complessiva fallita:', errorMessage);
      toast.error(errorMessage);
      return errors;
    }

    // Verifica che le coordinate siano numeri validi se presenti
    if (formData.latitude && formData.longitude) {
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);
      
      console.log('🔍 Verifica validità numerica coordinate:', { lat, lng });
      
      if (isNaN(lat) || isNaN(lng)) {
        const coordError = 'Coordinate non valide. Assicurati di aver selezionato un indirizzo dalla lista di Google Maps.';
        console.error('❌ Validazione fallita: Coordinate non numeriche');
        toast.error(coordError);
        return [coordError];
      }
      
      // Verifica che le coordinate siano in un range ragionevole per l'Italia
      if (lat < 35 || lat > 48 || lng < 6 || lng > 19) {
        const coordError = 'Le coordinate sembrano essere fuori dall\'Italia. Verifica l\'indirizzo selezionato.';
        console.error('❌ Validazione fallita: Coordinate fuori range Italia');
        toast.error(coordError);
        return [coordError];
      }
    }

    console.log('✅ Validazione completata con successo');
    return [];
  };

  return { validateForm };
};
