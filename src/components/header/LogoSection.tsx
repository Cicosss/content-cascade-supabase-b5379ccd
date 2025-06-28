
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MiaRomagnaLogo from '@/components/MiaRomagnaLogo';

const LogoSection = React.memo(() => {
  const navigate = useNavigate();

  const handleLogoClick = React.useCallback(() => {
    navigate('/');
  }, [navigate]);

  return (
    <div className="flex items-center space-x-3">
      <div 
        className="flex items-center space-x-3 cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 focus:ring-offset-slate-800 rounded-lg p-1" 
        onClick={handleLogoClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLogoClick();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Vai alla homepage"
      >
        <MiaRomagnaLogo width={120} height={40} />
        <div className="hidden sm:block">
          <p className="text-xs text-white italic">"Il territorio è tra le Tue mani"</p>
        </div>
      </div>
    </div>
  );
});

LogoSection.displayName = 'LogoSection';

export default LogoSection;
