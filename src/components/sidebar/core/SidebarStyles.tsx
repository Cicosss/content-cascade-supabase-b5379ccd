/**
 * STYLES COMPONENT: SidebarStyles
 * 
 * Responsabilità:
 * - Wrapper per applicazione stili glassmorphism
 * - Gestione condizionale degli stili
 * - Separazione responsabilità styling
 */

import React from 'react';
import { useSidebarStyles } from '../hooks/useSidebarStyles';
import { useSidebarDebug } from '../hooks/useSidebarDebug';

interface SidebarStylesProps {
  children: React.ReactNode;
  type: 'container' | 'content' | 'footer';
  className?: string;
  enableGlassmorphism?: boolean;
}

const SidebarStyles: React.FC<SidebarStylesProps> = ({ 
  children, 
  type, 
  className = '',
  enableGlassmorphism = true 
}) => {
  const styles = useSidebarStyles();
  const { logAction } = useSidebarDebug('SidebarStyles');

  const appliedStyles = enableGlassmorphism ? styles[type] : {};

  React.useEffect(() => {
    logAction(`Applying ${type} styles`, { 
      enableGlassmorphism, 
      hasStyles: Object.keys(appliedStyles).length > 0 
    });
  }, [type, enableGlassmorphism, appliedStyles, logAction]);

  return (
    <div 
      style={appliedStyles}
      className={className}
    >
      {children}
    </div>
  );
};

export { SidebarStyles };