
import { toast } from '@/hooks/use-toast';
import { FormData } from './usePOIFormData';

export const usePOIFormValidation = () => {
  const validateStep = (step: number, formData: FormData): boolean => {
    switch (step) {
      case 0: // Selezione tipo
        if (!formData.poi_type) {
          toast({
            title: "Selezione richiesta",
            description: "Seleziona se stai aggiungendo un luogo o un evento",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 1: // Info principali
        if (!formData.submitter_email || !formData.name || !formData.category) {
          toast({
            title: "Campi obbligatori mancanti",
            description: "Compila tutti i campi obbligatori contrassegnati con *",
            variant: "destructive",
          });
          return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.submitter_email)) {
          toast({
            title: "Email non valida",
            description: "Inserisci un indirizzo email valido",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 2: // Dettagli e luogo
        if (!formData.address) {
          toast({
            title: "Indirizzo richiesto",
            description: "Inserisci l'indirizzo del luogo",
            variant: "destructive",
          });
          return false;
        }
        return true;

      case 3: // Orari e media
        // Validazione specifica per eventi
        if (formData.poi_type === 'event' && !formData.start_datetime) {
          toast({
            title: "Data di inizio richiesta",
            description: "Gli eventi devono avere una data e ora di inizio",
            variant: "destructive",
          });
          return false;
        }

        // Validazione date per eventi
        if (formData.poi_type === 'event' && formData.start_datetime && formData.end_datetime) {
          const startDate = new Date(formData.start_datetime);
          const endDate = new Date(formData.end_datetime);
          
          if (endDate <= startDate) {
            toast({
              title: "Date non valide",
              description: "La data di fine deve essere successiva alla data di inizio",
              variant: "destructive",
            });
            return false;
          }
        }

        return true;

      default:
        return true;
    }
  };

  return { validateStep };
};
