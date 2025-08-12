
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
  return (
    <Sidebar 
      className="bg-[#F8F9FA]" 
      collapsible="icon"
    >
      <SidebarRail className="bg-transparent" />
      <MenuStateProvider>
        <SidebarContent className={isCollapsed ? "px-0 bg-[#F8F9FA]" : "px-2 bg-[#F8F9FA]"}>
          <SidebarView />
        </SidebarContent>
      </MenuStateProvider>
    </Sidebar>
  );
});

SidebarContainer.displayName = 'SidebarContainer';

export { SidebarContainer };
