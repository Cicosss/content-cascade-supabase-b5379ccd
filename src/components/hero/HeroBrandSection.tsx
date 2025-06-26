
import React from 'react';
import MiaRomagnaLogo from '@/components/MiaRomagnaLogo';

const HeroBrandSection = () => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      <MiaRomagnaLogo width={160} height={53} className="drop-shadow-lg" />
      <div>
        <p className="typography-subtitle text-brand-yellow-400 drop-shadow-lg">
          "Il territorio è tra le Tue mani"
        </p>
      </div>
    </div>
  );
};

export default HeroBrandSection;
