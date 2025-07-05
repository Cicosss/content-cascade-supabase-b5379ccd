
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Car, Zap, ParkingCircle, LucideProps } from 'lucide-react';
import { useServiceVisibility } from '@/hooks/useServiceVisibility';

interface Service {
  icon: string;
  label: string;
  desc: string;
}

interface ServiceCardProps extends Service {
  index: number;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ icon, label, desc, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { isVisible, elementRef } = useServiceVisibility();

  const getIconComponent = (iconName: string): React.ComponentType<LucideProps> => {
    const iconMap = {
      Car,
      Zap,
      ParkingCircle,
    };
    return iconMap[iconName as keyof typeof iconMap] || Car;
  };

  const getAnimationClass = (iconName: string): string => {
    if (!isVisible) return '';
    
    const animationMap = {
      Car: 'service-taxi-icon',
      Zap: 'service-ev-icon',
      ParkingCircle: 'service-parking-icon',
    };
    
    return animationMap[iconName as keyof typeof animationMap] || '';
  };

  const IconComponent = getIconComponent(icon);
  const animationClass = getAnimationClass(icon);

  const handleInteraction = (event: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in event && event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    
    if ('key' in event) {
      event.preventDefault();
    }
    
    // Logica per l'azione del servizio può essere implementata qui
    console.log(`Servizio ${label} selezionato`);
  };

  return (
    <Card 
      ref={elementRef}
      className="service-card p-6 text-center cursor-pointer border-2 hover:border-blue-200 transition-all duration-300 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleInteraction}
      onKeyDown={handleInteraction}
      tabIndex={0}
      role="button"
      aria-label={`${label}: ${desc}`}
    >
      <div className="icon-container flex justify-center items-center mb-4">
        {isVisible && (
          <IconComponent 
            className={`h-12 w-12 text-blue-600 transition-all duration-300 ${animationClass}`}
            strokeWidth={1.5}
            aria-hidden="true"
          />
        )}
      </div>
      <div className="font-semibold text-lg mb-2 text-gray-800">
        {label}
      </div>
      <div className="text-gray-600 text-sm leading-relaxed">
        {desc}
      </div>
    </Card>
  );
};

export default ServiceCard;
