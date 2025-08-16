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
      <div className="homepage-navbar homepage-navbar-glass flex h-16 md:h-20 lg:h-24 items-center px-4 md:px-6 lg:px-10 xl:px-16 max-w-full mx-auto relative z-10 transition-all duration-500 ease-out backdrop-blur-3xl bg-gradient-to-r from-white/20 via-white/10 to-white/20">
        {/* Logo */}
        <div className="mr-12 flex group">
          <div 
            className="transition-transform duration-300 group-hover:scale-105 homepage-logo-enhanced" 
          >
            <Logo />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 items-center justify-end gap-8">
          <div 
            className="flex items-center space-x-8 homepage-nav-enhanced" 
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