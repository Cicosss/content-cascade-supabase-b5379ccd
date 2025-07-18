import React from 'react';
import { AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGoogleMapsLoader } from '@/hooks/useGoogleMapsLoader';

export const MapHealthMonitor: React.FC = () => {
  const { isLoaded, error, fallbackMode, retryCount, healthStatus } = useGoogleMapsLoader();

  const getStatusColor = () => {
    if (fallbackMode) return 'warning';
    if (error) return 'destructive';
    if (isLoaded) return 'success';
    return 'secondary';
  };

  const getStatusIcon = () => {
    if (fallbackMode) return <AlertTriangle className="h-4 w-4" />;
    if (error) return <XCircle className="h-4 w-4" />;
    if (isLoaded) return <CheckCircle className="h-4 w-4" />;
    return <Activity className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (fallbackMode) return 'Modalità Fallback';
    if (error) return 'Errore API';
    if (isLoaded) return 'Operativo';
    return 'Caricamento...';
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Stato Mappe
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Stato Generale</span>
          <Badge variant={getStatusColor() as any} className="flex items-center gap-1">
            {getStatusIcon()}
            {getStatusText()}
          </Badge>
        </div>
        
        {healthStatus && (
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span>API Caricata:</span>
              <span className={healthStatus.isLoaded ? 'text-green-600' : 'text-red-600'}>
                {healthStatus.isLoaded ? 'Sì' : 'No'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Places Library:</span>
              <span className={healthStatus.hasPlacesLibrary ? 'text-green-600' : 'text-red-600'}>
                {healthStatus.hasPlacesLibrary ? 'Disponibile' : 'Non disponibile'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Geocoder:</span>
              <span className={healthStatus.hasGeocoder ? 'text-green-600' : 'text-red-600'}>
                {healthStatus.hasGeocoder ? 'Disponibile' : 'Non disponibile'}
              </span>
            </div>
          </div>
        )}
        
        {retryCount > 0 && (
          <div className="text-xs text-muted-foreground">
            Tentativi: {retryCount}/3
          </div>
        )}
        
        {error && (
          <div className="text-xs text-red-600 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
        
        {fallbackMode && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            Modalità offline attivata. Alcune funzionalità potrebbero essere limitate.
          </div>
        )}
      </CardContent>
    </Card>
  );
};