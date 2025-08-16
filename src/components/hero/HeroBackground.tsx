
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import VideoBackground from './VideoBackground';
import DynamicOverlay from './DynamicOverlay';
import { HERO_VIDEO_URL, HERO_MOBILE_IMAGE } from './heroCategories';

interface HeroBackgroundProps {
  isHovered: boolean;
}

const HeroBackground: React.FC<HeroBackgroundProps> = ({ isHovered }) => {
  const isMobile = useIsMobile();

  return (
    <div className="absolute inset-0">
      {/* Video/Image Background */}
      <VideoBackground
        videoUrl={HERO_VIDEO_URL}
        mobileImageUrl={HERO_MOBILE_IMAGE}
        isMobile={isMobile}
      />
      
      {/* Dynamic Overlay for Text Readability */}
      <DynamicOverlay isHovered={isHovered} />
    </div>
  );
};

export default HeroBackground;
