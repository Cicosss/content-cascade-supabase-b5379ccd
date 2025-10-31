import React from 'react';

const HeroBrandSection = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full text-center relative z-20 px-4">
      <h1 className="typography-h1 text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-white mb-3 sm:mb-4 md:mb-6 drop-shadow-2xl text-shadow-lg leading-tight">
        Il Tuo Passaporto per Tesori Nascosti
      </h1>
      <p className="typography-subtitle text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light leading-relaxed max-w-xl md:max-w-2xl drop-shadow-2xl text-shadow-lg">
        Accedi a luoghi unici e storie genuine che solo i romagnoli conoscono davvero.
      </p>
    </div>
  );
};

export default HeroBrandSection;
