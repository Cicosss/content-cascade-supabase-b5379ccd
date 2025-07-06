
import React from 'react';

interface DynamicOverlayProps {
  isHovered: boolean;
}

const DynamicOverlay: React.FC<DynamicOverlayProps> = ({ isHovered }) => {
  return (
    <div 
      className={`absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/70 transition-opacity duration-300 ${
        isHovered ? 'opacity-80' : 'opacity-100'
      }`}
      style={{ willChange: 'opacity' }}
    />
  );
};

export default DynamicOverlay;
