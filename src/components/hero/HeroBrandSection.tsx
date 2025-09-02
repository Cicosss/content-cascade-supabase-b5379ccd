
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroBrandSection = () => {
  const isMobile = useIsMobile();

  // Su mobile nascondiamo completamente questa sezione
  if (isMobile) {
    return null;
  }

  return (
    <div className="flex flex-col items-start justify-center w-full text-left md:text-left px-4 md:px-8 lg:px-16">
      <h1 className="typography-h1 text-4xl md:text-6xl lg:text-7xl text-white mb-4 md:mb-6">
        Romagna Autentica: il Tuo Passaporto per Tesori Nascosti
      </h1>
      <p className="typography-subtitle text-xl md:text-2xl lg:text-3xl text-white/90 font-light leading-relaxed max-w-2xl">
        Accedi a luoghi unici e storie genuine che solo i romagnoli conoscono davvero.
      </p>
    </div>
  );
};

export default HeroBrandSection;
