
import React from 'react';
import { Sun, Cloud, CloudRain, CloudSnow, Zap, Moon, Star, Stars } from 'lucide-react';

interface AnimatedWeatherIconProps {
  condition: string;
  iconCode?: string;
  className?: string;
  isNight?: boolean;
}

const AnimatedWeatherIcon: React.FC<AnimatedWeatherIconProps> = ({ 
  condition, 
  iconCode, 
  className = "h-8 w-8",
  isNight = false
}) => {
  // Determina l'icona e l'animazione basandosi sulla condizione
  const getAnimatedIcon = () => {
    // Controlla prima l'iconCode per maggiore precisione
    if (iconCode) {
      if (iconCode.includes('01')) {
        if (isNight) {
          return (
            <div className="relative">
              <Moon className={`${className} text-blue-200 animate-float`} />
              <div className="absolute -top-1 -right-2 animate-twinkle">
                <Star className="h-2 w-2 text-yellow-200" />
              </div>
              <div className="absolute top-2 -left-1 animate-twinkle animation-delay-1000">
                <Star className="h-1.5 w-1.5 text-blue-100" />
              </div>
            </div>
          );
        }
        return (
          <div className="relative">
            <Sun className={`${className} text-yellow-400 animate-spin-slow`} />
            <div className="absolute inset-0 opacity-30 animate-pulse">
              <Sun className={`${className} text-yellow-300`} />
            </div>
          </div>
        );
      }
      if (iconCode.includes('02') || iconCode.includes('03') || iconCode.includes('04')) {
        if (isNight) {
          return (
            <div className="relative">
              <Cloud className={`${className} text-gray-400 animate-float`} />
              <div className="absolute -top-1 -left-2 animate-twinkle">
                <Moon className="h-3 w-3 text-blue-200" />
              </div>
              <div className="absolute top-1 -right-1 animate-drift">
                <div className="w-1.5 h-1.5 bg-blue-100 rounded-full opacity-60"></div>
              </div>
            </div>
          );
        }
        return (
          <div className="relative">
            <Cloud className={`${className} text-gray-300 animate-float`} />
            <div className="absolute -top-1 -right-1 animate-drift">
              <div className="w-2 h-2 bg-gray-200 rounded-full opacity-60"></div>
            </div>
          </div>
        );
      }
      if (iconCode.includes('09') || iconCode.includes('10')) {
        if (isNight) {
          return (
            <div className="relative">
              <CloudRain className={`${className} text-blue-500 animate-bounce-gentle`} />
              <div className="absolute -top-1 -left-1 animate-float">
                <Moon className="h-2.5 w-2.5 text-blue-200 opacity-70" />
              </div>
              <div className="absolute top-6 left-2 space-y-1">
                <div className="w-0.5 h-2 bg-blue-400 animate-rain-drop animation-delay-0"></div>
                <div className="w-0.5 h-2 bg-blue-400 animate-rain-drop animation-delay-300"></div>
                <div className="w-0.5 h-2 bg-blue-400 animate-rain-drop animation-delay-600"></div>
              </div>
            </div>
          );
        }
        return (
          <div className="relative">
            <CloudRain className={`${className} text-blue-400 animate-bounce-gentle`} />
            <div className="absolute top-6 left-2 space-y-1">
              <div className="w-0.5 h-2 bg-blue-300 animate-rain-drop animation-delay-0"></div>
              <div className="w-0.5 h-2 bg-blue-300 animate-rain-drop animation-delay-300"></div>
              <div className="w-0.5 h-2 bg-blue-300 animate-rain-drop animation-delay-600"></div>
            </div>
          </div>
        );
      }
      if (iconCode.includes('11')) {
        return (
          <div className="relative">
            <Cloud className={`${className} text-gray-600 animate-shake`} />
            <div className="absolute top-2 left-3 animate-lightning">
              <Zap className="h-3 w-3 text-yellow-300" />
            </div>
          </div>
        );
      }
      if (iconCode.includes('13')) {
        return (
          <div className="relative">
            <CloudSnow className={`${className} text-blue-200 animate-float`} />
            <div className="absolute top-6 left-1 space-x-2 flex">
              <div className="w-1 h-1 bg-white rounded-full animate-snow-fall animation-delay-0"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-snow-fall animation-delay-500"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-snow-fall animation-delay-1000"></div>
            </div>
          </div>
        );
      }
    }

    // Fallback alla condizione testuale
    switch (condition) {
      case 'Clear':
        if (isNight) {
          return (
            <div className="relative">
              <Moon className={`${className} text-blue-200 animate-float`} />
              <div className="absolute -top-1 -right-2 animate-twinkle">
                <Star className="h-2 w-2 text-yellow-200" />
              </div>
              <div className="absolute top-2 -left-1 animate-twinkle animation-delay-1000">
                <Star className="h-1.5 w-1.5 text-blue-100" />
              </div>
            </div>
          );
        }
        return (
          <div className="relative">
            <Sun className={`${className} text-yellow-400 animate-spin-slow`} />
            <div className="absolute inset-0 opacity-30 animate-pulse">
              <Sun className={`${className} text-yellow-300`} />
            </div>
          </div>
        );
      
      case 'Clouds':
        if (isNight) {
          return (
            <div className="relative">
              <Cloud className={`${className} text-gray-400 animate-float`} />
              <div className="absolute -top-1 -left-2 animate-twinkle">
                <Moon className="h-3 w-3 text-blue-200" />
              </div>
              <div className="absolute top-1 -right-1 animate-drift">
                <div className="w-1.5 h-1.5 bg-blue-100 rounded-full opacity-60"></div>
              </div>
            </div>
          );
        }
        return (
          <div className="relative">
            <Cloud className={`${className} text-gray-300 animate-float`} />
            <div className="absolute -top-1 -right-1 animate-drift">
              <div className="w-2 h-2 bg-gray-200 rounded-full opacity-60"></div>
            </div>
          </div>
        );
      
      case 'Rain':
      case 'Drizzle':
        if (isNight) {
          return (
            <div className="relative">
              <CloudRain className={`${className} text-blue-500 animate-bounce-gentle`} />
              <div className="absolute -top-1 -left-1 animate-float">
                <Moon className="h-2.5 w-2.5 text-blue-200 opacity-70" />
              </div>
              <div className="absolute top-6 left-2 space-y-1">
                <div className="w-0.5 h-2 bg-blue-400 animate-rain-drop animation-delay-0"></div>
                <div className="w-0.5 h-2 bg-blue-400 animate-rain-drop animation-delay-300"></div>
                <div className="w-0.5 h-2 bg-blue-400 animate-rain-drop animation-delay-600"></div>
              </div>
            </div>
          );
        }
        return (
          <div className="relative">
            <CloudRain className={`${className} text-blue-400 animate-bounce-gentle`} />
            <div className="absolute top-6 left-2 space-y-1">
              <div className="w-0.5 h-2 bg-blue-300 animate-rain-drop animation-delay-0"></div>
              <div className="w-0.5 h-2 bg-blue-300 animate-rain-drop animation-delay-300"></div>
              <div className="w-0.5 h-2 bg-blue-300 animate-rain-drop animation-delay-600"></div>
            </div>
          </div>
        );
      
      case 'Snow':
        return (
          <div className="relative">
            <CloudSnow className={`${className} text-blue-200 animate-float`} />
            <div className="absolute top-6 left-1 space-x-2 flex">
              <div className="w-1 h-1 bg-white rounded-full animate-snow-fall animation-delay-0"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-snow-fall animation-delay-500"></div>
              <div className="w-1 h-1 bg-white rounded-full animate-snow-fall animation-delay-1000"></div>
            </div>
          </div>
        );
      
      case 'Thunderstorm':
        return (
          <div className="relative">
            <Cloud className={`${className} text-gray-600 animate-shake`} />
            <div className="absolute top-2 left-3 animate-lightning">
              <Zap className="h-3 w-3 text-yellow-300" />
            </div>
          </div>
        );
      
      default:
        return (
          <div className="relative">
            <Sun className={`${className} text-yellow-400 animate-spin-slow`} />
            <div className="absolute inset-0 opacity-30 animate-pulse">
              <Sun className={`${className} text-yellow-300`} />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="weather-icon-container">
      {getAnimatedIcon()}
    </div>
  );
};

export default AnimatedWeatherIcon;
