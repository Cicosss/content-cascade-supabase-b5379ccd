
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, SkipForward } from 'lucide-react';
import { CarouselError } from '@/types/carousel';

interface CarouselErrorBoundaryProps {
  error: CarouselError;
  onRetry: () => void;
  onSkip?: () => void;
  showDetails?: boolean;
}

const CarouselErrorBoundary: React.FC<CarouselErrorBoundaryProps> = ({
  error,
  onRetry,
  onSkip,
  showDetails = false
}) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'network':
        return '🌐';
      case 'timeout':
        return '⏱️';
      case 'rate_limit':
        return '🚦';
      case 'permission':
        return '🔒';
      default:
        return '⚠️';
    }
  };

  const getErrorTitle = () => {
    switch (error.type) {
      case 'network':
        return 'Problemi di connessione';
      case 'timeout':
        return 'Richiesta scaduta';
      case 'rate_limit':
        return 'Troppi tentativi';
      case 'permission':
        return 'Accesso negato';
      default:
        return 'Errore di caricamento';
    }
  };

  const getErrorMessage = () => {
    switch (error.type) {
      case 'network':
        return 'Verifica la tua connessione internet e riprova.';
      case 'timeout':
        return 'Il server sta impiegando troppo tempo a rispondere.';
      case 'rate_limit':
        return 'Troppi tentativi ravvicinati. Riprova tra qualche minuto.';
      case 'permission':
        return 'Non hai i permessi per visualizzare questo contenuto.';
      default:
        return error.message || 'Si è verificato un errore durante il caricamento.';
    }
  };

  const canRetry = error.recoveryAction === 'retry';
  const shouldSkip = error.recoveryAction === 'skip';

  return (
    <Card className="p-6 border-orange-200 bg-orange-50">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getErrorIcon()}</span>
          <AlertTriangle className="h-5 w-5 text-orange-600" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-semibold text-orange-800">
            {getErrorTitle()}
          </h3>
          <p className="text-sm text-orange-700">
            {getErrorMessage()}
          </p>
        </div>

        {showDetails && error.code && (
          <div className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
            Codice errore: {error.code}
          </div>
        )}

        <div className="flex space-x-2">
          {canRetry && (
            <Button
              onClick={onRetry}
              variant="outline"
              size="sm"
              className="text-orange-700 border-orange-300 hover:bg-orange-100"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Riprova
            </Button>
          )}
          
          {shouldSkip && onSkip && (
            <Button
              onClick={onSkip}
              variant="ghost"
              size="sm"
              className="text-orange-600 hover:bg-orange-100"
            >
              <SkipForward className="h-4 w-4 mr-2" />
              Salta
            </Button>
          )}
        </div>

        <div className="text-xs text-orange-500">
          Carosello: {error.carousel_type} • {new Date(error.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </Card>
  );
};

export default CarouselErrorBoundary;
