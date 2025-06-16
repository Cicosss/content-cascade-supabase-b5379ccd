
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, ArrowRight } from 'lucide-react';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const WizardNavigation: React.FC<WizardNavigationProps> = ({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  onSubmit,
  isLoading
}) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Indietro
      </Button>

      {currentStep < totalSteps ? (
        <Button
          type="button"
          onClick={onNext}
          className="flex items-center gap-2"
        >
          Avanti
          <ArrowRight className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Invio in corso...
            </>
          ) : (
            'Invia per Revisione'
          )}
        </Button>
      )}
    </div>
  );
};

export default WizardNavigation;
