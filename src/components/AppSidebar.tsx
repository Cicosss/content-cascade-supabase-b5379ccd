
import React, { useEffect, useCallback } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { SidebarMenuContainer } from './sidebar/containers/SidebarMenuContainer';
import { UserProfileContainer } from './sidebar/containers/UserProfileContainer';
import { Z_INDEX } from '@/config/zIndex';

const AppSidebar: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  // Optimized event handler with useCallback
  const handleToggleEvent = useCallback(() => {
    toggleSidebar();
  }, [toggleSidebar]);

  // Listen for custom toggle events from the navbar
  useEffect(() => {
    window.addEventListener('toggleSidebar', handleToggleEvent);
    
    return () => {
      window.removeEventListener('toggleSidebar', handleToggleEvent);
    };
  }, [handleToggleEvent]);

  return (
    <Sidebar 
      collapsible="icon" 
      className="glassmorphism-sidebar"
      style={{ zIndex: Z_INDEX.sidebar }}
    >
      <SidebarContent className="glassmorphism-inner">
        <SidebarMenuContainer />
      </SidebarContent>
      
      <SidebarFooter className="glassmorphism-footer">
        <UserProfileContainer />
      </SidebarFooter>
    </Sidebar>
  );
};

AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;
