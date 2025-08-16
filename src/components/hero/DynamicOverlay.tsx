
import React from 'react';

interface DynamicOverlayProps {
  isHovered: boolean;
}

const DynamicOverlay: React.FC<DynamicOverlayProps> = ({ isHovered }) => {
  return (
    <div 
      className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/20 to-slate-900/50"
    />
  );
};

export default DynamicOverlay;
