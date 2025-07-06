
import React, { useState } from 'react';

interface VideoBackgroundProps {
  videoUrl: string;
  mobileImageUrl: string;
  isMobile: boolean;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  videoUrl, 
  mobileImageUrl, 
  isMobile 
}) => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);

  // Estrae l'ID del video da YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  
  // URL embed ottimizzato per background video
  const embedUrl = videoId ? 
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&fs=0&cc_load_policy=0&iv_load_policy=3&autohide=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}` 
    : null;

  const handleIframeLoad = () => {
    console.log('🎥 Video background ready');
    setIsVideoReady(true);
  };

  const handleIframeError = () => {
    console.error('❌ Video background error');
    setVideoError(true);
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      {isMobile || videoError || !embedUrl ? (
        // Mobile background image or video fallback
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${mobileImageUrl})` }}
        />
      ) : (
        // Desktop video background
        <div className="absolute inset-0 overflow-hidden">
          {/* Video container with proper aspect ratio for full coverage */}
          <div className="absolute top-1/2 left-1/2 w-[177.77vh] min-w-full min-h-full h-[56.25vw] -translate-x-1/2 -translate-y-1/2">
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none' // Impedisce l'interazione con il video
              }}
              title="YouTube video background"
            />
          </div>
          
          {/* Loading state overlay */}
          {!isVideoReady && !videoError && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <div className="text-white">Caricamento video...</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoBackground;
