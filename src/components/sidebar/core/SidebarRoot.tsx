/**
 * ROOT COMPONENT: SidebarRoot
 * 
 * Responsabilità:
 * - Entry point semplificato per la sidebar
 * - Orchestrazione componenti principali
 * - Debug wrapper
 * - Gestione stili glassmorphism pulita
 */

import React from 'react';
import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar';
import { MenuStateProvider } from '@/contexts/MenuStateContext';
import { SidebarView } from '../views/SidebarView';
import { SidebarStyles } from './SidebarStyles';
import { SidebarDebugger } from './SidebarDebugger';
import { useSidebarDebug } from '../hooks/useSidebarDebug';

interface SidebarRootProps {
  enableDebug?: boolean;
  enableGlassmorphism?: boolean;
}

const SidebarRoot: React.FC<SidebarRootProps> = ({ 
  enableDebug = false,
  enableGlassmorphism = true 
}) => {
  const { isCollapsed, logAction } = useSidebarDebug('SidebarRoot');

  React.useEffect(() => {
    logAction('SidebarRoot mounted', { 
      enableDebug, 
      enableGlassmorphism, 
      isCollapsed 
    });
  }, [enableDebug, enableGlassmorphism, isCollapsed, logAction]);

  return (
    <>
      <SidebarDebugger enabled={enableDebug} />
      
      <SidebarStyles 
        type="container" 
        enableGlassmorphism={enableGlassmorphism}
      >
        <Sidebar collapsible="icon">
          <SidebarRail className="bg-transparent" />
          
          <MenuStateProvider>
            <SidebarStyles 
              type="content"
              className={isCollapsed ? "px-0" : "px-2"}
              enableGlassmorphism={enableGlassmorphism}
            >
              <SidebarContent>
                <SidebarView enableGlassmorphism={enableGlassmorphism} />
              </SidebarContent>
            </SidebarStyles>
          </MenuStateProvider>
        </Sidebar>
      </SidebarStyles>
    </>
  );
};

export { SidebarRoot };