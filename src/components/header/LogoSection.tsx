
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MiaRomagnaLogo from '@/components/MiaRomagnaLogo';

const LogoSection = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center space-x-3">
      <div 
        className="flex items-center space-x-3 cursor-pointer" 
        onClick={() => navigate('/')}
      >
        <MiaRomagnaLogo width={120} height={40} />
        <div className="hidden sm:block">
          <p className="text-xs text-white italic">"Il territorio è tra le Tue mani"</p>
        </div>
      </div>
    </div>
  );
};

export default LogoSection;
