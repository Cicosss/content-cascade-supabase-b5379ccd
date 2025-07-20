
import React, { Component, ReactNode } from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { errorLogger } from '@/services/errorLogger';
import { APIErrorType } from '@/types/api';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  showFallback: boolean;
}

export class WeatherErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      showFallback: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // FIX: Aggiungere controllo null per evitare crash
    try {
      errorLogger.logError({
        type: APIErrorType.API_TIMEOUT,
        message: `Weather Error: ${error?.message || 'Unknown error'}`,
        retryable: true,
        endpoint: 'weather-api'
      });
    } catch (logError) {
      console.warn('Failed to log weather error:', logError);
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      showFallback: false
    });
  };

  handleShowFallback = () => {
    this.setState({ showFallback: true });
  };

  render() {
    if (this.state.hasError) {
      if (this.state.showFallback) {
        return <WeatherFallback />;
      }

      return (
        <Card className="p-4">
          <div className="text-center space-y-3">
            <CloudOff className="h-8 w-8 text-slate-400 mx-auto" />
            <div>
              <h4 className="font-medium text-slate-700">Meteo Non Disponibile</h4>
              <p className="text-sm text-slate-500 mt-1">
                Servizio meteo temporaneamente offline
              </p>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={this.handleRetry} variant="outline" size="sm">
                <RefreshCw className="h-3 w-3 mr-1" />
                Riprova
              </Button>
              <Button onClick={this.handleShowFallback} variant="ghost" size="sm">
                Info Generali
              </Button>
            </div>
          </div>
        </Card>
      );
    }

    return this.props.children;
  }
}

// Componente fallback per dati meteo generici
const WeatherFallback: React.FC = () => {
  const getCurrentSeason = () => {
    const month = new Date().getMonth();
    if (month >= 2 && month <= 4) return 'Primavera';
    if (month >= 5 && month <= 7) return 'Estate';
    if (month >= 8 && month <= 10) return 'Autunno';
    return 'Inverno';
  };

  const getSeasonInfo = (season: string) => {
    const info = {
      'Primavera': { temp: '18°C', desc: 'Tempo mite e variabile', icon: '🌸' },
      'Estate': { temp: '28°C', desc: 'Caldo e soleggiato', icon: '☀️' },
      'Autunno': { temp: '15°C', desc: 'Fresco con possibili piogge', icon: '🍂' },
      'Inverno': { temp: '8°C', desc: 'Freddo e umido', icon: '❄️' }
    };
    return info[season as keyof typeof info] || info['Primavera'];
  };

  const season = getCurrentSeason();
  const seasonInfo = getSeasonInfo(season);

  return (
    <Card className="p-4">
      <div className="text-center space-y-3">
        <div className="text-3xl">{seasonInfo.icon}</div>
        <div>
          <h4 className="font-medium text-slate-800">Romagna - {season}</h4>
          <div className="text-2xl font-bold text-slate-700 mt-1">
            ~{seasonInfo.temp}
          </div>
          <p className="text-sm text-slate-600 mt-1">{seasonInfo.desc}</p>
        </div>
        <div className="text-xs text-slate-500 pt-2 border-t">
          Dati meteo generali di stagione
        </div>
      </div>
    </Card>
  );
};
