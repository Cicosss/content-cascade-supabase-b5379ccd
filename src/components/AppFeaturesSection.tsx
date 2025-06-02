
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar, MessageCircle, Globe, Smartphone } from 'lucide-react';

const AppFeaturesSection = () => {
  const features = [
    {
      icon: MapPin,
      title: "Mappa Interattiva con GPS",
      description: "Utilizza il GPS per segnalare attrazioni vicine e guide dettagliate sui luoghi nascosti",
      color: "bg-red-500"
    },
    {
      icon: Users,
      title: "Guide Locali Certificate",
      description: "Informazioni dettagliate su luoghi e attrazioni nascoste da esperti del territorio",
      color: "bg-blue-500"
    },
    {
      icon: Calendar,
      title: "Eventi e Aggiornamenti",
      description: "Sempre aggiornato su eventi locali, culturali, sportivi e spettacoli",
      color: "bg-green-500"
    },
    {
      icon: MessageCircle,
      title: "Itinerari Personalizzati",
      description: "Percorsi su misura basati sui tuoi interessi e durata del soggiorno",
      color: "bg-purple-500"
    },
    {
      icon: Globe,
      title: "Supporto Multilingua",
      description: "Disponibile in 5 lingue: Italiano, Inglese, Tedesco, Francese, Spagnolo e Russo",
      color: "bg-orange-500"
    },
    {
      icon: Smartphone,
      title: "Sistema di Feedback",
      description: "Condividi le tue esperienze e contribuisci alla community di viaggiatori",
      color: "bg-cyan-500"
    }
  ];

  return (
    <section className="py-16 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">I Punti Chiave dell'App</h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Un compagno affidabile per un'esperienza autentica che offre accesso a una varietà di attività, 
            come escursioni, attività marittime e consigli per il tempo in famiglia
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 bg-white border-0 shadow-md">
              <div className="flex items-start space-x-4">
                <div className={`${feature.color} p-3 rounded-xl shadow-md`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            <span>✅</span>
            <span>Completamente gratuita per tutti gli utenti Android & iOS</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppFeaturesSection;
