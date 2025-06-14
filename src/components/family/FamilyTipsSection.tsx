
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Star, Clock, MapPin, Heart, Shield, Gift, Camera } from 'lucide-react';

const FamilyTipsSection = () => {
  return (
    <Card className="p-10 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border-0 shadow-xl">
      <div className="text-center mb-8">
        <Camera className="h-12 w-12 mx-auto text-purple-600 mb-4" />
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Consigli per una Vacanza Family Perfetta
        </h2>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Suggerimenti dai nostri esperti per vivere al meglio la Romagna in famiglia
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Clock className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Pianifica con Anticipo</h3>
              <p className="text-slate-600 text-sm">Prenota le attività più richieste almeno una settimana prima per garantire la disponibilità</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Esplora i Dintorni</h3>
              <p className="text-slate-600 text-sm">Ogni attività include suggerimenti per scoprire attrazioni nelle vicinanze</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Gift className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Sconti Famiglia</h3>
              <p className="text-slate-600 text-sm">Tariffe ridotte per famiglie numerose e pacchetti combinati vantaggiosi</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Tradizioni Locali</h3>
              <p className="text-slate-600 text-sm">Ogni esperienza include elementi della cultura romagnola autentica</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Sicurezza Primo</h3>
              <p className="text-slate-600 text-sm">Tutte le attività seguono protocolli di sicurezza certificati per bambini</p>
            </div>
          </div>
          <div className="flex items-start space-x-4">
            <div className="w-10 h-10 bg-teal-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Esperienze Uniche</h3>
              <p className="text-slate-600 text-sm">Accesso esclusivo a luoghi e attività non disponibili al turismo di massa</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center mt-10">
        <Button className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          <Users className="h-5 w-5 mr-2" />
          Inizia la Tua Avventura Family
        </Button>
      </div>
    </Card>
  );
};

export default FamilyTipsSection;
