
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import ExperienceManualForm from './ExperienceManualForm';
import ExperienceCsvUploader from './ExperienceCsvUploader';

interface ExperienceUploadFormProps {
  onExperienceAdded: () => void;
}

const ExperienceUploadForm: React.FC<ExperienceUploadFormProps> = ({ onExperienceAdded }) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'csv'>('manual');

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Aggiungi Nuove Esperienze
        </CardTitle>
        
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'manual' ? 'default' : 'outline'}
            onClick={() => setActiveTab('manual')}
            size="sm"
          >
            Inserimento Manuale
          </Button>
          <Button
            variant={activeTab === 'csv' ? 'default' : 'outline'}
            onClick={() => setActiveTab('csv')}
            size="sm"
          >
            Upload CSV
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {activeTab === 'manual' ? (
          <ExperienceManualForm onExperienceAdded={onExperienceAdded} />
        ) : (
          <ExperienceCsvUploader onExperienceAdded={onExperienceAdded} />
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceUploadForm;
