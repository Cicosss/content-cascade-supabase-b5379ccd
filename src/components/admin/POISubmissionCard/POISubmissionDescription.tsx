
import React from 'react';
import { POISubmission } from './types';

interface POISubmissionDescriptionProps {
  submission: POISubmission;
}

const POISubmissionDescription = ({ submission }: POISubmissionDescriptionProps) => {
  if (!submission.description && !submission.admin_notes) {
    return null;
  }

  return (
    <>
      {submission.description && (
        <div className="mb-4">
          <strong>Descrizione:</strong>
          <p className="text-sm text-muted-foreground mt-1">{submission.description}</p>
        </div>
      )}

      {submission.admin_notes && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <strong>Note Admin:</strong>
          <p className="text-sm mt-1">{submission.admin_notes}</p>
        </div>
      )}
    </>
  );
};

export default POISubmissionDescription;
