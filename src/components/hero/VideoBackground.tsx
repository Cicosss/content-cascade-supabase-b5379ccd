import React, { useState } from 'react';

interface VideoBackgroundProps {
  desktopVideoUrl: string;
  mobileVideoUrl: string;
  fallbackImageUrl: string;
  isMobile: boolean;
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({ 
  desktopVideoUrl,
  mobileVideoUrl, 
  fallbackImageUrl, 
  isMobile 
}) => {
  const [videoError, setVideoError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Determina se usare YouTube (desktop) o video nativo (mobile)
  const useNativeVideo = isMobile;
  
  // Estrae l'ID del video da YouTube URL per desktop
  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };
  
  const videoId = !useNativeVideo ? getYouTubeVideoId(desktopVideoUrl) : null;
  const embedUrl = videoId ? 
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&playsinline=1&rel=0` 
    : null;

  return (
    <div 
      className="absolute inset-0 w-full h-full overflow-hidden bg-slate-900"
      style={{ zIndex: 0 }}
    >
      {videoError ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${fallbackImageUrl})` }}
        />
      ) : useNativeVideo ? (
        // Video nativo HTML5 per mobile - pulito e performante
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setVideoError(true)}
            onLoadedData={() => setIsLoading(false)}
            style={{
              pointerEvents: 'none',
              objectFit: 'cover'
            }}
          >
            <source src={mobileVideoUrl} type="video/mp4" />
          </video>
          
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <div className="text-white text-base font-light animate-pulse">
                Caricamento...
              </div>
            </div>
          )}
        </>
      ) : (
        // YouTube embed per desktop
        <>
          <iframe
            src={embedUrl || ''}
            className="absolute inset-0"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
            onError={() => setVideoError(true)}
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
              border: 0
            }}
            title="Hero video background"
          />
          
          {isLoading && (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <div className="text-white text-base font-light animate-pulse">
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
