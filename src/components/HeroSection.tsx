
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
    <div className="relative overflow-hidden">
      {/* Video Background */}
      <div className="relative min-h-[700px] h-screen">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/placeholder.svg"
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/path-to-your-video.mp4" type="video/mp4" />
          <source src="/path-to-your-video.webm" type="video/webm" />
          Il tuo browser non supporta il tag video.
        </video>

        {/* Rainbow accent bar più prominente */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-orange-400 via-yellow-300 via-green-400 via-blue-400 via-indigo-400 to-purple-400 z-10"></div>
        
        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
        
        {/* Elementi decorativi ispirati al design degli allegati */}
        <div className="absolute top-20 right-10 w-40 h-40 border-4 border-orange-400/20 rounded-full animate-pulse z-20"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-yellow-300/30 rounded-full z-20"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-orange-400 rounded-full animate-pulse z-20"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-bounce z-20"></div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center min-h-[700px] z-30">
          <div className="text-white max-w-5xl">
            {/* Brand Section più fedele agli allegati */}
            <div className="flex items-center space-x-4 mb-6">
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
              <p className="text-2xl md:text-3xl text-slate-200 font-light leading-relaxed max-w-4xl">
                L'applicazione ufficiale per scoprire le autentiche meraviglie della Provincia di Rimini
              </p>
              <p className="text-xl text-slate-300 leading-relaxed max-w-3xl">
                Dalla tradizione culinaria ai tesori nascosti, dalle esperienze culturali alle attività marittime. 
                Vivi la Romagna come un locale con guide certificate e itinerari personalizzati.
              </p>
            </div>

            {/* CTA Buttons più evidenti */}
            <div className="flex flex-col sm:flex-row gap-6 mb-10">
              <Button className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 bg-inherit">
                <Download className="h-6 w-6 mr-3" />
                Scarica l'App Gratis
              </Button>
              <Button variant="outline" onClick={() => navigate('/experiences')} className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 bg-inherit">
                <Heart className="h-6 w-6 mr-3" />
                Scopri le Esperienze
              </Button>
            </div>

            {/* Key features più dettagliate */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base">
              <div className="flex items-center space-x-3 text-slate-200 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Supporto 6 lingue complete</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-200 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="font-medium">GPS integrato e mappe offline</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-200 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Guide locali certificate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
