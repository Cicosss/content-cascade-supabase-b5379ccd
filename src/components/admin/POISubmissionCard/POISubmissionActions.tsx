
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Calendar } from 'lucide-react';
import { POISubmission } from './types';

interface POISubmissionActionsProps {
  submission: POISubmission;
  onModerate: (submission: POISubmission) => void;
}

const POISubmissionActions = ({ submission, onModerate }: POISubmissionActionsProps) => {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onModerate(submission)}
        className="rounded-xl"
      >
        <Eye className="h-4 w-4 mr-1" strokeWidth={1.5} />
        Modera
      </Button>
      
      <Badge variant="outline" className="text-xs rounded-xl">
        <Calendar className="h-3 w-3 mr-1" strokeWidth={1.5} />
        {new Date(submission.created_at).toLocaleDateString('it-IT')}
      </Badge>
    </div>
  );
};

export default POISubmissionActions;
