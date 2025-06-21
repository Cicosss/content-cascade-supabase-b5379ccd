
import React from 'react';

interface POIDetailContentProps {
  description?: string;
  organizerInfo?: string;
}

const POIDetailContent: React.FC<POIDetailContentProps> = ({ 
  description, 
  organizerInfo 
}) => {
  return (
    <div className="bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Descrizione</h2>
          {description ? (
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">{description}</p>
            </div>
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
    </div>
  );
};

export default POIDetailContent;
