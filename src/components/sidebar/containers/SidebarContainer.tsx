
import React from 'react';
import { Sidebar, SidebarContent } from '@/components/ui/sidebar';
import { SidebarStateProvider } from '@/contexts/SidebarContext';
import { MenuStateProvider } from '@/contexts/MenuStateContext';
import { SidebarView } from '../views/SidebarView';

const SidebarContainer = React.memo(() => {
  return (
    <Sidebar className="border-r border-slate-200 bg-[#F8F9FA] fixed top-24 h-[calc(100vh-6rem)] z-[100]" collapsible="icon">
      <SidebarStateProvider>
        <MenuStateProvider>
          <SidebarContent className="px-2 bg-[#F8F9FA]">
            <SidebarView />
          </SidebarContent>
        </MenuStateProvider>
      </SidebarStateProvider>
    </Sidebar>
  );
});

SidebarContainer.displayName = 'SidebarContainer';

export { SidebarContainer };
