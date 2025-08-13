
/**
 * SMART CONTAINER: SidebarContainer
 * 
 * Responsabilità:
 * - Layout principale della sidebar
 * - Configurazione collapsible e styling globale
 * - Coordinamento tra menu e profilo utente
 * - Provider per MenuState context
 * 
 * Architettura:
 * - Container padre per tutti i componenti sidebar
 * - Gestisce layout responsive e positioning
 * - Delega logica specifica ai sotto-container
 */

import React from 'react';
import { Sidebar, SidebarContent, SidebarRail, useSidebar } from '@/components/ui/sidebar';
import { MenuStateProvider } from '@/contexts/MenuStateContext';
import { SidebarView } from '../views/SidebarView';

const SidebarContainer = React.memo(() => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';
  
  const glassmorphismStyles = {
    background: 'rgba(255, 255, 255, 0.15)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  };

  const contentStyles = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    borderRadius: '12px'
  };

  return (
    <Sidebar 
      style={glassmorphismStyles}
      collapsible="icon"
    >
      <SidebarRail className="bg-transparent" />
      <MenuStateProvider>
        <SidebarContent 
          className={isCollapsed ? "px-0" : "px-2"}
          style={contentStyles}
        >
          <SidebarView />
        </SidebarContent>
      </MenuStateProvider>
    </Sidebar>
  );
});

SidebarContainer.displayName = 'SidebarContainer';

export { SidebarContainer };
