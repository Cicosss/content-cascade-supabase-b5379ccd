
import React from 'react';
import { Card } from '@/components/ui/card';
import { Cloud, Sun, CloudRain } from 'lucide-react';

const WeatherWidget = () => {
  const weatherData = [
    { day: 'Oggi', icon: Sun, temp: '28°', desc: 'Soleggiato' },
    { day: 'Dom', icon: Cloud, temp: '26°', desc: 'Nuvoloso' },
    { day: 'Lun', icon: CloudRain, temp: '24°', desc: 'Pioggia' },
    { day: 'Mar', icon: Sun, temp: '29°', desc: 'Soleggiato' },
  ];

  return (
    <Card className="p-6">
      <h3 className="typography-h3 mb-4 flex items-center">
        <Sun className="h-5 w-5 mr-2 text-yellow-500" strokeWidth={1.5} />
        Meteo Rimini
      </h3>
      <div className="grid grid-cols-4 gap-4">
        {weatherData.map((day, index) => (
          <div key={index} className="text-center">
            <div className="typography-body-small text-gray-600 mb-2">{day.day}</div>
            <day.icon className="h-8 w-8 mx-auto mb-2 text-blue-500" strokeWidth={1.5} />
            <div className="typography-body font-semibold">{day.temp}</div>
            <div className="typography-caption text-gray-500">{day.desc}</div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default WeatherWidget;
