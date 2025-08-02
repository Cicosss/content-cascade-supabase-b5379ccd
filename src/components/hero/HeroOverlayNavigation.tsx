import React from 'react';
import { Logo } from '@/components/header/Logo';
import { Navigation } from '@/components/header/Navigation';
import { UserActions } from '@/components/header/UserActions';
import { MobileMenu } from '@/components/header/MobileMenu';
import { useIsMobile } from '@/hooks/use-mobile';

const HeroOverlayNavigation = () => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="absolute top-0 left-0 right-0 z-20 w-full">
        <div className="flex flex-col items-center pt-8 px-4">
          {/* Mobile: Logo centrato con sottotitolo */}
          <div className="flex flex-col items-center text-center">
            <Logo />
            <p className="text-white/90 text-sm font-light mt-2 tracking-wide">
              Il territorio è tra le Tue mani
            </p>
          </div>
          
          {/* Mobile Menu - Posizionato in alto a destra */}
          <div className="absolute top-4 right-4">
            <MobileMenu />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute top-0 left-0 right-0 z-20 w-full">
      <div className="flex h-16 md:h-20 lg:h-24 items-center px-4 md:px-6 lg:px-10 xl:px-16 max-w-screen-2xl mx-auto">
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
    </div>
  );
};

export default HeroOverlayNavigation;