import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import WeatherWidgetBase from '@/components/weather/WeatherWidgetBase';

const BlurredWeatherWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Se l'utente è loggato, mostra i dati reali
  if (user) {
    return <WeatherWidgetBase />;
  }

  return (
    <Card className="p-6 relative overflow-hidden">
      {/* Overlay per effetto blur */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/80 via-white/60 to-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <Lock className="h-6 w-6" />
            <Eye className="h-6 w-6" />
          </div>
          <div>
            <h4 className="typography-h4 text-gray-800 mb-2">Meteo Personalizzato</h4>
            <p className="typography-small text-gray-600 mb-4">
              Registrati per vedere le previsioni precise della tua zona
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
            >
              Accedi Gratis
            </Button>
          </div>
        </div>
      </div>

      {/* Contenuto sfocato sotto */}
      <div className="blur-sm">
        <WeatherWidgetBase />
      </div>
    </Card>
  );
};

export default BlurredWeatherWidget;
