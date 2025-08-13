/**
 * ROOT COMPONENT: SidebarRoot
 * 
 * Responsabilità:
 * - Entry point semplificato per la sidebar
 * - Orchestrazione componenti principali
 * - Debug wrapper senza interferire con il rendering
 */

import React from 'react';
import { Sidebar, SidebarContent, SidebarRail } from '@/components/ui/sidebar';
import { MenuStateProvider } from '@/contexts/MenuStateContext';
import { SidebarView } from '../views/SidebarView';
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
  const { logAction } = useSidebarDebug('SidebarRoot');

  React.useEffect(() => {
    logAction('SidebarRoot mounted', { 
      enableDebug, 
      enableGlassmorphism
    });
  }, [enableDebug, enableGlassmorphism, logAction]);

  const sidebarClasses = enableGlassmorphism 
    ? 'glassmorphism-sidebar' 
    : '';

  return (
    <>
      <SidebarDebugger enabled={enableDebug} />
      
      <Sidebar collapsible="icon" className={sidebarClasses}>
        <SidebarRail className="bg-transparent" />
        
        <MenuStateProvider>
          <SidebarContent>
            <SidebarView enableGlassmorphism={enableGlassmorphism} />
          </SidebarContent>
        </MenuStateProvider>
      </Sidebar>
    </>
  );
};

export { SidebarRoot };