/**
 * ERROR BOUNDARY: SidebarErrorBoundary
 * 
 * Responsabilità:
 * - Cattura errori nel contesto sidebar
 * - Fallback UI elegante
 * - Logging errori per debug
 * - Reset automatico stato
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class SidebarErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Sidebar Error:', error);
    console.error('Error Info:', errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-muted/50 rounded-lg m-4">
          <AlertTriangle className="h-8 w-8 text-destructive" />
          <div className="text-center space-y-2">
            <h3 className="typography-h4 text-foreground">
              Errore Sidebar
            </h3>
            <p className="typography-small text-muted-foreground">
              Si è verificato un errore nel menu laterale.
            </p>
          </div>
          <Button 
            onClick={this.handleReset}
            variant="outline"
            size="sm"
          >
            Riprova
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}