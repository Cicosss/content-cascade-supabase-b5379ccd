
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { POISubmission } from './types';

interface POISubmissionTagsProps {
  submission: POISubmission;
}

const POISubmissionTags = ({ submission }: POISubmissionTagsProps) => {
  if (!submission.tags || submission.tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <strong>Tags:</strong>
      <div className="flex flex-wrap gap-1 mt-1">
        {submission.tags.map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default POISubmissionTags;
