import React, { memo } from 'react';

/**
 * Presentational Component - Mobile Header
 * 
 * Responsabilità:
 * - Rendering header ottimizzato per mobile
 * - Testo responsive e compatto
 * - Gradiente e styling mobile-first
 */

interface MobileHeaderProps {
  userName: string;
}

const MobileHeader: React.FC<MobileHeaderProps> = memo(({ userName }) => {
  return (
    <div className="text-center space-y-4">
      {/* Titolo più compatto per mobile */}
      <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-b from-white to-blue-100 bg-clip-text text-transparent">
        Ciao, {userName}!
      </h1>
      
      {/* Sottotitolo ridotto per mobile */}
      <p className="text-lg sm:text-xl text-white/80 leading-relaxed px-4">
        Esplora la mappa per scoprire la tua Romagna
      </p>
      
      {/* Barra decorativa */}
      <div className="flex justify-center">
        <div className="w-24 h-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-blue-600 rounded-full"></div>
      </div>
    </div>
  );
});

MobileHeader.displayName = 'MobileHeader';

export default MobileHeader;