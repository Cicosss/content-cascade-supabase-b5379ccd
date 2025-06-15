
import React, { useEffect } from 'react';

interface YouTubeVideoBackgroundProps {
  videoId: string;
  children: React.ReactNode;
}

const YouTubeVideoBackground: React.FC<YouTubeVideoBackgroundProps> = ({ videoId, children }) => {
  useEffect(() => {
    // Load YouTube IFrame API
    const loadYouTubeAPI = () => {
      if (window.YT) return;
      
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    };

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      const player = new window.YT.Player('youtube-background-video', {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          showinfo: 0,
          modestbranding: 1,
          loop: 1,
          playlist: videoId,
          fs: 0,
          cc_load_policy: 0,
          iv_load_policy: 3,
          autohide: 0,
          mute: 1,
          rel: 0,
          playsinline: 1
        },
        events: {
          onReady: (event) => {
            event.target.playVideo();
            event.target.mute();
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          }
        }
      });
    };

    loadYouTubeAPI();
  }, [videoId]);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div 
        className="absolute inset-0 -z-10 w-full h-full bg-black"
        style={{ overflow: "hidden" }}
      >
        <div
          id="youtube-background-video"
          className="absolute top-1/2 left-1/2 w-[100vw] h-[56.25vw] min-h-[100vh] min-w-[177.77vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
        {/* Color overlay for contrast */}
        <div className="absolute inset-0 bg-blue-900/40" />
      </div>

      {/* Overlayed Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto drop-shadow-xl">
        {children}
      </div>
    </section>
  );
};

export default YouTubeVideoBackground;
