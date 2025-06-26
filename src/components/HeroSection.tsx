
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MiaRomagnaLogo from './MiaRomagnaLogo';

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const getUserGreeting = () => {
    if (user?.user_metadata?.first_name) {
      return `Benvenuto ${user.user_metadata.first_name}!`;
    } else if (user?.email) {
      const emailName = user.email.split('@')[0];
      return `Benvenuto ${emailName}!`;
    }
    return 'Benvenuto in Romagna!';
  };
  
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <iframe 
        src="https://www.youtube.com/embed/0ZhNqBN9ZfQ?autoplay=1&loop=1&mute=1&playsinline=1&controls=0&showinfo=0&autohide=1&modestbranding=1&playlist=0ZhNqBN9ZfQ" 
        className="absolute top-1/2 left-1/2 w-[177.77vh] h-screen transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1]" 
        frameBorder="0" 
        allow="autoplay; encrypted-media" 
        allowFullScreen 
      />

      {/* Content Overlay */}
      <div className="relative z-[2] text-white text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4">
        <div className="max-w-5xl mx-auto">
          {/* Brand Section */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <MiaRomagnaLogo width={160} height={53} className="drop-shadow-lg" />
            <div>
              <p className="typography-subtitle text-brand-yellow-400 drop-shadow-lg">
                "Il territorio è tra le Tue mani"
              </p>
            </div>
          </div>
          
          <div className="space-y-8 mb-12">
            <h1 className="typography-hero text-white drop-shadow-2xl">
              {getUserGreeting()}
            </h1>
            <p className="typography-body-large text-slate-100 font-medium leading-relaxed max-w-4xl mx-auto drop-shadow-lg">
              L'applicazione ufficiale per scoprire le autentiche meraviglie della Provincia di Rimini
            </p>
            <p className="typography-story-intro text-slate-50 max-w-3xl mx-auto drop-shadow-lg">
              Dalla tradizione culinaria ai tesori nascosti, dalle esperienze culturali alle attività marittime. 
              Vivi la Romagna come un locale con guide certificate e itinerari personalizzati.
            </p>
          </div>

          {/* CTA Buttons - Brand Colors */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button className="border-2 border-brand-yellow-400/60 bg-brand-yellow-400/20 text-white hover:bg-brand-yellow-400/30 hover:border-brand-yellow-400/80 px-12 py-7 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 backdrop-blur-md drop-shadow-lg animate-button-glow">
              <Download className="h-6 w-6 mr-3 text-brand-yellow-300" />
              Scarica l'App Gratis
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/experiences')} 
              className="border-2 border-brand-blue-400/60 bg-brand-blue-600/20 text-white hover:bg-brand-blue-600/30 hover:border-brand-blue-400/80 px-12 py-7 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 backdrop-blur-md drop-shadow-lg"
            >
              <Heart className="h-6 w-6 mr-3 text-brand-blue-300" />
              Scopri le Esperienze
            </Button>
          </div>

          {/* Key features - Brand Styling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base">
            <div className="flex items-center justify-center space-x-3 text-slate-200 bg-brand-blue-900/30 backdrop-blur-md rounded-2xl p-4 border border-brand-yellow-400/20 shadow-xl">
              <div className="w-3 h-3 bg-brand-yellow-400 rounded-full animate-pulse shadow-lg"></div>
              <span className="typography-body-small font-medium drop-shadow-lg text-white">Supporto 6 lingue complete</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-slate-200 bg-brand-blue-900/30 backdrop-blur-md rounded-2xl p-4 border border-brand-yellow-400/20 shadow-xl">
              <div className="w-3 h-3 bg-brand-blue-400 rounded-full animate-pulse shadow-lg"></div>
              <span className="typography-body-small font-medium drop-shadow-lg text-white">GPS integrato e mappe offline</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-slate-200 bg-brand-blue-900/30 backdrop-blur-md rounded-2xl p-4 border border-brand-yellow-400/20 shadow-xl">
              <div className="w-3 h-3 bg-brand-yellow-500 rounded-full animate-pulse shadow-lg"></div>
              <span className="typography-body-small font-medium drop-shadow-lg text-white">Guide locali certificate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
