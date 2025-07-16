
import React, { useState, useEffect } from 'react';

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
  const [posterLoaded, setPosterLoaded] = useState(false);

  // Estrae l'ID del video da YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  
  // URL poster image da YouTube per caricamento istantaneo
  const posterUrl = videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null;
  
  // URL embed ottimizzato per effetto cinema - parametri aggiuntivi per rimuovere branding
  const embedUrl = videoId ? 
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&modestbranding=1&playsinline=1&rel=0&fs=0&cc_load_policy=0&iv_load_policy=3&autohide=0&enablejsapi=1&branding=0&cc_lang_pref=0&disablekb=1&start=1&origin=${encodeURIComponent(window.location.origin)}` 
    : null;

  // Preload poster image per caricamento istantaneo
  useEffect(() => {
    if (posterUrl && !isMobile) {
      const img = new Image();
      img.onload = () => setPosterLoaded(true);
      img.src = posterUrl;
    }
  }, [posterUrl, isMobile]);

  const handleIframeLoad = () => {
    setIsVideoReady(true);
  };

  const handleIframeError = () => {
    setVideoError(true);
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      {isMobile || videoError || !embedUrl ? (
        // Mobile background image or video fallback
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${mobileImageUrl})` }}
        />
      ) : (
        // Desktop video background con effetto cinema e poster istantaneo
        <div className="absolute inset-0 overflow-hidden">
          {/* Poster Image - Caricamento Istantaneo */}
          {posterUrl && (
            <div
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
                isVideoReady ? 'opacity-0' : 'opacity-100'
              }`}
              style={{ backgroundImage: `url(${posterUrl})` }}
            />
          )}

          {/* Container video con espansione orizzontale forzata per effetto cinema */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '120vw', // Espansione orizzontale forzata
              height: '67.5vw', // Mantiene aspect ratio 16:9 
              minWidth: '120vw',
              minHeight: '100vh',
              willChange: 'transform'
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
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                pointerEvents: 'none',
                transform: 'scale(1.1)', // Scaling aggiuntivo per effetto cinematografico
                transformOrigin: 'center center',
                opacity: isVideoReady ? 1 : 0,
                transition: 'opacity 1000ms ease-in-out'
              }}
              title="Cinematic YouTube video background"
            />
          </div>
          
          {/* Overlay per nascondere eventuali elementi YouTube rimanenti */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Overlay corners per nascondere loghi o controlli YouTube */}
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
