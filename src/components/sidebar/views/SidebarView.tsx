
/**
 * LAYOUT COMPONENT: SidebarView
 * 
 * Responsabilità:
 * - Layout strutturale della sidebar (header, content, footer)
 * - Coordinamento tra menu e profilo utente
 * - Styling del footer
 * 
 * Architettura:
 * - Delega logica menu a SidebarMenuContainer
 * - Delega logica profilo a UserProfileContainer
 * - Mantiene solo responsabilità di layout
 */

import React from 'react';
import { SidebarMenuContainer } from '../containers/SidebarMenuContainer';
import { UserProfileContainer } from '../containers/UserProfileContainer';
import { SidebarFooter as BaseSidebarFooter } from '@/components/ui/sidebar';
import { useSidebarDebug } from '../hooks/useSidebarDebug';

interface SidebarViewProps {
  enableGlassmorphism?: boolean;
}

const SidebarView: React.FC<SidebarViewProps> = ({ enableGlassmorphism = true }) => {
  const { logAction } = useSidebarDebug('SidebarView');

  React.useEffect(() => {
    logAction('SidebarView rendered', { enableGlassmorphism });
  }, [enableGlassmorphism, logAction]);

  const footerClasses = enableGlassmorphism 
    ? 'glassmorphism-footer border-t border-white/20 p-2' 
    : 'border-t border-border p-2';

  return (
    <>
      {/* Menu Content */}
      <SidebarMenuContainer />
      
      {/* User Profile Footer */}
      <BaseSidebarFooter className={footerClasses}>
        <UserProfileContainer />
      </BaseSidebarFooter>
    </>
  );
};

SidebarView.displayName = 'SidebarView';

export { SidebarView };
