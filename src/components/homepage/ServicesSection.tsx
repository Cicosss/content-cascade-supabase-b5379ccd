
import React from 'react';
import ServiceCard from './ServiceCard';

interface Service {
  icon: string;
  label: string;
  desc: string;
}

interface ServicesSectionProps {
  services: Service[];
}

const ServicesSection: React.FC<ServicesSectionProps> = ({ services }) => {
  return (
    <section className="mb-16" role="region" aria-labelledby="services-heading">
      <h2 
        id="services-heading" 
        className="text-2xl font-bold text-gray-900 mb-6"
      >
        Servizi Vicini
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <ServiceCard 
            key={`${service.icon}-${index}`}
            {...service}
            index={index}
          />
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
