
import React, { useEffect } from 'react';
import { Sidebar, SidebarContent, SidebarFooter, useSidebar } from '@/components/ui/sidebar';
import { SidebarMenuContainer } from './sidebar/containers/SidebarMenuContainer';
import { UserProfileContainer } from './sidebar/containers/UserProfileContainer';

const AppSidebar: React.FC = () => {
  const { toggleSidebar } = useSidebar();

  // Listen for custom toggle events from the navbar
  useEffect(() => {
    const handleToggleEvent = () => {
      toggleSidebar();
    };

    window.addEventListener('toggleSidebar', handleToggleEvent);
    
    return () => {
      window.removeEventListener('toggleSidebar', handleToggleEvent);
    };
  }, [toggleSidebar]);

  return (
    <Sidebar 
      collapsible="icon" 
      className="hidden lg:flex glassmorphism-sidebar z-[35]"
    >
      <SidebarContent>
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
