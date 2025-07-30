
import React from 'react';

const HeroBrandSection = () => {
  return (
    <div className="flex items-center justify-center w-full text-center">
      <h1 
        className="text-white/95 animate-fade-in"
        style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(8rem, 28vw, 28rem)",
          fontWeight: 700,
          lineHeight: 0.9
        }}
      >
        Il territorio<br />
        è tra le Tue<br />
        mani.
      </h1>
    </div>
  );
};

export default HeroBrandSection;
