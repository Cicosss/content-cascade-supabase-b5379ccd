import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class APIErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('API Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isNetworkError = this.state.error?.message?.includes('fetch') || 
                            this.state.error?.message?.includes('network');

      return (
        <div className="flex items-center justify-center min-h-[400px] p-6">
          <Alert className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="flex items-center gap-2">
              {isNetworkError ? (
                <>
                  <Wifi className="h-4 w-4" />
                  Problema di Connessione
                </>
              ) : (
                'Errore nel Caricamento'
              )}
            </AlertTitle>
            <AlertDescription className="mt-2">
              {isNetworkError ? (
                'Verifica la tua connessione internet e riprova.'
              ) : (
                'Si è verificato un errore imprevisto nel caricamento dei dati.'
              )}
            </AlertDescription>
            <div className="mt-4 space-y-2">
              <Button 
                onClick={this.handleRetry}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Riprova
              </Button>
              {process.env.NODE_ENV === 'development' && (
                <details className="mt-2 text-xs text-muted-foreground">
                  <summary>Dettagli Errore (Dev)</summary>
                  <pre className="mt-1 whitespace-pre-wrap">
                    {this.state.error?.stack}
                  </pre>
                </details>
              )}
            </div>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}