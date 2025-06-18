
import React from 'react';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarMenuItems } from './sidebar/SidebarMenuItems';
import { SidebarFooter } from './sidebar/SidebarFooter';

const AppSidebar = () => {
  return (
    <Sidebar className="border-r border-slate-200 bg-[#F8F9FA] z-sidebar-custom fixed" collapsible="icon">
      <SidebarHeader />
      
      <SidebarContent className="px-2 bg-[#F8F9FA]">
        <SidebarMenuItems />
      </SidebarContent>

      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
