
import React from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ExperienceFormData } from '@/hooks/useExperienceFormData';

interface ExperienceFormActionsProps {
  isLoading: boolean;
  formData: ExperienceFormData;
}

const ExperienceFormActions: React.FC<ExperienceFormActionsProps> = ({ 
  isLoading, 
  formData 
}) => {
  const handleDebug = () => {
    console.log('🔍 Stato completo del form:', formData);
    const hasCoordinates = !!(formData.latitude && formData.longitude);
    console.log('📍 Ha coordinate valide:', hasCoordinates);
    toast.info('Stato del form stampato nella console');
  };

  return (
    <div className="flex gap-4">
      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Inserimento...' : 'Inserisci POI'}
      </Button>
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={handleDebug}
      >
        Debug Form
      </Button>
    </div>
  );
};

export default ExperienceFormActions;
