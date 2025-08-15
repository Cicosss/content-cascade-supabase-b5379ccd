
import React from 'react';
import { useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { UserActions } from './UserActions';
import { MobileMenu } from './MobileMenu';
import { useHeader } from '@/contexts/HeaderContext';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { sidebarOpen } = useHeader();
  const { user } = useAuth();
  const location = useLocation();
  
  // Stile uniforme trasparente per tutte le pagine, con possibilità di override tramite className
  const headerBg = "bg-transparent backdrop-blur-sm";

  return (
      <header className={cn(
        "header-fixed relative border-b border-slate-800/50 overflow-hidden",
        "transition-all duration-300 ease-in-out",
        className || headerBg
      )}>
      {/* Geometric Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-2 right-20 w-16 h-16 border border-orange-400 rotate-45"></div>
        <div className="absolute bottom-2 left-32 w-12 h-12 bg-blue-500/20 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 border border-green-400 rotate-12"></div>
      </div>
      
      <div className={cn(
        "flex h-16 md:h-20 lg:h-24 items-center px-4 md:px-6 lg:px-10 xl:px-16 max-w-screen-2xl mx-auto relative z-10",
        "transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:pl-72" : ""
      )}>
        {/* Sidebar Trigger (only for authenticated users on desktop) */}
        {user && (
          <div className="hidden lg:flex mr-4">
            <SidebarTrigger className="text-white hover:text-orange-400 transition-colors duration-300" />
          </div>
        )}

        {/* Logo */}
        <div className="mr-12 flex group">
          <div className="transition-transform duration-300 group-hover:scale-105">
            <Logo />
          </div>
        </div>

        {/* Navigation and Actions */}
        <div className="flex flex-1 items-center justify-between gap-8 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Navigation />
          </div>

          <div className="flex items-center space-x-4">
            <UserActions />
          </div>

          <MobileMenu />
        </div>
      </div>
    </header>
  );
};
