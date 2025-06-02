
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Calendar, Users, Search, Smartphone, Heart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();
  
  const getUserGreeting = () => {
    if (user?.user_metadata?.first_name) {
      return `Benvenuto ${user.user_metadata.first_name}! 👋`;
    } else if (user?.email) {
      const emailName = user.email.split('@')[0];
      return `Benvenuto ${emailName}! 👋`;
    }
    return 'Benvenuto! 👋';
  };

  return (
    <div className="relative overflow-hidden bg-slate-900">
      {/* Hero Background inspired by the project presentation */}
      <div className="h-[600px] relative bg-gradient-to-br from-slate-800 via-slate-900 to-slate-950">
        {/* Rainbow accent bar at top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-400 via-yellow-300 via-green-400 via-blue-400 via-indigo-400 to-purple-400"></div>
        
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        
        {/* Decorative elements inspired by the ferris wheel in the presentation */}
        <div className="absolute top-20 right-10 w-32 h-32 border-4 border-orange-400/20 rounded-full"></div>
        <div className="absolute bottom-40 right-20 w-20 h-20 border-2 border-yellow-300/30 rounded-full"></div>
        <div className="absolute top-40 right-32 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-4xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-red-500 via-orange-400 to-yellow-300 shadow-lg">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">
                  Mia Romagna 2024
                </h1>
                <p className="text-orange-300 font-medium">"Il territorio è tra le Tue mani"</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <h2 className="text-4xl md:text-6xl font-bold leading-tight">
                {getUserGreeting()}
              </h2>
              <p className="text-xl md:text-2xl text-slate-300 font-light leading-relaxed max-w-3xl">
                L'applicazione definitiva per esplorare le autentiche eccellenze della Romagna
              </p>
              <p className="text-lg text-slate-400 leading-relaxed max-w-2xl">
                Scopri tesori nascosti, vivi esperienze autentiche e lasciati guidare dai segreti meglio custoditi della provincia di Rimini
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button className="bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:from-red-600 hover:via-orange-500 hover:to-yellow-400 text-white px-8 py-4 text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
                <Heart className="h-5 w-5 mr-2" />
                Inizia l'Avventura Gratis
              </Button>
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg rounded-2xl backdrop-blur-sm">
                Scopri le Categorie
              </Button>
            </div>

            {/* Key features highlight */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-slate-300">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>5 lingue disponibili</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>Mappa interattiva GPS</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Guide locali certificate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Card - now focused on discovery */}
      <div className="relative -mt-32 container mx-auto px-4">
        <Card className="bg-white/98 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border-0">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Cosa vuoi scoprire oggi?</h3>
            <p className="text-slate-600">Lasciati guidare dalle categorie principali dell'app</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {/* Tradizione Culinaria */}
            <div className="text-center space-y-3 p-4 bg-red-50 rounded-2xl hover:bg-red-100 transition-all cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-xl">🍝</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">Tradizione Culinaria</div>
                <div className="text-xs text-slate-600">Sapori autentici</div>
              </div>
            </div>

            {/* Esperienze Culturali */}
            <div className="text-center space-y-3 p-4 bg-blue-50 rounded-2xl hover:bg-blue-100 transition-all cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-xl">🏛️</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">Esperienze Culturali</div>
                <div className="text-xs text-slate-600">Arte e storia</div>
              </div>
            </div>

            {/* Attività Marittime */}
            <div className="text-center space-y-3 p-4 bg-cyan-50 rounded-2xl hover:bg-cyan-100 transition-all cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-xl">⛵</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">Attività Marittime</div>
                <div className="text-xs text-slate-600">Mare e avventura</div>
              </div>
            </div>

            {/* Escursioni */}
            <div className="text-center space-y-3 p-4 bg-green-50 rounded-2xl hover:bg-green-100 transition-all cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-green-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-xl">🥾</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">Escursioni</div>
                <div className="text-xs text-slate-600">Natura e trekking</div>
              </div>
            </div>

            {/* Esperienze del Territorio */}
            <div className="text-center space-y-3 p-4 bg-orange-50 rounded-2xl hover:bg-orange-100 transition-all cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-xl">🏞️</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">Territorio</div>
                <div className="text-xs text-slate-600">Paesaggi unici</div>
              </div>
            </div>

            {/* Sezione Family */}
            <div className="text-center space-y-3 p-4 bg-purple-50 rounded-2xl hover:bg-purple-100 transition-all cursor-pointer group">
              <div className="mx-auto w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-white text-xl">👨‍👩‍👧‍👦</span>
              </div>
              <div>
                <div className="font-semibold text-slate-900 text-sm">Sezione Family</div>
                <div className="text-xs text-slate-600">Per tutta la famiglia</div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HeroSection;
