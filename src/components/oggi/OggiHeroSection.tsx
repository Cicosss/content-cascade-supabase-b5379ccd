import React from 'react';

interface OggiHeroSectionProps {
  formattedDate: string;
}

const OggiHeroSection: React.FC<OggiHeroSectionProps> = ({ formattedDate }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-800 text-white py-16 lg:py-24">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 right-20 w-20 h-20 bg-primary/10 rounded-full animate-float animation-delay-0"></div>
        <div className="absolute bottom-16 left-16 w-16 h-16 bg-accent/10 rounded-full animate-drift animation-delay-700"></div>
        <div className="absolute top-1/3 right-10 w-12 h-12 bg-secondary/10 rounded-full animate-pulse animation-delay-1200"></div>
      </div>

      {/* 3D Relief Shadow Layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-slate-900/30 transform translate-x-1 translate-y-1 blur-sm -z-10"></div>
      
      <div className="container mx-auto px-4 lg:px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 lg:mb-8 leading-tight tracking-tight text-white animate-fade-in">
            <span className="bg-gradient-to-r from-gold-400 via-yellow-300 to-gold-500 bg-clip-text text-transparent">
              Oggi in Romagna
            </span>
          </h1>
          <div className="font-lora text-xl sm:text-2xl lg:text-3xl text-slate-300 mb-6 lg:mb-8 font-medium animate-fade-in animation-delay-300">
            {formattedDate}
          </div>
          <p className="font-lora text-lg sm:text-xl lg:text-2xl max-w-3xl mx-auto leading-relaxed text-slate-200 animate-fade-in animation-delay-600">
            Scopri gli eventi imperdibili, le offerte esclusive e le esperienze uniche 
            <span className="font-playfair font-bold text-gold-400 block mt-2">
              disponibili solo per le prossime 24 ore
            </span>
          </p>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 right-8 w-2 h-2 bg-gold-400/40 rounded-full animate-twinkle animation-delay-0"></div>
          <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-blue-400/40 rounded-full animate-twinkle animation-delay-500"></div>
          <div className="absolute top-1/3 left-8 w-1 h-1 bg-white/40 rounded-full animate-twinkle animation-delay-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default OggiHeroSection;
