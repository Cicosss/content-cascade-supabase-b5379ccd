
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoBackground from './VideoBackground';
import { HERO_VIDEO_URL, HERO_MOBILE_VIDEO_URL, HERO_MOBILE_IMAGE } from './heroCategories';

const HeroBackground: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`absolute ${isMobile ? '-inset-[8px]' : '-inset-[2px]'} overflow-hidden bg-slate-900`}>
      {/* Video/Image Background */}
      <VideoBackground
        videoUrl={HERO_VIDEO_URL}
        mobileVideoUrl={HERO_MOBILE_VIDEO_URL}
        mobileImageUrl={HERO_MOBILE_IMAGE}
        isMobile={isMobile}
      />
      
      {/* Static overlay for text readability - removed dynamic hover logic */}
      <div className={`absolute ${isMobile ? '-inset-[8px]' : '-inset-[2px]'} bg-black/20 pointer-events-none`} />
    </div>
  );
};

export default HeroBackground;
