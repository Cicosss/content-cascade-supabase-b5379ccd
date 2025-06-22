
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
    handleAddressConfirmationChange
  } = useExperienceFormData();
  
  const { validateFormAsync } = useExperienceFormValidation();
  const { submitForm, isLoading } = useExperienceFormSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Use async validation with retry mechanism
      const errors = await validateFormAsync(formData, isAddressConfirmed);
      
      if (errors.length > 0) {
        return;
      }

      await submitForm(formData, () => {
        resetForm();
        resetAddressConfirmation();
        onExperienceAdded();
      });
    } catch (error) {
      console.error('Errore durante il submit:', error);
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
          onAddressConfirmationChange={handleAddressConfirmationChange}
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
