
import React, { Component, ReactNode } from 'react';
import { Map, List, RefreshCw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { errorLogger } from '@/services/errorLogger';
import { APIErrorType } from '@/types/api';
import { useOptimizedPOIData } from '@/hooks/useOptimizedPOIData';

interface Props {
  children: ReactNode;
  filters: any;
  onFallbackToList?: (pois: any[]) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showListFallback: boolean;
  retryCount: number;
}

export class MapErrorBoundary extends Component<Props, State> {
  private maxRetries = 2;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      showListFallback: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    errorLogger.logError({
      type: APIErrorType.NETWORK_ERROR,
      message: `Map Error: ${error.message}`,
      retryable: true,
      endpoint: 'google-maps',
      details: { componentStack: errorInfo.componentStack }
    });
  }

  handleRetry = () => {
    if (this.state.retryCount >= this.maxRetries) {
      this.setState({ showListFallback: true });
      return;
    }

    this.setState({
      hasError: false,
      error: null,
      retryCount: this.state.retryCount + 1
    });
  };

  handleSwitchToList = () => {
    this.setState({ showListFallback: true });
  };

  render() {
    if (this.state.hasError) {
      const isGoogleMapsError = this.state.error?.message?.includes('google') ||
                               this.state.error?.message?.includes('maps');

      return (
        <Card className="h-full flex items-center justify-center p-8">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 bg-orange-100 rounded-full">
                <Map className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Mappa Temporaneamente Non Disponibile
              </h3>
              <p className="text-slate-600 text-sm mb-4">
                {isGoogleMapsError 
                  ? 'Problemi con il servizio Google Maps'
                  : 'Errore nel caricamento della mappa interattiva'
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              {this.state.retryCount < this.maxRetries && (
                <Button 
                  onClick={this.handleRetry}
                  variant="outline"
                  size="sm"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Riprova
                </Button>
              )}
              
              <Button 
                onClick={this.handleSwitchToList}
                variant="default"
                size="sm"
              >
                <List className="h-4 w-4 mr-2" />
                Visualizza Lista
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    if (this.state.showListFallback) {
      return <MapListFallback filters={this.props.filters} />;
    }

    return this.props.children;
  }
}

// Componente fallback lista POI
const MapListFallback: React.FC<{ filters: any }> = ({ filters }) => {
  const { pois, isLoading, error } = useOptimizedPOIData();

  React.useEffect(() => {
    // Fetch POI per la lista fallback
  }, [filters]);

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Caricamento luoghi...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-4" />
          <p className="text-slate-600">Impossibile caricare i luoghi</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-y-auto">
      <div className="p-4 border-b bg-slate-50">
        <h3 className="font-semibold text-slate-800 flex items-center">
          <List className="h-5 w-5 mr-2" />
          Luoghi Disponibili ({pois.length})
        </h3>
      </div>
      <div className="divide-y">
        {pois.slice(0, 10).map((poi) => (
          <div key={poi.id} className="p-4 hover:bg-slate-50">
            <h4 className="font-medium text-slate-800">{poi.name}</h4>
            <p className="text-sm text-slate-600 mt-1">{poi.category}</p>
            {poi.address && (
              <p className="text-xs text-slate-500 mt-1">{poi.address}</p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
