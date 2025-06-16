
import { toast } from '@/hooks/use-toast';
import { FormData } from './usePOIFormData';

export const usePOIFormValidation = () => {
  const validateStep = (step: number, formData: FormData): boolean => {
    switch (step) {
      case 1:
        if (!formData.submitter_email || !formData.name || !formData.macro_area || !formData.category || !formData.description) {
          toast({
            title: "Campi obbligatori mancanti",
            description: "Email, nome, macro-area, categoria e descrizione sono obbligatori",
            variant: "destructive",
          });
          return false;
        }
        break;
      case 2:
        // Step 2 validation can be added here if needed
        break;
      case 3:
        // Step 3 validation can be added here if needed
        break;
    }
    return true;
  };

  return { validateStep };
};
