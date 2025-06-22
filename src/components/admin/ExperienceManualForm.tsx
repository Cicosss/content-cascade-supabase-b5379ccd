
import React from 'react';
import ExperienceFormFields from './ExperienceFormFields';
import ExperienceFormInstructions from './ExperienceFormInstructions';
import ExperienceFormActions from './ExperienceFormActions';
import { useExperienceFormData } from '@/hooks/useExperienceFormData';
import { useExperienceFormValidation } from '@/hooks/useExperienceFormValidation';
import { useExperienceFormSubmission } from '@/hooks/useExperienceFormSubmission';

interface ExperienceManualFormProps {
  onExperienceAdded: () => void;
}

const ExperienceManualForm: React.FC<ExperienceManualFormProps> = ({ onExperienceAdded }) => {
  const { 
    formData, 
    handleInputChange, 
    handleBatchUpdate,
    resetForm, 
    isAddressConfirmed,
    resetAddressConfirmation,
    isFormReadyForSubmission 
  } = useExperienceFormData();
  
  const { validateForm } = useExperienceFormValidation();
  const { submitForm, isLoading } = useExperienceFormSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Tentativo di submit del form');
    console.log('📋 Stato form completo al momento del submit:', formData);
    
    // Controllo di readiness prima della validazione
    if (!isFormReadyForSubmission()) {
      console.log('❌ Form non pronto per submission - stato indirizzo non confermato');
      
      // Aspetta un breve momento per permettere eventuali aggiornamenti asincroni
      setTimeout(() => {
        if (!isFormReadyForSubmission()) {
          console.log('❌ Form ancora non pronto dopo timeout');
          return;
        }
        // Riprova la submission
        handleSubmit(e);
      }, 100);
      return;
    }
    
    const errors = validateForm(formData);
    if (errors.length > 0) {
      console.log('❌ Errori di validazione:', errors);
      return;
    }

    try {
      await submitForm(formData, () => {
        resetForm();
        resetAddressConfirmation();
        onExperienceAdded();
      });
    } catch (error) {
      console.error('❌ Errore durante il submit:', error);
      // Error handling is done in the hook
    }
  };

  return (
    <div className="space-y-6">
      <ExperienceFormInstructions />

      <form onSubmit={handleSubmit} className="space-y-6">
        <ExperienceFormFields
          formData={formData}
          onInputChange={handleInputChange}
          onBatchUpdate={handleBatchUpdate}
          isAddressConfirmed={isAddressConfirmed}
        />

        <ExperienceFormActions 
          isLoading={isLoading}
          formData={formData}
        />
      </form>
    </div>
  );
};

export default ExperienceManualForm;
