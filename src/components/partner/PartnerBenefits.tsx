
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, Zap, Users } from 'lucide-react';

const PartnerBenefits = () => {
  const benefits = [
    {
      icon: Eye,
      title: "Visibilità Mirata",
      description: "Raggiungi un pubblico di turisti e residenti realmente interessato alle esperienze autentiche, grazie al nostro targeting intelligente basato su preferenze e geolocalizzazione."
    },
    {
      icon: Zap,
      title: "Gestione Semplificata",
      description: "Includiamo la tua attività con un mini-sito completo di foto, video, descrizioni e offerte speciali. Nessuna competenza tecnica richiesta."
    },
    {
      icon: Users,
      title: "Fai Parte di una Rete",
      description: "Entra in un ecosistema che valorizza la cultura e le tradizioni della Romagna. Collabora con altre eccellenze e aumenta il valore della tua offerta."
    }
  ];

  return (
    <section id="vantaggi" className="py-20 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Perché diventare Partner di Mia Romagna?
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {benefits.map((benefit, index) => {
            const IconComponent = benefit.icon;
            return (
              <Card key={index} className="p-8 text-center hover:shadow-xl transition-all duration-300 border-0 bg-white">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <IconComponent className="h-8 w-8 text-blue-600" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">
                    {benefit.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {benefit.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PartnerBenefits;
