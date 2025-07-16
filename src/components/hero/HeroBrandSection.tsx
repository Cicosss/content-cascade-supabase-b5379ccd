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
  // Utilizzo CSS clamp per responsività fluida e sicura
  const responsiveFontSize = "clamp(2.5rem, 8vw, 8rem)";

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
            fontSize: responsiveFontSize,
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