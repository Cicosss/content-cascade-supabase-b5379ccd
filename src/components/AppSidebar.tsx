
import React from 'react';
import { Sidebar, SidebarContent, SidebarFooter, SidebarRail } from '@/components/ui/sidebar';
import { SidebarMenuContainer } from './sidebar/containers/SidebarMenuContainer';
import { UserProfileContainer } from './sidebar/containers/UserProfileContainer';
import { SidebarDebugger } from './sidebar/core/SidebarDebugger';

interface AppSidebarProps {
  enableDebug?: boolean;
  enableGlassmorphism?: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  enableDebug = false,
  enableGlassmorphism = true 
}) => {
  const sidebarClasses = enableGlassmorphism ? 'glassmorphism-sidebar' : '';
  const footerClasses = enableGlassmorphism 
    ? 'glassmorphism-footer border-t border-white/20 p-2' 
    : 'border-t border-border p-2';

  return (
    <>
      {enableDebug && <SidebarDebugger enabled={true} />}
      
      <Sidebar collapsible="icon" className={sidebarClasses}>
        <SidebarRail className="bg-transparent" />
        
        <SidebarContent>
          <SidebarMenuContainer />
        </SidebarContent>
        
        <SidebarFooter className={footerClasses}>
          <UserProfileContainer />
        </SidebarFooter>
      </Sidebar>
    </>
  );
};

AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;
