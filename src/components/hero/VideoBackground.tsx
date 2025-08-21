import React, { useEffect, useRef, useState } from 'react';

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

  // Calcola le dimensioni dell'iframe per coprire interamente il viewport (rapporto 16:9)
  const VIDEO_RATIO = 16 / 9;
  const [videoSize, setVideoSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const computeVideoSize = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    const vw = rect?.width ?? window.innerWidth;
    const vh = rect?.height ?? window.innerHeight;
    const viewportRatio = vw / vh;

    if (viewportRatio > VIDEO_RATIO) {
      // Contenitore più largo del video → usa larghezza come base
      const width = vw;
      const height = vw / VIDEO_RATIO;
      setVideoSize({ width, height });
    } else {
      // Contenitore più alto del video → usa altezza come base
      const height = vh;
      const width = vh * VIDEO_RATIO;
      setVideoSize({ width, height });
    }
  };

  useEffect(() => {
    computeVideoSize();
    const onResize = () => computeVideoSize();

    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);

    const ro = new ResizeObserver(() => onResize());
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
      ro.disconnect();
    };
  }, []);

  // Estrae l'ID del video da YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  
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
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden">
      {videoError || !embedUrl ? (
        // Fallback background image solo in caso di errore
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${mobileImageUrl})` }}
        />
      ) : (
        // Video background per desktop e mobile - sempre attivo
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
                width: `${videoSize.width}px`,
                height: `${videoSize.height}px`,
                transform: `translate(-50%, -50%)${isMobile ? ' scale(1.28)' : ''}`,
                willChange: 'transform',
                pointerEvents: 'none'
              }}
              title="YouTube video background"
            />
          </div>
          
          {/* Overlay per nascondere elementi YouTube residui */}
          <div className="absolute inset-0 pointer-events-none">
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
