
import React from 'react';
import ServiceCard from './ServiceCard';

// Static services section - these are app features, not database content
const services = [
  {
    icon: "🏨",
    label: "Alloggi e Hotel",
    desc: "Trova la sistemazione perfetta per il tuo soggiorno"
  },
  {
    icon: "🚗",
    label: "Trasporti e Mobilità",
    desc: "Muoviti facilmente con i nostri consigli di viaggio"
  },
  {
    icon: "ℹ️",
    label: "Informazioni Turistiche",
    desc: "Tutto quello che devi sapere per visitare la Romagna"
  }
];

const ServicesSection: React.FC = () => {
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
