import React, { useState } from 'react';
import OptimizedVaporizeText, { Tag } from "@/components/ui/optimized-vaporize-text";

interface HeroBrandSectionProps {
  onTextReady?: () => void;
  startAnimation?: boolean;
}

const HeroBrandSection: React.FC<HeroBrandSectionProps> = ({ 
  onTextReady, 
  startAnimation = false 
}) => {
  // Funzione per calcolare fontSize responsivo
  const getResponsiveFontSize = () => {
    if (typeof window === 'undefined') return "8rem";
    
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    
    // Base size responsivo basato su viewport
    if (vw >= 1536) return "12rem";  // 2xl
    if (vw >= 1280) return "10rem";  // xl  
    if (vw >= 1024) return "8rem";   // lg
    if (vw >= 768) return "6rem";    // md
    if (vw >= 640) return "4rem";    // sm
    return "3rem";                   // mobile
  };

  return (
    <div className="flex items-center justify-center mb-8 px-4 w-full h-80 md:h-96">
      <div className="w-full max-w-7xl mx-auto">
        <OptimizedVaporizeText
          texts={[
            "Il territorio",
            "è tra le Tue",
            "mani."
          ]}
          font={{
            fontFamily: "'Playfair Display', serif",
            fontSize: getResponsiveFontSize(),
            fontWeight: 700
          }}
          color="rgba(255, 255, 255, 0.9)"
          animation={{
            vaporizeDuration: 1.5,
            fadeInDuration: 1.0,
            waitDuration: 0.8
          }}
          tag={Tag.H2}
          onReady={onTextReady}
          startAnimation={startAnimation}
        />
      </div>
    </div>
  );
};
export default HeroBrandSection;