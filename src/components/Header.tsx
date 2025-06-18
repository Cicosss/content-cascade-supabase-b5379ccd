
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import LogoSection from './header/LogoSection';
import NavigationMenu from './header/NavigationMenu';
import LanguageSelector from './header/LanguageSelector';
import AuthButtons from './header/AuthButtons';
import MobileNavigationMenu from './header/MobileNavigationMenu';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="w-full bg-[#0F172A] border-b border-slate-700 shadow-lg relative z-[998]">
      <div className="bg-[#0F172A] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo Section */}
          <LogoSection />

          {/* Desktop Navigation */}
          <NavigationMenu />

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            {/* Language Selector */}
            <LanguageSelector />

            {/* Auth Buttons */}
            <AuthButtons />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2 hover:bg-slate-700 rounded-lg text-white hover:text-orange-300"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <MobileNavigationMenu isOpen={isMobileMenuOpen} onClose={closeMobileMenu} />

        {/* Mobile Auth Buttons */}
        {isMobileMenuOpen && (
          <AuthButtons isMobile onMobileClose={closeMobileMenu} />
        )}
      </div>
    </header>
  );
};

export default Header;
