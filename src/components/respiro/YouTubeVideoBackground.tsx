
import React, { useEffect, useRef } from 'react';

interface YouTubeVideoBackgroundProps {
  videoId: string;
  children: React.ReactNode;
}

const YouTubeVideoBackground: React.FC<YouTubeVideoBackgroundProps> = ({ videoId, children }) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cleanup function per rimuovere il player esistente
    const cleanup = () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };

    // Load YouTube IFrame API
    const loadYouTubeAPI = () => {
      return new Promise<void>((resolve) => {
        if (window.YT && window.YT.Player) {
          resolve();
          return;
        }
        
        // Controlla se lo script è già stato aggiunto
        if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
          const checkYT = setInterval(() => {
            if (window.YT && window.YT.Player) {
              clearInterval(checkYT);
              resolve();
            }
          }, 100);
          return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        
        window.onYouTubeIframeAPIReady = () => {
          resolve();
        };

        const firstScriptTag = document.getElementsByTagName('script')[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
      });
    };

    // Initialize player
    const initializePlayer = async () => {
      try {
        await loadYouTubeAPI();
        
        if (!containerRef.current) return;
        
        cleanup(); // Pulisci il player esistente prima di crearne uno nuovo
        
        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId: videoId,
          width: '100%',
          height: '100%',
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
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin,
            disablekb: 1,
            start: 1,
            end: 0
          },
          events: {
            onReady: (event: any) => {
              console.log('YouTube player ready');
              event.target.mute();
              event.target.seekTo(1); // Inizia dal secondo 1 per nascondere il titolo
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              // Loop il video quando finisce, ripartendo dal secondo 1
              if (event.data === window.YT.PlayerState.ENDED) {
                event.target.seekTo(1);
                event.target.playVideo();
              }
            },
            onError: (event: any) => {
              console.error('YouTube player error:', event.data);
            }
          }
        });
      } catch (error) {
        console.error('Errore nell\'inizializzazione del player YouTube:', error);
      }
    };

    initializePlayer();

    // Cleanup al dismount del componente
    return cleanup;
  }, [videoId]);

  return (
    <section className="relative hero-unclamp -inset-[24px] md:-inset-[28px] h-screen flex items-center justify-center overflow-hidden bg-slate-900">
      {/* Video Background Container - Cinematographic Effect */}
      <div className="absolute hero-unclamp -inset-[24px] md:-inset-[28px] w-full h-full overflow-hidden">
        <div
          ref={containerRef}
          className="absolute top-1/2 left-1/2 w-[200vw] h-[112.5vw] min-h-[200vh] min-w-[355.55vh] -translate-x-1/2 -translate-y-1/2 scale-[1.35]"
          id="youtube-background-video"
        />
        {/* Enhanced color overlay for better text contrast and cinematographic feel */}
        <div className="absolute hero-unclamp -inset-[24px] md:-inset-[28px] bg-gradient-to-b from-blue-900/60 via-blue-900/40 to-slate-900/80" />
        
        {/* YouTube UI Elements Masking Overlay */}
        <div className="absolute hero-unclamp -inset-[24px] md:-inset-[28px] pointer-events-none z-20 overflow-hidden">
          {/* Hide YouTube title and end screen suggestions */}
          <div className="absolute -top-8 -left-8 -right-8 h-32 bg-transparent" />
          <div className="absolute -bottom-8 -left-8 -right-8 h-32 bg-transparent" />
          <div className="absolute -top-8 -right-8 w-40 h-24 bg-transparent" />
          <div className="absolute -bottom-8 -right-8 w-48 h-32 bg-transparent" />
          
          {/* Complete overlay to ensure no YouTube branding shows */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-900/20" />
        </div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        {children}
      </div>
    </section>
  );
};

export default YouTubeVideoBackground;
