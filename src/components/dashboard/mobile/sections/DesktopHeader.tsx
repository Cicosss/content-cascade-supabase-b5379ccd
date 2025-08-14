import React, { memo } from 'react';

/**
 * Presentational Component - Desktop Header
 * 
 * Responsabilità:
 * - Rendering header ottimizzato per desktop
 * - Testo più grande e dettagliato
 * - Layout expanded per schermi grandi
 */

interface DesktopHeaderProps {
  userName: string;
}

const DesktopHeader: React.FC<DesktopHeaderProps> = memo(({ userName }) => {
  return (
    <div className="text-center space-y-6 py-6 px-4">
      {/* Titolo grande per desktop */}
      <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-b from-white to-blue-100 bg-clip-text text-transparent leading-tight pt-2">
        Ciao, {userName}!
      </h1>
      
      {/* Sottotitolo dettagliato per desktop */}
      <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed tracking-wide">
        Iniziamo? Esplora la mappa o applica i filtri per scoprire la tua Romagna.
      </p>
    </div>
  );
});

DesktopHeader.displayName = 'DesktopHeader';

export default DesktopHeader;