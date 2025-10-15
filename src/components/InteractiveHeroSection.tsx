
import React from 'react';
import { Link } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import HeroBackground from './hero/HeroBackground';
import HeroBrandSection from './hero/HeroBrandSection';
import HeroFeatures from './hero/HeroFeatures';
import { useIsMobile } from '@/hooks/use-mobile';

const InteractiveHeroSection = () => {
  const isMobile = useIsMobile();

  return (
    <div className="relative w-full h-[100svh] md:h-screen overflow-hidden bg-slate-900">
      {/* Dynamic Background with Video/Image */}
      <HeroBackground />

      {/* Login Button - Desktop Only, Top Right */}
      <Link
        to="/auth"
        className="hidden md:flex absolute top-6 right-6 z-20 items-center gap-2 text-white/90 hover:text-white transition-all duration-300 group"
      >
        <span className="text-sm font-sans font-medium tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Accedi
        </span>
        <UserCircle className="w-7 h-7 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
      </Link>

      {/* Content Overlay - Restructured */}
      <div className="relative z-10 h-full flex flex-col text-white">
        {/* Brand Section - Centered vertically between navbar and buttons */}
        <div className="flex-1 flex items-center justify-center">
          <HeroBrandSection />
        </div>
        
        {/* Key Features - Moved higher up */}
        {!isMobile && (
          <div className="absolute bottom-16 left-0 right-0 px-3 md:px-4 lg:px-6">
            <HeroFeatures />
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveHeroSection;
