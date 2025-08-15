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
    <div className="text-center space-y-4 pt-4 px-2">
      {/* Titolo più compatto per mobile */}
      <h1 className="typography-h1 text-3xl sm:text-4xl bg-gradient-to-b from-white to-blue-100 bg-clip-text text-transparent pt-2">
        Ciao, {userName}!
      </h1>
      
      {/* Sottotitolo ridotto per mobile */}
      <p className="typography-subtitle text-lg sm:text-xl text-white/80 px-4">
        Esplora la mappa per scoprire la tua Romagna
      </p>
    </div>
  );
});

MobileHeader.displayName = 'MobileHeader';

export default MobileHeader;