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
  const [videoError, setVideoError] = useState(false);

  // Solo per desktop: calcola le dimensioni dell'iframe
  const VIDEO_RATIO = 16 / 9;
  const [videoSize, setVideoSize] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const computeVideoSize = () => {
    if (isMobile) return; // Skip calculation on mobile
    
    const rect = containerRef.current?.getBoundingClientRect();
    const vw = rect?.width ?? window.innerWidth;
    const vh = rect?.height ?? window.innerHeight;
    const viewportRatio = vw / vh;

    if (viewportRatio > VIDEO_RATIO) {
      const width = vw;
      const height = vw / VIDEO_RATIO;
      setVideoSize({ width, height });
    } else {
      const height = vh;
      const width = vh * VIDEO_RATIO;
      setVideoSize({ width, height });
    }
  };

  useEffect(() => {
    if (!isMobile) {
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
    }
  }, [isMobile]);

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

  const handleIframeError = () => {
    setVideoError(true);
  };

  return (
    <div ref={containerRef} className={isMobile ? "fixed inset-0 w-screen h-screen z-0 overflow-hidden" : "absolute inset-0 w-full h-full overflow-hidden"}>
      {videoError || !embedUrl ? (
        // Fallback background image solo in caso di errore
        <div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${mobileImageUrl})` }}
        />
      ) : (
        // Video background - Desktop normale, Mobile fullscreen con overscan
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <iframe
            src={embedUrl}
            className="absolute inset-0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
            onError={handleIframeError}
            style={isMobile ? {
              // Mobile: overscan per coprire tutto lo schermo
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '140vw',
              height: '140vh',
              transform: 'translate(-50%, -50%)',
              willChange: 'transform',
              pointerEvents: 'none'
            } : {
              // Desktop: dimensioni calcolate come prima
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: `${videoSize.width}px`,
              height: `${videoSize.height}px`,
              transform: 'translate(-50%, -50%)',
              willChange: 'transform',
              pointerEvents: 'none'
            }}
            title="YouTube video background"
          />
        </div>
      )}
    </div>
  );
};

export default VideoBackground;
