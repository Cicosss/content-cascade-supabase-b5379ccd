
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Calendar, Users, Search, Smartphone, Heart, Download } from 'lucide-react';
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
    <div className="relative overflow-hidden bg-slate-900">
      {/* Hero Background con design più fedele agli allegati */}
      <div className="min-h-[700px] relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Rainbow accent bar più prominente */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-orange-400 via-yellow-300 via-green-400 via-blue-400 via-indigo-400 to-purple-400"></div>
        
        {/* Overlay più sofisticato */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
        
        {/* Elementi decorativi ispirati al design degli allegati */}
        <div className="absolute top-20 right-10 w-40 h-40 border-4 border-orange-400/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-24 h-24 border-2 border-yellow-300/30 rounded-full"></div>
        <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-bounce"></div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center min-h-[700px]">
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
              <Button className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white px-10 py-6 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
                <Download className="h-6 w-6 mr-3" />
                Scarica l'App Gratis
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-white/40 text-white hover:bg-white/20 px-10 py-6 text-xl rounded-2xl backdrop-blur-sm transition-all duration-300"
                onClick={() => navigate('/experiences')}
              >
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

      {/* Enhanced Discovery Card - Layout Completamente Ridisegnato per Evitare Sovrapposizioni */}
      <div className="relative -mt-40 container mx-auto px-4 z-10">
        <Card className="bg-white/98 backdrop-blur-md shadow-2xl rounded-3xl border-0 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-10">
              <h3 className="text-3xl font-bold text-slate-900 mb-4">Scopri la Vera Romagna</h3>
              <p className="text-slate-600 text-lg">Scegli la tua categoria preferita e inizia l'avventura</p>
            </div>
            
            {/* Layout Completamente Ristrutturato - Grid Responsive Senza Sovrapposizioni */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8 mb-10">
              {/* Tradizione Culinaria */}
              <div className="w-full max-w-none">
                <div 
                  className="group cursor-pointer h-full"
                  onClick={() => navigate('/experiences')}
                >
                  <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-6 h-full min-h-[180px] flex flex-col items-center justify-center text-center space-y-4 transition-all duration-300 hover:from-red-100 hover:to-red-200 hover:shadow-xl border border-red-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">🍝</span>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-slate-900 text-sm leading-tight">Tradizione Culinaria</div>
                      <div className="text-xs text-slate-600">Sapori autentici romagnoli</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Esperienze Culturali */}
              <div className="w-full max-w-none">
                <div 
                  className="group cursor-pointer h-full"
                  onClick={() => navigate('/restaurants')}
                >
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 h-full min-h-[180px] flex flex-col items-center justify-center text-center space-y-4 transition-all duration-300 hover:from-blue-100 hover:to-blue-200 hover:shadow-xl border border-blue-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">🏛️</span>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-slate-900 text-sm leading-tight">Esperienze Culturali</div>
                      <div className="text-xs text-slate-600">Arte, storia e patrimonio</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Attività Marittime */}
              <div className="w-full max-w-none">
                <div 
                  className="group cursor-pointer h-full"
                  onClick={() => navigate('/itineraries')}
                >
                  <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 h-full min-h-[180px] flex flex-col items-center justify-center text-center space-y-4 transition-all duration-300 hover:from-cyan-100 hover:to-cyan-200 hover:shadow-xl border border-cyan-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">⛵</span>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-slate-900 text-sm leading-tight">Attività Marittime</div>
                      <div className="text-xs text-slate-600">Mare e avventure acquatiche</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Eventi Speciali */}
              <div className="w-full max-w-none">
                <div 
                  className="group cursor-pointer h-full"
                  onClick={() => navigate('/events')}
                >
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 h-full min-h-[180px] flex flex-col items-center justify-center text-center space-y-4 transition-all duration-300 hover:from-green-100 hover:to-green-200 hover:shadow-xl border border-green-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">🎭</span>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-slate-900 text-sm leading-tight">Eventi Speciali</div>
                      <div className="text-xs text-slate-600">Festival e manifestazioni</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sezione Family */}
              <div className="w-full max-w-none">
                <div 
                  className="group cursor-pointer h-full"
                  onClick={() => navigate('/family')}
                >
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 h-full min-h-[180px] flex flex-col items-center justify-center text-center space-y-4 transition-all duration-300 hover:from-purple-100 hover:to-purple-200 hover:shadow-xl border border-purple-100">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <span className="text-white text-2xl">👨‍👩‍👧‍👦</span>
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-slate-900 text-sm leading-tight">Sezione Family</div>
                      <div className="text-xs text-slate-600">Divertimento per famiglie</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics section come negli allegati */}
            <div className="pt-8 border-t border-slate-200">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-slate-900">500+</div>
                  <div className="text-sm text-slate-600">Luoghi da scoprire</div>
                </div>
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-slate-900">50+</div>
                  <div className="text-sm text-slate-600">Guide certificate</div>
                </div>
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-slate-900">6</div>
                  <div className="text-sm text-slate-600">Lingue supportate</div>
                </div>
                <div className="space-y-3">
                  <div className="text-3xl font-bold text-slate-900">24/7</div>
                  <div className="text-sm text-slate-600">Supporto disponibile</div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HeroSection;
