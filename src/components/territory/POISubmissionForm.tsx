
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import WizardController from './wizard/WizardController';

interface POISubmissionFormProps {
  onSubmissionSuccess: () => void;
}

const POISubmissionForm: React.FC<POISubmissionFormProps> = ({ onSubmissionSuccess }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Nuova Proposta POI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <WizardController onSubmissionSuccess={onSubmissionSuccess} />
      </CardContent>
    </Card>
  );
};

export default POISubmissionForm;
