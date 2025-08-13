
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
import { SidebarStyles } from '../core/SidebarStyles';
import { useSidebarDebug } from '../hooks/useSidebarDebug';

interface SidebarViewProps {
  enableGlassmorphism?: boolean;
}

const SidebarView: React.FC<SidebarViewProps> = ({ enableGlassmorphism = true }) => {
  const { logAction } = useSidebarDebug('SidebarView');

  React.useEffect(() => {
    logAction('SidebarView rendered', { enableGlassmorphism });
  }, [enableGlassmorphism, logAction]);

  return (
    <>
      {/* Menu Content */}
      <SidebarMenuContainer />
      
      {/* User Profile Footer */}
      <SidebarStyles 
        type="footer"
        enableGlassmorphism={enableGlassmorphism}
      >
        <BaseSidebarFooter className="border-t border-white/20 p-2">
          <UserProfileContainer />
        </BaseSidebarFooter>
      </SidebarStyles>
    </>
  );
};

SidebarView.displayName = 'SidebarView';

export { SidebarView };
