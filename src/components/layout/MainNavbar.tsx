import React from "react";
import { cn } from "@/lib/utils";
import { NavLogo } from "@/components/navbar/NavLogo";
import { DesktopMenu } from "@/components/navbar/DesktopMenu";
import { MobileMenu } from "@/components/navbar/MobileMenu";
import { useNavbarLogic } from "@/components/navbar/useNavbarLogic";

interface NavItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: NavItem[];
}

interface Logo {
  url: string;
  src?: string;
  alt: string;
  title: string;
  size?: 'sm' | 'md' | 'lg';
}

interface MainNavbarProps {
  logo: Logo;
  menu: NavItem[];
  children?: React.ReactNode;
}

const MainNavbar: React.FC<MainNavbarProps> = ({ logo, menu, children }) => {
  const {
    isMobileOpen,
    sidebarState,
    handleLogoClick,
    handleNavigation,
    handleMobileMenuChange
  } = useNavbarLogic(logo);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-700 bg-slate-900 backdrop-blur-sm">
      <div className={cn(
        "flex h-24 items-center px-10 lg:px-16 max-w-screen-2xl mx-auto transition-all duration-300 ease-in-out",
        sidebarState?.open && sidebarState?.openMobile ? "lg:pl-72" : sidebarState?.open ? "lg:pl-20" : ""
      )}>
        {/* Logo */}
        <div className="mr-12 flex">
          <NavLogo 
            url={logo.url}
            src={logo.src}
            alt={logo.alt}
            title={logo.title}
            size={logo.size || "md"}
            onClick={handleLogoClick}
          />
        </div>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-between gap-8 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <DesktopMenu menu={menu} onNavigate={handleNavigation} />
          </div>

          {/* Right side content (auth buttons, language selector, etc.) */}
          <div className="flex items-center space-x-4">
            {children}
          </div>

          {/* Mobile Menu */}
          <MobileMenu
            logo={logo}
            menu={menu}
            isOpen={isMobileOpen}
            onOpenChange={handleMobileMenuChange}
            onNavigate={handleNavigation}
          />
        </div>
      </div>
    </header>
  );
};

export default MainNavbar;