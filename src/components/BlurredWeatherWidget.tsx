
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cloud, Sun, CloudRain, Eye, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BlurredWeatherWidget = () => {
  const navigate = useNavigate();

  const mockWeatherData = [
    { day: 'Oggi', icon: Sun, temp: '2?°', desc: '?' },
    { day: 'Dom', icon: Cloud, temp: '2?°', desc: '?' },
    { day: 'Lun', icon: CloudRain, temp: '2?°', desc: '?' },
    { day: 'Mar', icon: Sun, temp: '2?°', desc: '?' },
  ];

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
            <h4 className="font-semibold text-gray-800 mb-2">Meteo Personalizzato</h4>
            <p className="text-sm text-gray-600 mb-4">
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
        <h3 className="typography-h3 mb-4 flex items-center">
          <Sun className="h-5 w-5 mr-2 text-yellow-500" strokeWidth={1.5} />
          Meteo Rimini
        </h3>
        <div className="grid grid-cols-4 gap-4">
          {mockWeatherData.map((day, index) => (
            <div key={index} className="text-center">
              <div className="typography-body-small text-gray-600 mb-2">{day.day}</div>
              <day.icon className="h-8 w-8 mx-auto mb-2 text-blue-500" strokeWidth={1.5} />
              <div className="font-semibold text-lg">{day.temp}</div>
              <div className="typography-caption text-gray-500">{day.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default BlurredWeatherWidget;
