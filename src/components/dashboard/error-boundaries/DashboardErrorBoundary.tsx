
import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { errorLogger } from '@/services/errorLogger';
import { APIErrorType } from '@/types/api';

interface Props {
  children: ReactNode;
  fallbackComponent?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorId: string | null;
  retryCount: number;
  lastRetryTime: number;
}

export class DashboardErrorBoundary extends Component<Props, State> {
  private maxRetries = 3;
  private retryDelay = 2000;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorId: null,
      retryCount: 0,
      lastRetryTime: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    const errorId = `dashboard-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Log error senza dati sensibili
    errorLogger.logError({
      type: APIErrorType.PARSE_ERROR,
      message: error.message,
      retryable: true,
      endpoint: 'dashboard',
      details: {
        componentStack: errorInfo.componentStack,
        errorBoundary: 'DashboardErrorBoundary'
      }
    }, {
      errorId,
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    });

    this.setState({ errorId });

    // Salva stato di recovery in localStorage
    this.saveRecoveryState();
  }

  saveRecoveryState = () => {
    try {
      const recoveryData = {
        timestamp: Date.now(),
        url: window.location.href,
        errorId: this.state.errorId
      };
      localStorage.setItem('dashboard-recovery', JSON.stringify(recoveryData));
    } catch (e) {
      console.warn('Unable to save recovery state:', e);
    }
  };

  loadRecoveryState = () => {
    try {
      const recovery = localStorage.getItem('dashboard-recovery');
      if (recovery) {
        const data = JSON.parse(recovery);
        // Recovery valido solo per 5 minuti
        if (Date.now() - data.timestamp < 300000) {
          return data;
        }
        localStorage.removeItem('dashboard-recovery');
      }
    } catch (e) {
      console.warn('Unable to load recovery state:', e);
    }
    return null;
  };

  handleRetry = () => {
    const now = Date.now();
    const timeSinceLastRetry = now - this.state.lastRetryTime;
    
    // Exponential backoff
    const minDelay = this.retryDelay * Math.pow(2, this.state.retryCount);
    if (timeSinceLastRetry < minDelay) {
      console.log(`Retry too soon, wait ${minDelay - timeSinceLastRetry}ms more`);
      return;
    }

    if (this.state.retryCount >= this.maxRetries) {
      console.log('Max retries reached, manual intervention required');
      return;
    }

    this.setState({
      hasError: false,
      error: null,
      errorId: null,
      retryCount: this.state.retryCount + 1,
      lastRetryTime: now
    });
  };

  handleReset = () => {
    localStorage.removeItem('dashboard-recovery');
    this.setState({
      hasError: false,
      error: null,
      errorId: null,
      retryCount: 0,
      lastRetryTime: 0
    });
  };

  handleGoHome = () => {
    localStorage.removeItem('dashboard-recovery');
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackComponent) {
        return this.props.fallbackComponent;
      }

      const canRetry = this.state.retryCount < this.maxRetries;
      const isNetworkError = this.state.error?.message?.includes('fetch') ||
                           this.state.error?.message?.includes('network');

      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
          <Card className="max-w-lg w-full p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-red-100 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Ops! Qualcosa è andato storto
            </h2>
            
            <p className="text-slate-600 mb-6">
              {isNetworkError 
                ? 'Sembra esserci un problema di connessione. Controlla la tua rete e riprova.'
                : 'Si è verificato un errore imprevisto. Il nostro team è stato avvisato automaticamente.'
              }
            </p>

            <div className="space-y-3">
              {canRetry && (
                <Button 
                  onClick={this.handleRetry}
                  className="w-full"
                  size="lg"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Riprova ({this.maxRetries - this.state.retryCount} tentativi rimasti)
                </Button>
              )}
              
              <Button 
                onClick={this.handleReset}
                variant="outline"
                className="w-full"
                size="lg"
              >
                Resetta Dashboard
              </Button>
              
              <Button 
                onClick={this.handleGoHome}
                variant="ghost"
                className="w-full"
                size="lg"
              >
                <Home className="h-4 w-4 mr-2" />
                Torna alla Home
              </Button>
            </div>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 text-left">
                <summary className="text-sm text-slate-500 cursor-pointer">
                  Dettagli Errore (Dev)
                </summary>
                <pre className="mt-2 text-xs bg-slate-100 p-3 rounded overflow-auto">
                  {this.state.error?.stack}
                </pre>
              </details>
            )}
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
