
import React, { useState } from 'react';
import { useViewportSize } from '@/hooks/useViewportSize';

interface VideoBackgroundProps {
  videoUrl: string;
  mobileVideoUrl: string;
  mobileImageUrl: string;
  isMobile: boolean;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  videoUrl,
  mobileVideoUrl, 
  mobileImageUrl, 
  isMobile 
}) => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const { height: viewportHeight } = useViewportSize(isMobile);

  // Estrae l'ID del video da YouTube URL (supporta anche Shorts)
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };
  // Scegli il video appropriato per la piattaforma
  const currentVideoUrl = isMobile ? mobileVideoUrl : videoUrl;
  const videoId = getYouTubeVideoId(currentVideoUrl);
  
  // URL embed ottimizzato per autoplay in loop
  const embedUrl = videoId ? 
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}` 
    : null;

  const handleIframeLoad = () => {
    setIsVideoReady(true);
  };

  const handleIframeError = () => {
    setVideoError(true);
  };

  return (
    <div className={`absolute hero-unclamp ${isMobile ? '-inset-[12px]' : '-inset-[8px]'} w-full h-full overflow-hidden bg-slate-900`}>
      {videoError || !embedUrl ? (
        // Mobile background image or video fallback
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${mobileImageUrl})` }}
        />
      ) : (
        // Video background che copre completamente la superficie
        <>
          <div className={`absolute hero-unclamp ${isMobile ? '-inset-[12px]' : '-inset-[8px]'} overflow-hidden bg-slate-900`}>
            <iframe
              src={embedUrl}
              className="absolute inset-0"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: isMobile ? '400vw' : '300vw',
                height: isMobile ? `${(viewportHeight || window.innerHeight) + 64}px` : '300vh',
                maxWidth: 'none',
                maxHeight: 'none',
                transform: isMobile ? 'translate(-48%, -51%) scale(1.08)' : 'translate(-50%, -50%) scale(1.05)',
                pointerEvents: 'none',
                border: 0,
                margin: 0,
                padding: 0,
                display: 'block',
                willChange: 'transform',
                backfaceVisibility: 'hidden'
              }}
              title="YouTube video background"
            />
          </div>
          
          {/* Overlay per nascondere elementi YouTube residui */}
          <div className={`absolute hero-unclamp ${isMobile ? '-inset-[12px]' : '-inset-[8px]'} pointer-events-none`}>
            <div className="absolute top-0 right-0 w-24 h-16 bg-transparent z-[5]" />
            <div className="absolute bottom-0 right-0 w-32 h-20 bg-transparent z-[5]" />
          </div>
          
          {/* Loading state overlay cinematografico */}
          {!isVideoReady && !videoError && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <div className="text-white text-lg font-light animate-pulse">
                Caricamento esperienza cinematografica...
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoBackground;
