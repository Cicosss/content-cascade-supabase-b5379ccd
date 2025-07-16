
import React, { useState, useEffect } from 'react';

interface VideoBackgroundProps {
  videoUrl: string;
  mobileImageUrl: string;
  isMobile: boolean;
  onVideoReady?: () => void;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  videoUrl, 
  mobileImageUrl, 
  isMobile,
  onVideoReady 
}) => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [showPoster, setShowPoster] = useState(true);

  // Estrae l'ID del video da YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  
  // URL embed ottimizzato per effetto cinema - parametri aggiuntivi per rimuovere branding
  const embedUrl = videoId ? 
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&fs=0&cc_load_policy=0&iv_load_policy=3&autohide=0&enablejsapi=1&branding=0&cc_lang_pref=0&disablekb=1&start=1&origin=${encodeURIComponent(window.location.origin)}` 
    : null;

  const handleIframeLoad = () => {
    setTimeout(() => {
      setIsVideoReady(true);
      setShowPoster(false);
      onVideoReady?.();
    }, 1500); // Delay per transizione fluida
  };

  const handleIframeError = () => {
    setVideoError(true);
    onVideoReady?.(); // Chiamiamo callback anche in caso di errore
  };

  // Preload poster image per LCP ottimizzato
  useEffect(() => {
    if (mobileImageUrl) {
      const img = new Image();
      img.src = mobileImageUrl;
    }
  }, [mobileImageUrl]);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {/* Poster image - sempre visibile per LCP ottimizzato */}
      <div
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
          showPoster || isMobile || videoError || !embedUrl ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ 
          backgroundImage: `url(${mobileImageUrl})`,
          willChange: 'opacity'
        }}
      />
      
      {!isMobile && !videoError && embedUrl && (
        // Desktop video background con effetto cinema - carica dietro al poster
        <div className={`absolute inset-0 overflow-hidden transition-opacity duration-1000 ${
          isVideoReady && !showPoster ? 'opacity-100' : 'opacity-0'
        }`}>
          {/* Container video con espansione orizzontale forzata per effetto cinema */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '120vw', 
              height: '67.5vw', 
              minWidth: '120vw',
              minHeight: '100vh',
              willChange: 'transform, opacity'
            }}
          >
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
              loading="lazy"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                transform: 'scale(1.1) translate3d(0,0,0)', 
                transformOrigin: 'center center'
              }}
              title="Cinematic YouTube video background"
            />
          </div>
          
          {/* Overlay per nascondere eventuali elementi YouTube rimanenti */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-24 h-16 bg-transparent z-10" />
            <div className="absolute bottom-0 right-0 w-32 h-20 bg-transparent z-10" />
            <div className="absolute bottom-0 left-0 w-32 h-20 bg-transparent z-10" />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoBackground;
