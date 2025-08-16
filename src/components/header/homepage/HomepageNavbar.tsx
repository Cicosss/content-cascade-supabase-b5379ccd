import React from 'react';
import { Logo } from '../Logo';
import { Navigation } from '../Navigation';
import { UserActions } from '../UserActions';
import { MobileMenuTrigger } from './MobileMenuTrigger';
import { MobileMenuSheet } from './MobileMenuSheet';
import { useHomepageNav } from '@/contexts/HomepageNavContext';

export const HomepageNavbar: React.FC = React.memo(() => {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useHomepageNav();

  return (
    <>
      {/* Navigation Bar */}
      <div className="homepage-navbar homepage-navbar-glass flex h-16 md:h-20 lg:h-24 items-center px-4 md:px-6 lg:px-10 xl:px-16 w-full isolate overflow-hidden relative transition-all duration-300 ease-in-out">
        {/* Logo */}
        <div className="mr-12 flex group">
          <div 
            className="transition-transform duration-300 group-hover:scale-105" 
            style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            <Logo />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-8">
          <div 
            className="flex items-center space-x-8" 
            style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}
          >
            <Navigation />
            <UserActions />
          </div>
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden ml-auto">
          <MobileMenuTrigger 
            onClick={toggleMobileMenu} 
            isOpen={isMobileMenuOpen} 
          />
        </div>
      </div>

      {/* Mobile Menu Sheet */}
      <MobileMenuSheet 
        isOpen={isMobileMenuOpen} 
        onOpenChange={closeMobileMenu} 
      />
    </>
  );
});

HomepageNavbar.displayName = 'HomepageNavbar';