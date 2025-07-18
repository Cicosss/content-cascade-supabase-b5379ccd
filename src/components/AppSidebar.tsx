
import React from 'react';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarMenuItems } from './sidebar/SidebarMenuItems';
import { SidebarFooter } from './sidebar/SidebarFooter';

const AppSidebar = React.memo(() => {
  return (
    <Sidebar className="border-r border-slate-200 bg-[#F8F9FA] fixed top-24 h-[calc(100vh-6rem)] z-[100]" collapsible="icon">
      <SidebarHeader />
      
      <SidebarContent className="px-2 bg-[#F8F9FA]">
        <SidebarMenuItems />
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
});

AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;
