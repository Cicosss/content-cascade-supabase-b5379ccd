
import React from 'react';
import { SidebarHeader as BaseSidebarHeader } from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';
import MiaRomagnaLogo from '@/components/MiaRomagnaLogo';

export const SidebarHeader = () => {
  return (
    <BaseSidebarHeader className="border-b border-slate-100 p-3 bg-[#F8F9FA] group-data-[collapsible=icon]:p-2">
      {/* Logo Mia Romagna */}
      <div className="flex justify-center group-data-[collapsible=icon]:justify-center">
        <Link 
          to="/dashboard" 
          className="hover:opacity-80 transition-all duration-200"
          title="Torna alla dashboard"
        >
          <MiaRomagnaLogo 
            width={90} 
            height={90} 
            className="group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12 transition-all duration-200" 
          />
        </Link>
      </div>
    </BaseSidebarHeader>
  );
};
