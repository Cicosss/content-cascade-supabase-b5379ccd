
import React from 'react';
import { SidebarHeader as BaseSidebarHeader, SidebarTrigger } from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import MiaRomagnaLogo from '@/components/MiaRomagnaLogo';

export const SidebarHeader = () => {
  return (
    <BaseSidebarHeader className="border-b border-slate-100 p-3 bg-[#F8F9FA]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="h-6 w-6 text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-md" />
        </div>
      </div>
      
      {/* Logo Mia Romagna */}
      <div className="mt-1 flex justify-center group-data-[collapsible=icon]:mt-1">
        <Link 
          to="/dashboard" 
          className="hover:opacity-80 transition-opacity duration-200"
          title="Torna alla dashboard"
        >
          <MiaRomagnaLogo 
            width={90} 
            height={90} 
            className="group-data-[collapsible=icon]:w-15 group-data-[collapsible=icon]:h-15" 
          />
        </Link>
      </div>
    </BaseSidebarHeader>
  );
};
