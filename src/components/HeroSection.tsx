import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MiaRomagnaLogo from './MiaRomagnaLogo';
const HeroSection = () => {
  const {
    user
  } = useAuth();
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
  return <div className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <iframe src="https://www.youtube.com/embed/0ZhNqBN9ZfQ?autoplay=1&loop=1&mute=1&playsinline=1&controls=0&showinfo=0&autohide=1&modestbranding=1&playlist=0ZhNqBN9ZfQ" className="absolute top-1/2 left-1/2 w-[177.77vh] h-screen transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[1]" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen />

      {/* Content Overlay */}
      <div className="relative z-[2] text-white text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full px-4">
        <div className="max-w-5xl mx-auto">
          {/* Brand Section */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <MiaRomagnaLogo width={160} height={53} className="drop-shadow-lg" />
            <div>
              <p className="text-orange-300 font-semibold text-lg italic drop-shadow-lg">"Il territorio è tra le Tue mani"</p>
            </div>
          </div>
          
          <div className="space-y-6 mb-10">
            <h2 className="text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg">
              {getUserGreeting()}
            </h2>
            <p className="text-2xl md:text-3xl text-slate-200 font-light leading-relaxed max-w-4xl mx-auto drop-shadow-lg">
              L'applicazione ufficiale per scoprire le autentiche meraviglie della Provincia di Rimini
            </p>
            <p className="text-xl leading-relaxed max-w-3xl mx-auto drop-shadow-lg text-slate-50">
              Dalla tradizione culinaria ai tesori nascosti, dalle esperienze culturali alle attività marittime. 
              Vivi la Romagna come un locale con guide certificate e itinerari personalizzati.
            </p>
          </div>

          {/* CTA Buttons - Redesigned for better harmony with video */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
            <Button className="border-2 border-orange-400/60 bg-orange-500/20 text-white hover:bg-orange-500/30 hover:border-orange-400/80 px-12 py-7 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 backdrop-blur-md drop-shadow-lg">
              <Download className="h-6 w-6 mr-3 text-orange-300" />
              Scarica l'App Gratis
            </Button>
            <Button variant="outline" onClick={() => navigate('/experiences')} className="border-2 border-red-400/60 bg-red-500/20 text-white hover:bg-red-500/30 hover:border-red-400/80 px-12 py-7 text-xl font-bold rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-110 backdrop-blur-md drop-shadow-lg">
              <Heart className="h-6 w-6 mr-3 text-red-300" />
              Scopri le Esperienze
            </Button>
          </div>

          {/* Key features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base">
            <div className="flex items-center justify-center space-x-3 text-slate-200 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg"></div>
              <span className="font-medium drop-shadow-lg">Supporto 6 lingue complete</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-slate-200 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
              <span className="font-medium drop-shadow-lg">GPS integrato e mappe offline</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-slate-200 bg-black/20 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-xl">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse shadow-lg"></div>
              <span className="font-medium drop-shadow-lg">Guide locali certificate</span>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default HeroSection;