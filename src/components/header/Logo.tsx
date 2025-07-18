
import React from 'react';
import { Link } from 'react-router-dom';
import { useHeader } from '@/contexts/HeaderContext';

export const Logo: React.FC = () => {
  const { handleLogoClick } = useHeader();

  return (
    <Link 
      to="/" 
      className="flex items-center group"
      onClick={handleLogoClick}
      aria-label="Vai a Mia Romagna"
    >
      <img 
        src="/lovable-uploads/673fa174-b69d-4246-a652-97158e041630.png" 
        alt="Logo Mia Romagna" 
        className="h-24 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
      />
    </Link>
  );
};
