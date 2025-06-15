
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Smartphone, Heart, Waves } from 'lucide-react';
import { Link } from 'react-router-dom';

const ServicesSection = () => {
  return (
    <div className="space-y-6">
      {/* Respiro del Mare Banner */}
      <Card className="p-10 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white border-0 shadow-2xl rounded-3xl">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-3 bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold shadow-lg">
              <Waves className="h-5 w-5 text-blue-200" />
              <span>Respiro del Mare</span>
            </div>
          </div>
          <h3 className="typography-h2 mb-4">Aiutaci a proteggere il nostro mare</h3>
          <p className="text-blue-100 mb-8 typography-body">
            Sostieni la pulizia delle spiagge romagnole e crea opportunità di lavoro per chi ne ha bisogno
          </p>
          <Button 
            asChild
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Link to="/respiro-del-mare">
              <Heart className="h-5 w-5 mr-2" />
              Scopri Respiro del Mare
            </Link>
          </Button>
        </div>
      </Card>

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
