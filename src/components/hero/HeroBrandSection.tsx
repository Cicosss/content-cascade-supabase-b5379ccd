import React, { useState, useEffect } from 'react';
import OptimizedVaporizeText, { Tag } from "@/components/ui/optimized-vaporize-text";

interface HeroBrandSectionProps {
  onTextReady?: () => void;
  startAnimation?: boolean;
}

const HeroBrandSection: React.FC<HeroBrandSectionProps> = ({ 
  onTextReady, 
  startAnimation = false 
}) => {
  const [showFallback, setShowFallback] = useState(false);

  // Timeout di sicurezza: se dopo 2 secondi non è pronto, mostra fallback
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      console.log("Timeout reached - showing fallback text");
      setShowFallback(true);
      onTextReady?.();
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [onTextReady]);

  // Fallback component per garantire sempre visibilità del testo
  const FallbackText = () => (
    <div className="text-center animate-fade-in">
      <h2 
        className="font-bold text-white/90 leading-tight"
        style={{ 
          fontFamily: "'Playfair Display', serif, Georgia, serif",
          fontSize: "clamp(2.5rem, 8vw, 8rem)"
        }}
      >
        Il territorio<br />
        è tra le Tue<br />
        mani.
      </h2>
    </div>
  );

  const handleCanvasReady = () => {
    console.log("Canvas animation ready, not showing fallback");
    onTextReady?.();
  };

  const handleCanvasError = () => {
    console.log("Canvas animation failed, showing fallback text");
    setShowFallback(true);
    onTextReady?.();
  };

  return (
    <div className="flex items-center justify-center mb-8 px-4 w-full h-80 md:h-96">
      <div className="w-full max-w-7xl mx-auto">
        {showFallback ? (
          <FallbackText />
        ) : (
          <OptimizedVaporizeText
            texts={[
              "Il territorio",
              "è tra le Tue",
              "mani."
            ]}
            font={{
              fontFamily: "'Playfair Display', serif, Georgia, serif",
              fontSize: "clamp(2.5rem, 8vw, 8rem)",
              fontWeight: 700
            }}
            color="rgba(255, 255, 255, 0.9)"
            animation={{
              vaporizeDuration: 1.5,
              fadeInDuration: 1.0,
              waitDuration: 0.8
            }}
            tag={Tag.H2}
            onReady={handleCanvasReady}
            onError={handleCanvasError}
            startAnimation={startAnimation}
          />
        )}
      </div>
    </div>
  );
};
export default HeroBrandSection;