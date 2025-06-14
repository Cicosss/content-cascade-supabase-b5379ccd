
import React from 'react';
import { Button } from '@/components/ui/button';

const PartnerHero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://i.ibb.co/1JRNxJpY/Progetto-senza-titolo-6.png")'
      }}
    >
      <div className="container mx-auto px-4 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          Diventa Partner della Romagna Autentica
        </h1>
        <h2 className="text-2xl md:text-3xl mb-8 font-light max-w-4xl mx-auto">
          Porta la tua attività davanti a migliaia di viaggiatori e locali in cerca di esperienze uniche
        </h2>
        <Button 
          onClick={() => scrollToSection('vantaggi')}
          className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-white text-xl px-12 py-4 h-auto rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold"
        >
          Scopri i Vantaggi
        </Button>
      </div>
    </div>
  );
};

export default PartnerHero;
