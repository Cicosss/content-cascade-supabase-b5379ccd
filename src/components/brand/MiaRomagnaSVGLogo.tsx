import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface MiaRomagnaSVGLogoProps {
  /** Dimensione del logo */
  size?: 'small' | 'medium' | 'large' | 'navbar-version';
  /** Tema colore */
  theme?: 'light' | 'dark';
  /** Se deve essere un link alla homepage */
  linkable?: boolean;
  /** Classi CSS aggiuntive */
  className?: string;
  /** Click handler se non è linkable */
  onClick?: () => void;
}

export const MiaRomagnaSVGLogo: React.FC<MiaRomagnaSVGLogoProps> = ({
  size = 'medium',
  theme = 'dark',
  linkable = true,
  className,
  onClick
}) => {
  // Dimensioni responsive basate sulla size
  const dimensions = {
    small: { width: 200, height: 67 },
    medium: { width: 300, height: 100 },
    large: { width: 450, height: 150 },
    'navbar-version': { width: 180, height: 60 }
  };

  const { width, height } = dimensions[size];
  
  // Font sizes responsive
  const fontSizes = {
    small: { main: 24, tagline: 6 },
    medium: { main: 32, tagline: 8 },
    large: { main: 48, tagline: 12 },
    'navbar-version': { main: 28, tagline: 7 }
  };

  const { main: mainFontSize, tagline: taglineFontSize } = fontSizes[size];

  const content = (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      xmlns="http://www.w3.org/2000/svg"
      className={cn('transition-all duration-300 hover:scale-105', className)}
      onClick={onClick}
    >
      <defs>
        {/* Gradiente per tema chiaro */}
        <linearGradient id={`premiumGradient-${theme}-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
          {theme === 'light' ? (
            <>
              <stop offset="0%" style={{stopColor:'#2c3e50', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#34495e', stopOpacity:1}} />
            </>
          ) : (
            <>
              <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:1}} />
              <stop offset="100%" style={{stopColor:'#f8f9fa', stopOpacity:1}} />
            </>
          )}
        </linearGradient>
        
        {/* Gradiente per lo slogan */}
        <linearGradient id={`taglineGradient-${theme}-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
          {theme === 'light' ? (
            <>
              <stop offset="0%" style={{stopColor:'#2c3e50', stopOpacity:0.95}} />
              <stop offset="100%" style={{stopColor:'#34495e', stopOpacity:0.9}} />
            </>
          ) : (
            <>
              <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:0.95}} />
              <stop offset="100%" style={{stopColor:'#f1f3f4', stopOpacity:0.9}} />
            </>
          )}
        </linearGradient>
        
        {/* Ombra elegante */}
        <filter id={`elegantShadow-${theme}-${size}`} x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(0,0,0,0.12)"/>
        </filter>
        
        {/* Bagliore sottile */}
        <filter id={`subtleGlow-${theme}-${size}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Testo principale "Mia Romagna" */}
      <text 
        x={width/2} 
        y={height * 0.4} 
        textAnchor="middle" 
        style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 700,
          fontSize: `${mainFontSize}px`,
          fill: `url(#premiumGradient-${theme}-${size})`,
          letterSpacing: '1px',
          filter: `url(#elegantShadow-${theme}-${size})`
        }}
      >
        Mia Romagna
      </text>
      
      {/* Slogan */}
      <text 
        x={width/2} 
        y={height * 0.65} 
        textAnchor="middle" 
        style={{
          fontFamily: 'var(--font-sans)',
          fontWeight: 300,
          fontSize: `${taglineFontSize}px`,
          fill: `url(#taglineGradient-${theme}-${size})`,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          filter: `url(#subtleGlow-${theme}-${size})`
        }}
      >
        IL TERRITORIO È TRA LE TUE MANI
      </text>
    </svg>
  );

  if (linkable) {
    return (
      <Link to="/" className="inline-block">
        {content}
      </Link>
    );
  }

  return content;
};

export default MiaRomagnaSVGLogo;