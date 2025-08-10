
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
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { MenuStateProvider } from '@/contexts/MenuStateContext';
import { SidebarView } from '../views/SidebarView';

const SidebarContainer = React.memo(() => {
  return (
    <Sidebar 
      className="border-r border-slate-200 bg-[#F8F9FA]" 
      collapsible="icon"
    >
      <MenuStateProvider>
        <SidebarContent className="px-2 bg-[#F8F9FA]">
          <SidebarView />
        </SidebarContent>
      </MenuStateProvider>
    </Sidebar>
  );
});

SidebarContainer.displayName = 'SidebarContainer';

export { SidebarContainer };
