
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
  
  // URL embed semplice
  const embedUrl = videoId ? 
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&fs=0&cc_load_policy=0&iv_load_policy=3&autohide=0&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}` 
    : null;

  const handleIframeLoad = () => {
    setIsVideoReady(true);
  };

  const handleIframeError = () => {
    setVideoError(true);
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {videoError || !embedUrl ? (
        // Mobile background image or video fallback
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${mobileImageUrl})` }}
        />
      ) : (
        // Video background che copre completamente la superficie
        <>
          <div className="absolute inset-0 w-full h-full overflow-hidden">
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
                width: '177.77vh',
                height: '100vh',
                minWidth: '100vw',
                minHeight: '56.25vw',
                transform: 'translate(-50%, -50%)',
                pointerEvents: 'none'
              }}
              title="YouTube video background"
            />
          </div>
          
          {/* Loading state overlay */}
          {!isVideoReady && !videoError && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <div className="text-white text-lg font-light animate-pulse">
                Caricamento...
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VideoBackground;
