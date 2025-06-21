
import React from 'react';

const ExperienceFormInstructions: React.FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start gap-3">
        <div className="text-blue-500 mt-1">ℹ️</div>
        <div>
          <h4 className="font-medium text-blue-900 mb-1">Come funziona la geolocalizzazione</h4>
          <p className="text-sm text-blue-700">
            Quando inserisci l'indirizzo, inizia a digitare e seleziona una delle opzioni dalla lista di Google Maps. 
            Questo garantisce che il luogo venga geolocalizzato automaticamente sulla mappa interattiva.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExperienceFormInstructions;
