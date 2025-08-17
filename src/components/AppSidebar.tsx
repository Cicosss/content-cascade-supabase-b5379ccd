
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar';
import { SidebarMenuContainer } from './sidebar/containers/SidebarMenuContainer';
import { UserProfileContainer } from './sidebar/containers/UserProfileContainer';

const AppSidebar: React.FC = () => {
  return (
    <Sidebar 
      collapsible="icon" 
      className="glassmorphism-sidebar z-[35]"
      style={{ top: '5rem' }}
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
