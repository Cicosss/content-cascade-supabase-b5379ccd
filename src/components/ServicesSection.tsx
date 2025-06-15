
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import RespiroBannerFixed from './RespiroBannerFixed';

const ServicesSection = () => {
  return (
    <div className="space-y-6">
      {/* Banner fisso in basso a destra */}
      <RespiroBannerFixed />
      {/* App Download Banner */}
      <Card className="p-10 bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 text-white border-0 shadow-2xl rounded-3xl">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
              <span className="text-xl">📱</span>
              <span>Scarica l'App Mia Romagna</span>
            </div>
          </div>
          <h3 className="typography-h2 mb-4">Porta la Romagna sempre con te</h3>
          <p className="text-slate-200 mb-8 typography-body">
            Accesso offline, notifiche in tempo reale e funzionalità GPS avanzate
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg">
              <Smartphone className="h-5 w-5 mr-2" />
              Download Android
            </Button>
            <Button className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-lg">
              <Smartphone className="h-5 w-5 mr-2" />
              Download iOS
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ServicesSection;
