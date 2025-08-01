
import React from 'react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { UserActions } from './UserActions';
import { MobileMenu } from './MobileMenu';
import { useHeader } from '@/contexts/HeaderContext';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  const { sidebarOpen } = useHeader();

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-[5000] w-full",
      "bg-slate-900 backdrop-blur-sm border-b border-slate-700",
      "transition-all duration-300 ease-in-out",
      className
    )}>
      <div className={cn(
        "flex h-16 md:h-20 lg:h-24 items-center px-4 md:px-6 lg:px-10 xl:px-16 max-w-screen-2xl mx-auto",
        "transition-all duration-300 ease-in-out",
        sidebarOpen ? "lg:pl-72" : ""
      )}>
        {/* Logo */}
        <div className="mr-12 flex">
          <Logo />
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
