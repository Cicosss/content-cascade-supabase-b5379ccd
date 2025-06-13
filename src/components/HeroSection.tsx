
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, Heart, Smartphone } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getUserGreeting = () => {
    if (user?.user_metadata?.first_name) {
      return `Benvenuto ${user.user_metadata.first_name}! 👋`;
    } else if (user?.email) {
      const emailName = user.email.split('@')[0];
      return `Benvenuto ${emailName}! 👋`;
    }
    return 'Benvenuto in Romagna! 👋';
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
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-red-500 via-orange-400 to-yellow-300 shadow-2xl">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                Mia Romagna
              </h1>
              <p className="text-orange-300 font-semibold text-lg italic">"Il territorio è tra le Tue mani"</p>
            </div>
          </div>
          
          <div className="space-y-6 mb-10">
            <h2 className="text-5xl md:text-7xl font-bold leading-tight">
              {getUserGreeting()}
            </h2>
            <p className="text-2xl md:text-3xl text-slate-200 font-light leading-relaxed max-w-4xl mx-auto">
              L'applicazione ufficiale per scoprire le autentiche meraviglie della Provincia di Rimini
            </p>
            <p className="text-xl text-slate-300 leading-relaxed max-w-3xl mx-auto">
              Dalla tradizione culinaria ai tesori nascosti, dalle esperienze culturali alle attività marittime. 
              Vivi la Romagna come un locale con guide certificate e itinerari personalizzati.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-10">
            <Button className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <Download className="h-6 w-6 mr-3" />
              Scarica l'App Gratis
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/experiences')} 
              className="border-white/50 text-white hover:bg-white/10 px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              <Heart className="h-6 w-6 mr-3" />
              Scopri le Esperienze
            </Button>
          </div>

          {/* Key features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base">
            <div className="flex items-center justify-center space-x-3 text-slate-200 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Supporto 6 lingue complete</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-slate-200 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="font-medium">GPS integrato e mappe offline</span>
            </div>
            <div className="flex items-center justify-center space-x-3 text-slate-200 bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Guide locali certificate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
