
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { BrandLogotype } from '@/components/brand/BrandLogotype';

const HeroBrandSection = () => {
  const isMobile = useIsMobile();

  // Su mobile nascondiamo completamente questa sezione
  if (isMobile) {
    return null;
  }

  return (
    <div className="flex flex-col items-start justify-center w-full text-left md:text-left px-4 md:px-8 lg:px-16">
      <BrandLogotype 
        size="large"
        theme="dark"
        linkable={false}
        payoff="IL TUO TERRITORIO"
        className="mb-4 md:mb-6"
      />
      <p className="typography-subtitle text-xl md:text-2xl lg:text-3xl text-white/90 font-light leading-relaxed max-w-2xl">
        Qui le emozioni sovrastano le onde del mare
      </p>
    </div>
  );
};

export default HeroBrandSection;
