
import React from 'react';
import { SidebarHeader as BaseSidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';

export const SidebarHeader = () => {
  return (
    <BaseSidebarHeader className="border-b border-slate-200 p-3 bg-[#F8F9FA]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-6 w-6 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-md" />
          <span className="font-semibold text-slate-800 group-data-[collapsible=icon]:hidden">ROMAGNA</span>
        </div>
      </div>
    </BaseSidebarHeader>
  );
};
