
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
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
        Nel cuore della Romagna
      </h1>
      <p className="text-xl md:text-2xl lg:text-3xl text-white/90 font-light leading-relaxed max-w-2xl">
        Qui le emozioni sovrastano le onde del mare
      </p>
    </div>
  );
};

export default HeroBrandSection;
