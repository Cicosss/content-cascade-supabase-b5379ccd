
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import POISubmissionCard from '../POISubmissionCard';
import { POISubmission } from './POISubmission';

interface SubmissionsListProps {
  submissions: POISubmission[];
  onModerate: (submission: POISubmission) => void;
  onDelete: (submissionId: string) => void;
}

const SubmissionsList = ({ submissions, onModerate, onDelete }: SubmissionsListProps) => {
  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">
            Nessuna proposta corrisponde ai filtri selezionati
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {submissions.map((submission) => (
        <POISubmissionCard
          key={submission.id}
          submission={submission}
          onModerate={onModerate}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default SubmissionsList;
