import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw, CheckCircle, Clock, X } from 'lucide-react';
import { errorLogger, ErrorLogEntry } from '@/services/errorLogger';
import { APIErrorType } from '@/types/api';
import { useToast } from '@/hooks/use-toast';

export const ErrorRecoveryPanel: React.FC = () => {
  const [errors, setErrors] = useState<ErrorLogEntry[]>([]);
  const [isRetrying, setIsRetrying] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Update errors every 5 seconds
    const updateErrors = () => {
      const stats = errorLogger.getErrorStats();
      setErrors(stats.recentErrors.filter(error => !error.resolved));
    };

    updateErrors();
    const interval = setInterval(updateErrors, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleRetry = async (error: ErrorLogEntry) => {
    setIsRetrying(error.id);
    
    try {
      // Simulate retry logic - in real app, this would trigger the actual retry
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      errorLogger.markErrorResolved(error.id);
      setErrors(errors.filter(e => e.id !== error.id));
      
      toast({
        title: "Risolto",
        description: "Operazione completata con successo",
      });
    } catch (retryError) {
      toast({
        title: "Errore nel retry",
        description: "Non è stato possibile risolvere l'errore",
        variant: "destructive",
      });
    } finally {
      setIsRetrying(null);
    }
  };

  const handleDismiss = (error: ErrorLogEntry) => {
    errorLogger.markErrorResolved(error.id);
    setErrors(errors.filter(e => e.id !== error.id));
  };

  const getErrorVariant = (type: APIErrorType): "default" | "destructive" | "secondary" => {
    switch (type) {
      case APIErrorType.AUTHENTICATION_ERROR:
      case APIErrorType.SERVER_ERROR:
      case APIErrorType.CORS_ERROR:
        return "destructive";
      case APIErrorType.RATE_LIMIT:
      case APIErrorType.API_TIMEOUT:
        return "secondary";
      default:
        return "default";
    }
  };

  const getErrorIcon = (type: APIErrorType) => {
    switch (type) {
      case APIErrorType.API_TIMEOUT:
        return <Clock className="h-4 w-4" />;
      case APIErrorType.AUTHENTICATION_ERROR:
      case APIErrorType.SERVER_ERROR:
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getRetryRecommendation = (type: APIErrorType): string => {
    switch (type) {
      case APIErrorType.NETWORK_ERROR:
        return "Controlla la connessione internet";
      case APIErrorType.API_TIMEOUT:
        return "Il server potrebbe essere sovraccarico";
      case APIErrorType.RATE_LIMIT:
        return "Attendere prima di riprovare";
      case APIErrorType.AUTHENTICATION_ERROR:
        return "Verifica le credenziali di accesso";
      case APIErrorType.SERVER_ERROR:
        return "Problema temporaneo del server";
      default:
        return "Errore sconosciuto";
    }
  };

  if (errors.length === 0) {
    return null;
  }

  return (
    <Card className="mb-4 border-orange-200 bg-orange-50/30">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          Problemi di Connessione
          <Badge variant="secondary" className="ml-auto">
            {errors.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {errors.slice(0, 3).map((error) => (
          <Alert key={error.id} className="py-3">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                {getErrorIcon(error.error.type)}
              </div>
              
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={getErrorVariant(error.error.type)} className="text-xs">
                    {error.error.endpoint || 'API'}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(error.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                
                <AlertDescription className="text-sm mb-2">
                  <div className="font-medium">{error.error.message}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {getRetryRecommendation(error.error.type)}
                  </div>
                </AlertDescription>
                
                <div className="flex gap-2">
                  {error.error.retryable && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRetry(error)}
                      disabled={isRetrying === error.id}
                      className="h-7 text-xs"
                    >
                      {isRetrying === error.id ? (
                        <>
                          <RefreshCw className="h-3 w-3 animate-spin mr-1" />
                          Riprovando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Riprova
                        </>
                      )}
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDismiss(error)}
                    className="h-7 text-xs"
                  >
                    <X className="h-3 w-3 mr-1" />
                    Ignora
                  </Button>
                </div>
              </div>
            </div>
          </Alert>
        ))}
        
        {errors.length > 3 && (
          <div className="text-xs text-muted-foreground text-center py-2">
            + {errors.length - 3} altri errori
          </div>
        )}
      </CardContent>
    </Card>
  );
};