
import React from 'react';

const PartnersSection = () => {
  const partners = [
    "Comune di Rimini",
    "Legambiente Romagna", 
    "Cooperative Sociali"
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">
          In Collaborazione Con
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
          {partners.map((partner, index) => (
            <div 
              key={index}
              className="text-slate-300 text-lg font-semibold px-6 py-3 bg-white border-2 border-dashed border-slate-200 rounded-lg"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
