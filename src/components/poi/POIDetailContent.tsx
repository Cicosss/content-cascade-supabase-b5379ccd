
import React from 'react';
import HtmlContent from '@/components/ui/html-content';

interface POIDetailContentProps {
  description?: string;
  organizerInfo?: string;
}

const POIDetailContent: React.FC<POIDetailContentProps> = ({ 
  description, 
  organizerInfo 
}) => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Descrizione</h2>
        {description ? (
          <HtmlContent 
            content={description} 
            className="prose prose-gray max-w-none text-gray-700 leading-relaxed text-lg" 
          />
        ) : (
          <p className="text-gray-500 italic">Nessuna descrizione disponibile.</p>
        )}

        {organizerInfo && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="font-semibold text-gray-900 mb-2">Informazioni Organizzatore</h3>
            <p className="text-gray-700">{organizerInfo}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default POIDetailContent;
