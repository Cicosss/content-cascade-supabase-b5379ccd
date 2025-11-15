
import React from 'react';

interface MiaRomagnaLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const MiaRomagnaLogoComponent: React.FC<MiaRomagnaLogoProps> = ({ 
  width = 40, 
  height = 40, 
  className = "" 
}) => {
  // Using the correct Mia Romagna logo provided by the user
  const logoUrl = "/lovable-uploads/673fa174-b69d-4246-a652-97158e041630.png";
  
  return (
    <img
      src={logoUrl}
      alt="Mia Romagna Logo"
      width={width}
      height={height}
      className={`object-contain ${className}`}
      onError={(e) => {
        // Fallback to a colored background if image fails to load
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          parent.innerHTML = `
            <div class="flex h-${height/4} w-${width/4} items-center justify-center rounded-xl bg-gradient-to-br from-red-500 via-orange-400 to-yellow-300 shadow-md">
              <span class="text-white font-bold text-lg">MR</span>
            </div>
          `;
        }
      }}
    />
  );
};

// Memoized export for performance optimization
const MiaRomagnaLogo = React.memo(MiaRomagnaLogoComponent);

export default MiaRomagnaLogo;
