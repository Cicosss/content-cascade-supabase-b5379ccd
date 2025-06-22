
import React from 'react';
import { MapPin, Phone, Globe } from 'lucide-react';
import { POISubmission } from './types';

interface POISubmissionDetailsProps {
  submission: POISubmission;
}

const POISubmissionDetails = ({ submission }: POISubmissionDetailsProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4 mb-4">
      <div>
        <p><strong>Macro-Area:</strong> {submission.macro_area}</p>
        <p><strong>Categoria:</strong> {submission.category}</p>
        <p><strong>Target:</strong> {submission.target_audience}</p>
        {submission.address && (
          <p className="flex items-center gap-1">
            <MapPin className="h-4 w-4" strokeWidth={1.5} />
            {submission.address}
          </p>
        )}
      </div>
      
      <div>
        {submission.price_info && <p><strong>Prezzo:</strong> {submission.price_info}</p>}
        {submission.duration_info && <p><strong>Durata:</strong> {submission.duration_info}</p>}
        {submission.phone && (
          <p className="flex items-center gap-1">
            <Phone className="h-4 w-4" strokeWidth={1.5} />
            {submission.phone}
          </p>
        )}
        {submission.website_url && (
          <p className="flex items-center gap-1">
            <Globe className="h-4 w-4" strokeWidth={1.5} />
            <a href={submission.website_url} target="_blank" rel="noopener noreferrer" 
               className="text-blue-600 hover:underline truncate">
              {submission.website_url}
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default POISubmissionDetails;
