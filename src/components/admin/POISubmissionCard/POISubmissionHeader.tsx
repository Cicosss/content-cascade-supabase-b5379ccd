
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { POISubmission } from './types';
import { STATUS_CONFIG } from './constants';

interface POISubmissionHeaderProps {
  submission: POISubmission;
  onDelete: (submissionId: string) => void;
}

const POISubmissionHeader = ({ submission, onDelete }: POISubmissionHeaderProps) => {
  const statusConfig = STATUS_CONFIG[submission.status] || STATUS_CONFIG.pending;

  const handleDelete = () => {
    if (window.confirm(`Sei sicuro di voler eliminare la proposta "${submission.name}"? Questa azione non può essere annullata.`)) {
      onDelete(submission.id);
    }
  };

  return (
    <CardHeader>
      <div className="flex justify-between items-start">
        <div>
          <CardTitle className="text-xl">{submission.name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Proposta da: {submission.submitter_email}
          </p>
          <p className="text-xs text-muted-foreground">
            ID: {submission.id}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusConfig.variant} className="rounded-xl">
            {statusConfig.label}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default POISubmissionHeader;
