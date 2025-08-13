/**
 * STYLES HOOK: useSidebarStyles
 * 
 * Responsabilità:
 * - Gestione centralizzata stili glassmorphism
 * - Calcolo dinamico degli stili in base allo stato
 * - Fallback e error handling per gli stili
 */

import { useMemo } from 'react';
import { useSidebarDebug } from './useSidebarDebug';

interface GlassmorphismStyles {
  container: React.CSSProperties;
  content: React.CSSProperties;
  footer: React.CSSProperties;
}

export const useSidebarStyles = (): GlassmorphismStyles => {
  const { isCollapsed, logAction, logError } = useSidebarDebug('useSidebarStyles');

  const styles = useMemo((): GlassmorphismStyles => {
    try {
      logAction('Calculating glassmorphism styles', { isCollapsed });

      const baseGlassmorphism = {
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      };

      return {
        container: {
          ...baseGlassmorphism,
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
        },
        content: {
          ...baseGlassmorphism,
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderRadius: '12px'
        },
        footer: {
          ...baseGlassmorphism,
          background: 'rgba(255, 255, 255, 0.12)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '0 0 12px 12px',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)'
        }
      };
    } catch (error) {
      logError('Failed to calculate styles', error);
      
      // Fallback styles
      return {
        container: {},
        content: {},
        footer: {}
      };
    }
  }, [isCollapsed, logAction, logError]);

  return styles;
};