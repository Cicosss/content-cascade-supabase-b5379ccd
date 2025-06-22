
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import POISubmissionHeader from './POISubmissionHeader';
import POISubmissionDetails from './POISubmissionDetails';
import POISubmissionDescription from './POISubmissionDescription';
import POISubmissionTags from './POISubmissionTags';
import POISubmissionActions from './POISubmissionActions';
import { POISubmissionCardProps } from './types';

const POISubmissionCard = ({ submission, onModerate, onDelete }: POISubmissionCardProps) => {
  return (
    <Card className="w-full">
      <POISubmissionHeader submission={submission} onDelete={onDelete} />
      
      <CardContent>
        <POISubmissionDetails submission={submission} />
        <POISubmissionDescription submission={submission} />
        <POISubmissionTags submission={submission} />
        <POISubmissionActions submission={submission} onModerate={onModerate} />
      </CardContent>
    </Card>
  );
};

export default POISubmissionCard;
