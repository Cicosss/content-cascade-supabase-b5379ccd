
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
  const { formData, handleInputChange, resetForm } = useExperienceFormData();
  const { validateForm } = useExperienceFormValidation();
  const { submitForm, isLoading } = useExperienceFormSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm(formData);
    if (errors.length > 0) {
      return;
    }

    try {
      await submitForm(formData, () => {
        resetForm();
        onExperienceAdded();
      });
    } catch (error) {
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
