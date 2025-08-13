
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

const SidebarView = React.memo(() => {
  const footerStyles = {
    background: 'rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: '0 0 12px 12px',
    borderTop: '1px solid rgba(255, 255, 255, 0.2)'
  };

  return (
    <>
      {/* Menu Content */}
      <SidebarMenuContainer />
      
      {/* User Profile Footer */}
      <BaseSidebarFooter 
        className="border-t border-white/20 p-2"
        style={footerStyles}
      >
        <UserProfileContainer />
      </BaseSidebarFooter>
    </>
  );
});

SidebarView.displayName = 'SidebarView';

export { SidebarView };
