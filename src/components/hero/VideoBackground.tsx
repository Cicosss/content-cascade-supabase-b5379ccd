
import React, { useState } from 'react';
import ReactPlayer from 'react-player/lazy';

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

  const handleVideoReady = () => {
    console.log('🎥 Video background ready');
    setIsVideoReady(true);
  };

  const handleVideoError = (error: any) => {
    console.error('❌ Video background error:', error);
    setVideoError(true);
  };

  return (
    <div className="absolute inset-0 w-full h-full">
      {isMobile || videoError ? (
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
            <ReactPlayer
              url={videoUrl}
              playing
              loop
              muted
              controls={false}
              width="100%"
              height="100%"
              onReady={handleVideoReady}
              onError={handleVideoError}
              config={{
                youtube: {
                  playerVars: {
                    autoplay: 1,
                    controls: 0,
                    showinfo: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    rel: 0,
                    fs: 0,
                    cc_load_policy: 0,
                    iv_load_policy: 3,
                    autohide: 0
                  }
                }
              }}
              style={{
                position: 'absolute',
                top: 0,
                left: 0
              }}
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
