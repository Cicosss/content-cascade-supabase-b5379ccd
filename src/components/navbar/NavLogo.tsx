import React from 'react';
import { Link } from 'react-router-dom';

interface NavLogoProps {
  url: string;
  src?: string;
  alt: string;
  title: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: (e: React.MouseEvent) => void;
}

const sizeClasses = {
  sm: 'h-12',
  md: 'h-18', 
  lg: 'h-20'
};

export const NavLogo: React.FC<NavLogoProps> = ({ 
  url, 
  src, 
  alt, 
  title, 
  size = 'md',
  onClick 
}) => {
  return (
    <Link 
      to={url} 
      className="flex items-center group"
      onClick={onClick}
      aria-label={`Vai a ${title}`}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          className={`${sizeClasses[size]} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
        />
      ) : (
        <div className={`${sizeClasses[size]} ${sizeClasses[size]} rounded bg-white flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
          <span className="text-slate-900 font-bold text-xl">M</span>
        </div>
      )}
    </Link>
  );
};