import React from 'react';

const HeroBrandSection = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full text-center relative z-20 px-4">
      <h1 
        className="typography-h1 text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white mb-3 sm:mb-4 md:mb-6 leading-tight"
        style={{
          textShadow: '0 1px 0 rgba(255, 255, 255, 0.4), 0 2px 3px rgba(0, 0, 0, 0.8), 0 4px 8px rgba(0, 0, 0, 0.6), 0 8px 16px rgba(0, 0, 0, 0.4)',
          WebkitTextStroke: '1px rgba(0, 0, 0, 0.3)',
          paintOrder: 'stroke fill'
        }}
      >
        Il Tuo Passaporto per Tesori Nascosti
      </h1>
      <p 
        className="typography-subtitle text-base sm:text-lg md:text-xl lg:text-2xl text-white font-light leading-relaxed max-w-xl md:max-w-2xl"
        style={{
          textShadow: '0 1px 0 rgba(255, 255, 255, 0.3), 0 2px 4px rgba(0, 0, 0, 0.7), 0 4px 8px rgba(0, 0, 0, 0.5)',
          WebkitTextStroke: '0.5px rgba(0, 0, 0, 0.2)',
          paintOrder: 'stroke fill'
        }}
      >
        Accedi a luoghi unici e storie genuine che solo i romagnoli conoscono davvero.
      </p>
    </div>
  );
};

export default HeroBrandSection;
