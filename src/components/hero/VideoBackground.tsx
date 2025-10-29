
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
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden bg-slate-900"
      style={{ 
        isolation: 'isolate',
        zIndex: 0
      }}
    >
      {videoError || !embedUrl ? (
        // Mobile background image or video fallback
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${mobileImageUrl})` }}
        />
      ) : (
        // Video background che copre completamente la superficie
        <>
          <div className="absolute inset-0 overflow-hidden bg-slate-900">
            <div 
              className="absolute inset-0 overflow-hidden"
              style={{
                borderRadius: 0,
                isolation: 'isolate'
              }}
            >
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
                  width: isMobile ? '100%' : '177.77vh',
                  height: isMobile ? '100%' : '100vh',
                  minWidth: isMobile ? '100vw' : '100vw',
                  minHeight: isMobile ? '100vh' : '56.25vw',
                  maxWidth: 'none',
                  maxHeight: 'none',
                  transform: 'translate(-50%, -50%)',
                  objectFit: 'cover',
                  pointerEvents: 'none',
                  border: 0,
                  margin: 0,
                  padding: 0,
                  display: 'block',
                  willChange: 'auto',
                  backfaceVisibility: 'hidden'
                }}
                title="YouTube video background"
              />
            </div>
          </div>
          
          {/* Overlay opachi per nascondere controlli YouTube - SOLO su mobile */}
          {isMobile && (
            <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 100 }}>
              {/* Top right corner - controlli YouTube */}
              <div className="absolute top-0 right-0 w-32 h-24 bg-slate-900" />
              {/* Bottom right corner - info e controlli */}
              <div className="absolute bottom-0 right-0 w-40 h-28 bg-slate-900" />
              {/* Top edge */}
              <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-slate-900 to-transparent" />
              {/* Right edge */}
              <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-l from-slate-900 to-transparent" />
              {/* Left edge */}
              <div className="absolute top-0 left-0 bottom-0 w-20 bg-gradient-to-r from-slate-900 to-transparent" />
            </div>
          )}
          
          {/* Loading state overlay cinematografico */}
          {!isVideoReady && !videoError && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center" style={{ zIndex: 150 }}>
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
