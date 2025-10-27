
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
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-slate-900">
      {/* Sempre mostra background image come base */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${mobileImageUrl})` }}
      />
      
      {/* Video overlay solo se non c'è errore e su desktop */}
      {!videoError && embedUrl && !isMobile && (
        <>
          <div className="absolute inset-0 overflow-hidden">
            <iframe
              src={embedUrl}
              className="absolute"
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
                width: '177.77vh',
                height: '100vh',
                minWidth: '100vw',
                minHeight: '56.25vw',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none',
                border: 0,
                objectFit: 'cover'
              }}
              title="YouTube video background"
            />
          </div>
          
          {/* Overlay per nascondere controlli YouTube */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-24 h-16 bg-slate-900/50 z-[5]" />
            <div className="absolute bottom-0 right-0 w-32 h-20 bg-slate-900/50 z-[5]" />
          </div>
        </>
      )}
    </div>
  );
};

export default VideoBackground;
