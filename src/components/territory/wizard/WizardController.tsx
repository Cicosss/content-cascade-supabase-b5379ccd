
import React, { useState } from 'react';
import { usePOIFormData } from '@/hooks/usePOIFormData';
import { usePOIFormValidation } from '@/hooks/usePOIFormValidation';
import { usePOIFormSubmission } from '@/hooks/usePOIFormSubmission';
import ProgressBar from '../ProgressBar';
import Step1BasicInfo from './Step1BasicInfo';
import Step2LocationDetails from './Step2LocationDetails';
import Step3ScheduleMedia from './Step3ScheduleMedia';
import WizardNavigation from './WizardNavigation';

interface WizardControllerProps {
  onSubmissionSuccess: () => void;
}

const WizardController: React.FC<WizardControllerProps> = ({ onSubmissionSuccess }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const { formData, availableCategories, handleInputChange, handleTagChange, resetForm } = usePOIFormData();
  const { validateStep } = usePOIFormValidation();
  const { submitForm, isLoading } = usePOIFormSubmission();

  const steps = [
    'Info Principali',
    'Dettagli e Luogo', 
    'Orari e Media'
  ];

  const handleNext = () => {
    if (validateStep(currentStep, formData)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep, formData)) return;
    
    await submitForm(formData, () => {
      resetForm();
      setCurrentStep(1);
      onSubmissionSuccess();
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            formData={formData}
            onInputChange={handleInputChange}
            availableCategories={availableCategories}
          />
        );
      case 2:
        return (
          <Step2LocationDetails
            formData={formData}
            onInputChange={handleInputChange}
            onTagChange={handleTagChange}
          />
        );
      case 3:
        return (
          <Step3ScheduleMedia
            formData={formData}
            onInputChange={handleInputChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <ProgressBar 
        currentStep={currentStep} 
        totalSteps={steps.length} 
        steps={steps} 
      />
      
      {renderCurrentStep()}
      
      <WizardNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </>
  );
};

export default WizardController;
