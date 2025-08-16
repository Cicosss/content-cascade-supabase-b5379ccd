
import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigation } from '@/hooks/useNavigation';
import { BrandLogotype } from '@/components/brand/BrandLogotype';

export const Logo: React.FC = () => {
  const { handleLogoClick } = useNavigation();

  return (
    <Link 
      to="/" 
      className="flex items-center group"
      onClick={handleLogoClick}
      aria-label="Vai a Mia Romagna"
    >
      <BrandLogotype 
        size="small"
        theme="dark"
        premium={true}
        linkable={false}
        className="mt-4"
      />
    </Link>
  );
};
