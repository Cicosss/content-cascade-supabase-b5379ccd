
import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex flex-col items-center flex-1">
              <div className="flex items-center w-full">
                {/* Step Circle */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  ${isCompleted 
                    ? 'bg-green-500 text-white' 
                    : isCurrent 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                  }
                `}>
                  {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                </div>
                
                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div className={`
                    flex-1 h-1 mx-4
                    ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                  `} />
                )}
              </div>
              
              {/* Step Label */}
              <span className={`
                mt-2 text-sm font-medium text-center px-2
                ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
              `}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;
