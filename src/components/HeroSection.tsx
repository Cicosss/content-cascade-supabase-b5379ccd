
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Calendar, Users, Search } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const HeroSection = () => {
  const { user } = useAuth();
  
  const getUserGreeting = () => {
    if (user?.user_metadata?.first_name) {
      return `Ciao, ${user.user_metadata.first_name}! 👋`;
    } else if (user?.email) {
      const emailName = user.email.split('@')[0];
      return `Ciao, ${emailName}! 👋`;
    }
    return 'Benvenuto in Romagna! 👋';
  };

  return (
    <div className="relative overflow-hidden">
      {/* Hero Background with elegant gradient */}
      <div className="h-[500px] relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-xl"></div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              {getUserGreeting()}
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-white/95 font-light leading-relaxed">
              Il tuo compagno di viaggio personalizzato nel cuore della Romagna
            </p>
            <p className="text-lg text-white/85 mb-8 leading-relaxed">
              Scopri tesori nascosti, tradizioni affascinanti e sapori unici che rendono questa terra così speciale
            </p>
            <Button className="bg-white text-emerald-700 hover:bg-gray-50 px-8 py-4 text-lg font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300">
              Inizia a Esplorare
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Search Card */}
      <div className="relative -mt-24 container mx-auto px-4">
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Location */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Destinazione</label>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-all cursor-pointer group">
                <MapPin className="h-6 w-6 text-emerald-600 group-hover:text-emerald-700" />
                <div>
                  <div className="font-semibold text-gray-900">Rimini</div>
                  <div className="text-sm text-gray-500">Provincia di Rimini</div>
                </div>
              </div>
            </div>

            {/* Check-in */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Arrivo</label>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-all cursor-pointer group">
                <Calendar className="h-6 w-6 text-emerald-600 group-hover:text-emerald-700" />
                <div>
                  <div className="font-semibold text-gray-900">15 Giugno</div>
                  <div className="text-sm text-gray-500">Check-in</div>
                </div>
              </div>
            </div>

            {/* Check-out */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Partenza</label>
              <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-all cursor-pointer group">
                <Calendar className="h-6 w-6 text-emerald-600 group-hover:text-emerald-700" />
                <div>
                  <div className="font-semibold text-gray-900">22 Giugno</div>
                  <div className="text-sm text-gray-500">Check-out</div>
                </div>
              </div>
            </div>

            {/* Guests & Search */}
            <div className="space-y-3">
              <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Ospiti</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-2xl hover:bg-emerald-50 transition-all cursor-pointer group flex-1">
                  <Users className="h-6 w-6 text-emerald-600 group-hover:text-emerald-700" />
                  <div>
                    <div className="font-semibold text-gray-900">2 ospiti</div>
                    <div className="text-sm text-gray-500">Adulti</div>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white p-4 h-auto rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Search className="h-6 w-6" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HeroSection;
