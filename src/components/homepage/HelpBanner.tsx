
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const HelpBanner = () => {
  // Array di esperti locali con immagini placeholder
  const localExperts = [
    {
      id: 1,
      name: 'Marco',
      image: 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=150&h=150&fit=crop&crop=face',
      fallback: 'MA'
    },
    {
      id: 2,
      name: 'Giulia',
      image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=150&h=150&fit=crop&crop=face',
      fallback: 'GI'
    },
    {
      id: 3,
      name: 'Alessandro',
      image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=150&h=150&fit=crop&crop=face',
      fallback: 'AL'
    },
    {
      id: 4,
      name: 'Sofia',
      image: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=150&h=150&fit=crop&crop=face',
      fallback: 'SO'
    }
  ];

  return (
    <Card className="bg-[#FEFDFB] p-8 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.08)] border border-gray-100 mb-16 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
        
        {/* Colonna Sinistra: Avatar Team (40% su desktop) */}
        <div className="lg:col-span-2 flex justify-center lg:justify-start">
          <div className="relative flex items-center">
            {localExperts.map((expert, index) => (
              <div
                key={expert.id}
                className={`relative transition-transform duration-300 hover:scale-110 hover:z-10 ${
                  index > 0 ? '-ml-4' : ''
                }`}
                style={{ zIndex: localExperts.length - index }}
              >
                <Avatar className="w-16 h-16 border-4 border-white shadow-lg">
                  <AvatarImage 
                    src={expert.image} 
                    alt={`Esperto locale ${expert.name}`}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                    {expert.fallback}
                  </AvatarFallback>
                </Avatar>
              </div>
            ))}
            
            {/* Indicatore "più esperti" */}
            <div className="relative -ml-4 transition-transform duration-300 hover:scale-110">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 border-4 border-white shadow-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">+12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Colonna Destra: Contenuto e CTA (60% su desktop) */}
        <div className="lg:col-span-3 text-center lg:text-left space-y-4">
          
          {/* Titolo Caldo e Diretto */}
          <h3 className="text-2xl lg:text-3xl font-bold text-slate-800 leading-tight">
            Parla con un Esperto della Romagna
          </h3>
          
          {/* Paragrafo Coinvolgente */}
          <p className="text-slate-600 text-lg leading-relaxed">
            Che tu stia cercando quel ristorante perfetto o un consiglio per una gita fuori porta, 
            il nostro team di appassionati del territorio è qui per aiutarti a creare la tua 
            <span className="font-semibold text-slate-700"> esperienza su misura</span>.
          </p>
          
          {/* Call to Action Warmth */}
          <div className="pt-2">
            <Button className="bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-500 hover:to-orange-500 text-slate-800 font-semibold px-8 py-4 text-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl">
              <div className="flex items-center gap-3">
                <span className="text-xl">💬</span>
                <span>Chiedi un Consiglio</span>
              </div>
            </Button>
          </div>
          
          {/* Sottotesto Rassicurante */}
          <p className="text-sm text-slate-500 mt-3 leading-relaxed">
            <span className="font-medium">Risposta gratuita</span> • Consigli personalizzati • Esperti sempre disponibili
          </p>
        </div>

      </div>
    </Card>
  );
};

export default HelpBanner;
