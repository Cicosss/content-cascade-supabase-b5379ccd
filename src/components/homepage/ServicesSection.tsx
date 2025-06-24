
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
  const iconMap = {
    Car,
    Zap,
    ParkingCircle
  };

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Servizi Vicini</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const IconComponent = iconMap[service.icon as keyof typeof iconMap];
          return (
            <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer">
              <IconComponent className="h-12 w-12 mx-auto mb-4 text-blue-600" />
              <div className="font-semibold text-lg mb-2">{service.label}</div>
              <div className="text-gray-600">{service.desc}</div>
            </Card>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;
