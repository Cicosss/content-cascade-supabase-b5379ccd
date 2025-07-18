
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Shield, 
  Wifi, 
  WifiOff, 
  Activity, 
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Zap
} from 'lucide-react';
import { errorRecoveryService } from '@/services/errorRecoveryService';
import { enhancedApiClient } from '@/services/enhancedApiClient';
import { useToast } from '@/hooks/use-toast';

export const ErrorRecoveryMonitor: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const updateStats = () => {
      const recoveryStats = errorRecoveryService.getRecoveryStats();
      const apiHealth = enhancedApiClient.getHealthStatus();
      
      setStats({
        ...recoveryStats,
        ...apiHealth,
        timestamp: Date.now()
      });
    };

    // Initial load
    updateStats();

    // Update every 10 seconds
    const interval = setInterval(updateStats, 10000);

    // Show monitor se ci sono problemi
    const checkForIssues = () => {
      if (stats?.openCircuitBreakers?.length > 0 || 
          !stats?.networkHealth?.isOnline ||
          stats?.activeRetries > 0) {
        setIsVisible(true);
      }
    };

    const issueInterval = setInterval(checkForIssues, 5000);

    return () => {
      clearInterval(interval);
      clearInterval(issueInterval);
    };
  }, [stats]);

  const handleForceRefresh = () => {
    enhancedApiClient.clearCache();
    window.location.reload();
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!stats || !isVisible) {
    return null;
  }

  const hasIssues = stats.openCircuitBreakers?.length > 0 || 
                   !stats.networkHealth?.isOnline ||
                   stats.activeRetries > 0;

  const networkStatus = stats.networkHealth?.isOnline ? 'online' : 'offline';
  const networkLatency = stats.networkHealth?.estimatedLatency || 0;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="p-4 shadow-lg border-l-4 border-l-blue-500">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-sm">Sistema di Recupero</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDismiss}
            className="h-6 w-6 p-0"
          >
            ×
          </Button>
        </div>

        <div className="space-y-3">
          {/* Network Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {networkStatus === 'online' ? (
                <Wifi className="h-4 w-4 text-green-600" />
              ) : (
                <WifiOff className="h-4 w-4 text-red-600" />
              )}
              <span className="text-sm">Connessione</span>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={networkStatus === 'online' ? 'default' : 'destructive'}>
                {networkStatus}
              </Badge>
              {networkLatency > 0 && (
                <span className="text-xs text-slate-500">
                  {networkLatency}ms
                </span>
              )}
            </div>
          </div>

          {/* Circuit Breakers */}
          {stats.openCircuitBreakers?.length > 0 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                {stats.openCircuitBreakers.length} servizio/i temporaneamente disabilitato/i
              </AlertDescription>
            </Alert>
          )}

          {/* Active Retries */}
          {stats.activeRetries > 0 && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4 text-orange-600 animate-spin" />
                <span className="text-sm">Tentativi attivi</span>
              </div>
              <Badge variant="outline">{stats.activeRetries}</Badge>
            </div>
          )}

          {/* API Health */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-blue-600" />
              <span className="text-sm">Cache API</span>
            </div>
            <Badge variant="outline">{stats.cacheSize} elementi</Badge>
          </div>

          {/* Recovery Strategies */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              <span className="text-sm">Strategie</span>
            </div>
            <Badge variant="outline">{stats.recoveryStrategies} attive</Badge>
          </div>

          {/* Actions */}
          {hasIssues && (
            <div className="pt-2 border-t space-y-2">
              <Button 
                onClick={handleForceRefresh}
                variant="outline" 
                size="sm" 
                className="w-full"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Aggiorna Sistema
              </Button>
            </div>
          )}

          {!hasIssues && (
            <div className="flex items-center space-x-2 text-green-600 pt-2 border-t">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Tutti i sistemi operativi</span>
            </div>
          )}
        </div>

        <div className="text-xs text-slate-500 mt-3">
          Ultimo aggiornamento: {new Date(stats.timestamp).toLocaleTimeString()}
        </div>
      </Card>
    </div>
  );
};
