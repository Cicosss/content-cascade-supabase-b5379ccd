import React from 'react';

interface OggiHeroSectionProps {
  formattedDate: string;
}

const OggiHeroSection: React.FC<OggiHeroSectionProps> = ({ formattedDate }) => {
  return (
    <div className="text-white py-16" style={{ backgroundColor: '#0F172A' }}>
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Oggi in Romagna: {formattedDate}
        </h1>
        <p className="text-xl max-w-3xl mx-auto">
          Scopri gli eventi imperdibili, le offerte esclusive e le esperienze uniche disponibili solo per le prossime 24 ore
        </p>
      </div>
    </div>
  );
};

export default OggiHeroSection;
