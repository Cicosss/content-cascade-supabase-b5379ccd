import React from 'react';
import { cn } from '@/lib/utils';
import { Logo } from './Logo';
import { Navigation } from './Navigation';
import { UserActions } from './UserActions';
import { HomepageMobileMenu } from './HomepageMobileMenu';

interface HomepageHeaderProps {
  className?: string;
}

export const HomepageHeader: React.FC<HomepageHeaderProps> = ({ className }) => {
  return (
    <header className={cn(
      "absolute top-0 left-0 right-0 z-20 w-full",
      "transition-all duration-300 ease-in-out",
      "bg-transparent",
      className
    )}>
      
      <div className={cn(
        "flex h-16 md:h-20 lg:h-24 items-center px-4 md:px-6 lg:px-10 xl:px-16 max-w-screen-2xl mx-auto relative z-10",
        "transition-all duration-300 ease-in-out"
      )}>
        {/* Logo with text shadow */}
        <div className="mr-12 flex group">
          <div className="transition-transform duration-300 group-hover:scale-105" style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            <Logo />
          </div>
        </div>

        {/* Navigation and Actions - Desktop Only */}
        <div className="hidden md:flex flex-1 items-center justify-between gap-8">
          <div className="w-full flex-1 md:w-auto md:flex-none" style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            <Navigation />
          </div>

          <div className="flex items-center space-x-4" style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}>
            <UserActions />
          </div>
        </div>

        {/* Mobile Menu - Mobile Only */}
        <div className="flex md:hidden ml-auto" style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}>
          <HomepageMobileMenu />
        </div>
      </div>
    </header>
  );
};