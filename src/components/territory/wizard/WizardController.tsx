
import React, { useState } from 'react';
import { usePOIFormData } from '@/hooks/usePOIFormData';
import { usePOIFormValidation } from '@/hooks/usePOIFormValidation';
import { usePOIFormSubmission } from '@/hooks/usePOIFormSubmission';
import POITypeSelector from './POITypeSelector';
import ProgressBar from '../ProgressBar';
import Step1BasicInfo from './Step1BasicInfo';
import Step2LocationDetails from './Step2LocationDetails';
import Step3ScheduleMedia from './Step3ScheduleMedia';
import WizardNavigation from './WizardNavigation';

interface WizardControllerProps {
  onSubmissionSuccess: () => void;
}

const WizardController: React.FC<WizardControllerProps> = ({ onSubmissionSuccess }) => {
  const [currentStep, setCurrentStep] = useState(0); // Inizia da 0 per la selezione tipo
  const { formData, availableCategories, handleInputChange, handleTagChange, resetForm } = usePOIFormData();
  const { validateStep } = usePOIFormValidation();
  const { submitForm, isLoading } = usePOIFormSubmission();

  const steps = [
    'Tipo di Proposta',
    'Info Principali',
    'Dettagli e Luogo', 
    'Orari e Media'
  ];

  const handleTypeSelection = (type: 'place' | 'event') => {
    handleInputChange('poi_type', type);
    setCurrentStep(1); // Passa al primo step vero
  };

  const handleNext = () => {
    if (currentStep === 0) {
      // Step 0 è gestito dalla selezione tipo
      return;
    }
    
    if (validateStep(currentStep, formData)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep, formData)) return;
    
    await submitForm(formData, () => {
      resetForm();
      setCurrentStep(0);
      onSubmissionSuccess();
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <POITypeSelector
            selectedType={formData.poi_type}
            onTypeChange={handleTypeSelection}
          />
        );
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

  const showProgressBar = currentStep > 0;
  const showNavigation = currentStep > 0;

  return (
    <>
      {showProgressBar && (
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={steps.length} 
          steps={steps} 
        />
      )}
      
      {renderCurrentStep()}
      
      {showNavigation && (
        <WizardNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />
      )}
    </>
  );
};

export default WizardController;
