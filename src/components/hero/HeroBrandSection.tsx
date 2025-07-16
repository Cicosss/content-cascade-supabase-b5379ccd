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
  return (
    <div className="flex items-center justify-center mb-4 h-96">
      <OptimizedVaporizeText
        texts={[
          "Il territorio",
          "è tra le Tue",
          "mani."
        ]}
        font={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "36rem",
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
  );
};
export default HeroBrandSection;