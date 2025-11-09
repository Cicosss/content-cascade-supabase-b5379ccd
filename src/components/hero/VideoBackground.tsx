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

  const videoUrl = isMobile ? mobileVideoUrl : desktopVideoUrl;

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
      ) : (
        <>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setVideoError(true)}
            onLoadedData={() => setIsLoading(false)}
            style={{
              pointerEvents: 'none',
              objectFit: 'cover'
            }}
          >
            <source src={videoUrl} type="video/mp4" />
            <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
          </video>
          
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
