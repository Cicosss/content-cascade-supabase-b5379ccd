
import React from 'react';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { MenuStateProvider } from '@/contexts/MenuStateContext';
import { SidebarView } from '../views/SidebarView';

const SidebarContainer = React.memo(() => {
  return (
    <Sidebar className="border-r border-slate-200 bg-[#F8F9FA] pt-16 md:pt-20 lg:pt-24" collapsible="icon">
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
