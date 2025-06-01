
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { MapPin, Calendar, Users } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative">
      {/* Hero Background */}
      <div className="h-96 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="text-white max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Ciao, Luca! 👋
            </h1>
            <p className="text-xl md:text-2xl mb-6 text-white/90">
              Il tuo compagno di viaggio personalizzato nel cuore della Romagna
            </p>
            <p className="text-lg text-white/80">
              Scopri tesori nascosti, tradizioni affascinanti e sapori unici
            </p>
          </div>
        </div>
      </div>

      {/* Search Card */}
      <div className="relative -mt-20 container mx-auto px-4">
        <Card className="bg-white shadow-xl rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Location */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Località</label>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                <MapPin className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">Rimini</div>
                  <div className="text-sm text-gray-500">Provincia di Rimini</div>
                </div>
              </div>
            </div>

            {/* Check-in */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Arrivo</label>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">15 Giu</div>
                  <div className="text-sm text-gray-500">Check-in</div>
                </div>
              </div>
            </div>

            {/* Check-out */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Partenza</label>
              <div className="flex items-center space-x-2 p-3 border rounded-lg hover:border-blue-500 transition-colors cursor-pointer">
                <Calendar className="h-5 w-5 text-gray-400" />
                <div>
                  <div className="font-medium">22 Giu</div>
                  <div className="text-sm text-gray-500">Check-out</div>
                </div>
              </div>
            </div>

            {/* Guests */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Ospiti</label>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:border-blue-500 transition-colors cursor-pointer flex-1 mr-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium">2 ospiti</div>
                    <div className="text-sm text-gray-500">Adulti</div>
                  </div>
                </div>
                <Button className="romagna-gradient text-white px-8 py-3 h-auto">
                  Cerca
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
