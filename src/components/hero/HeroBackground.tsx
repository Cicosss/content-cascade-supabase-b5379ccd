import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoBackground from './VideoBackground';
import { HERO_DESKTOP_VIDEO_URL, HERO_MOBILE_VIDEO_URL, HERO_FALLBACK_IMAGE } from './heroCategories';
import { Z_INDEX } from '@/config/zIndex';

const HeroBackground: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div 
      className="absolute inset-0 overflow-hidden bg-slate-900"
      style={{ zIndex: Z_INDEX.background }}
    >
      <VideoBackground
        desktopVideoUrl={HERO_DESKTOP_VIDEO_URL}
        mobileVideoUrl={HERO_MOBILE_VIDEO_URL}
        fallbackImageUrl={HERO_FALLBACK_IMAGE}
        isMobile={isMobile}
      />
      
      <div className="absolute inset-0 bg-black/15 pointer-events-none" style={{ zIndex: Z_INDEX.videoOverlay }} />
    </div>
  );
};

export default HeroBackground;
