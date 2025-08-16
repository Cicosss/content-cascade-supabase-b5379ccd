
import React from 'react';

interface DynamicOverlayProps {
  isHovered: boolean;
}

const DynamicOverlay: React.FC<DynamicOverlayProps> = ({ isHovered }) => {
  return (
    <div 
      className={`absolute inset-0 pointer-events-none -z-10 transition-opacity duration-300 ${
        isHovered ? 'opacity-80' : 'opacity-100'
      }`}
      style={{ willChange: 'opacity' }}
    />
  );
};

export default DynamicOverlay;
