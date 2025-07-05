
import React from 'react';
import { Card } from '@/components/ui/card';
import { Car, Zap, ParkingCircle } from 'lucide-react';

interface Service {
  icon: string;
  label: string;
  desc: string;
}

interface ServicesSectionProps {
  services: Service[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Car':
        return Car;
      case 'Zap':
        return Zap;
      case 'ParkingCircle':
        return ParkingCircle;
      default:
        return Car;
    }
  };

  const getAnimationClass = (iconName: string) => {
    switch (iconName) {
      case 'Car':
        return 'service-taxi-icon';
      case 'Zap':
        return 'service-ev-icon';
      case 'ParkingCircle':
        return 'service-parking-icon';
      default:
        return '';
    }
  };

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Servizi Vicini</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const IconComponent = getIconComponent(service.icon);
          const animationClass = getAnimationClass(service.icon);
          
          return (
            <Card 
              key={index} 
              className="service-card p-6 text-center cursor-pointer border-2 hover:border-blue-200"
            >
              <IconComponent 
                className={`h-12 w-12 mx-auto mb-4 text-blue-600 ${animationClass}`}
                strokeWidth={1.5}
              />
              <div className="font-semibold text-lg mb-2 text-gray-800">{service.label}</div>
              <div className="text-gray-600 text-sm leading-relaxed">{service.desc}</div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;
