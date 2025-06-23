
import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SeaSafetyBannerProps {
  onDismiss?: () => void;
}

const SeaSafetyBanner: React.FC<SeaSafetyBannerProps> = ({ onDismiss }) => {
  return (
    <div className="w-full bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4 mb-6 shadow-sm">
      <div className="flex items-start gap-3">
        {/* Icona di avviso */}
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle className="h-5 w-5 text-yellow-600" strokeWidth={2} />
        </div>
        
        {/* Contenuto del banner */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-yellow-800 mb-1">
            Prudenza in Mare
          </h3>
          <p className="text-sm text-yellow-700 leading-relaxed">
            Controlla sempre le condizioni meteo marine e il colore della bandiera di salvataggio prima di entrare in acqua. La tua sicurezza è la nostra priorità.
          </p>
        </div>
        
        {/* Pulsante di chiusura opzionale */}
        {onDismiss && (
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeaSafetyBanner;
