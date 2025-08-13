
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigation } from '@/hooks/useNavigation';
import { LOGO_CONFIG } from '@/config/navigationConfig';

export const Logo: React.FC = () => {
  const { handleLogoClick } = useNavigation();

  return (
    <Link 
      to="/" 
      className="flex items-center group"
      onClick={handleLogoClick}
      aria-label="Vai a Mia Romagna"
    >
      <img 
        src={LOGO_CONFIG.src} 
        alt={LOGO_CONFIG.alt} 
        className="h-24 w-24 object-contain transition-transform duration-200 group-hover:scale-105"
      />
    </Link>
  );
};
