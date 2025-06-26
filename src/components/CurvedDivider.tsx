
import React from 'react';

interface CurvedDividerProps {
  className?: string;
  variant?: 'wave' | 'curve' | 'gentle-wave';
  color?: 'brand-blue' | 'brand-yellow' | 'white' | 'slate';
  flip?: boolean;
}

const CurvedDivider: React.FC<CurvedDividerProps> = ({ 
  className = "", 
  variant = 'wave',
  color = 'brand-blue',
  flip = false 
}) => {
  const colorMap = {
    'brand-blue': '#0F172A',
    'brand-yellow': '#fbbf24',
    'white': '#ffffff',
    'slate': '#64748b'
  };

  const pathVariants = {
    wave: "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z",
    curve: "M0,96L1440,32L1440,0L0,0Z",
    'gentle-wave': "M0,64L60,69.3C120,75,240,85,360,80C480,75,600,53,720,48C840,43,960,53,1080,64C1200,75,1320,85,1380,90.7L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
  };

  return (
    <div className={`relative ${className}`}>
      <svg 
        className={`w-full h-16 md:h-20 ${flip ? 'rotate-180' : ''}`}
        viewBox="0 0 1440 96" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path 
          d={pathVariants[variant]}
          fill={colorMap[color]}
          opacity="0.8"
        />
      </svg>
    </div>
  );
};

export default CurvedDivider;
