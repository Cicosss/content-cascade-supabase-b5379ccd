
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoBackground from './VideoBackground';
import { HERO_VIDEO_URL, HERO_MOBILE_VIDEO_URL, HERO_MOBILE_IMAGE } from './heroCategories';
import { Z_INDEX } from '@/config/zIndex';

const HeroBackground: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div 
      className="absolute inset-0 overflow-hidden bg-slate-900"
      style={{ zIndex: Z_INDEX.background }}
    >
      {/* Video/Image Background */}
      <VideoBackground
        videoUrl={HERO_VIDEO_URL}
        mobileVideoUrl={HERO_MOBILE_VIDEO_URL}
        mobileImageUrl={HERO_MOBILE_IMAGE}
        isMobile={isMobile}
      />
      
      {/* Static overlay for text readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" style={{ zIndex: Z_INDEX.videoOverlay }} />
    </div>
  );
};

export default HeroBackground;
