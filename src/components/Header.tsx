
import React from 'react';
import { useMobileMenu } from '@/hooks/useMobileMenu';
import LogoSection from './header/LogoSection';
import NavigationMenu from './header/NavigationMenu';
import LanguageSelector from './header/LanguageSelector';
import AuthButtons from './header/AuthButtons';
import MobileNavigationMenu from './header/MobileNavigationMenu';
import MobileMenuToggle from './header/MobileMenuToggle';

const Header = React.memo(() => {
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useMobileMenu();

  return (
    <header 
      className="w-full bg-[#0F172A] border-b border-slate-700 shadow-lg relative z-header-custom header-force-top"
      role="banner"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          <LogoSection />
          <NavigationMenu />

          <div className="flex items-center space-x-3">
            <LanguageSelector />
            <AuthButtons />
            <MobileMenuToggle 
              isOpen={isMobileMenuOpen} 
              onToggle={toggleMobileMenu} 
            />
          </div>
        </div>

        <MobileNavigationMenu 
          isOpen={isMobileMenuOpen} 
          onClose={closeMobileMenu} 
        />

        {isMobileMenuOpen && (
          <AuthButtons isMobile onMobileClose={closeMobileMenu} />
        )}
      </div>
    </header>
  );
});

Header.displayName = 'Header';

export default Header;
