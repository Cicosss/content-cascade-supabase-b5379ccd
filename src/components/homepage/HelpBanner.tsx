
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useServiceVisibility } from '@/hooks/useServiceVisibility';

const HelpBanner = () => {
  const { isVisible, elementRef } = useServiceVisibility({ threshold: 0.2 });
  
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
    <div ref={elementRef} className="relative mb-16 overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-4 left-8 w-20 h-20 bg-primary/5 rounded-full animate-float animation-delay-0"></div>
        <div className="absolute bottom-4 right-8 w-16 h-16 bg-accent/5 rounded-full animate-drift animation-delay-500"></div>
        <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-secondary/5 rounded-full animate-pulse animation-delay-1000"></div>
      </div>

      <Card className={`relative p-6 sm:p-8 lg:p-10 rounded-3xl shadow-2xl border bg-card/95 backdrop-blur-sm perspective-1000 transition-all duration-1000 transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        {/* 3D Relief Shadow Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-muted/20 rounded-3xl transform translate-x-2 translate-y-2 blur-sm -z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-muted/20 to-muted/30 rounded-3xl transform translate-x-1 translate-y-1 -z-10"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center relative z-10">
          
          {/* Colonna Sinistra: Avatar Team (40% su desktop) */}
          <div className={`lg:col-span-2 flex justify-center lg:justify-start transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          }`}>
            <div className="relative flex items-center">
              {localExperts.map((expert, index) => (
                <div
                  key={expert.id}
                  className={`relative transition-all duration-500 hover:scale-110 hover:z-20 animate-float ${
                    index > 0 ? '-ml-4' : ''
                  }`}
                  style={{ 
                    zIndex: localExperts.length - index,
                    animationDelay: `${index * 200}ms`
                  }}
                >
                  <Avatar className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 border-4 border-white shadow-2xl hover:shadow-3xl transition-all duration-300 ring-2 ring-primary/20 hover:ring-primary/40">
                    <AvatarImage 
                      src={expert.image} 
                      alt={`Esperto locale ${expert.name}`}
                      className="object-cover transition-all duration-500 hover:scale-110"
                    />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-bold font-playfair text-lg">
                      {expert.fallback}
                    </AvatarFallback>
                  </Avatar>
                  
                  {/* Floating particle effect */}
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full animate-ping opacity-75"></div>
                </div>
              ))}
              
              {/* Indicatore "più esperti" */}
              <div className="relative -ml-4 transition-all duration-500 hover:scale-110 animate-bounce animation-delay-1000">
                <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 rounded-full bg-gradient-to-br from-accent to-accent/80 border-4 border-white shadow-2xl flex items-center justify-center ring-2 ring-accent/20 hover:ring-accent/40 transition-all duration-300">
                  <span className="text-white font-bold font-playfair text-sm lg:text-base">+12</span>
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 blur-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Colonna Destra: Contenuto e CTA (60% su desktop) */}
          <div className={`lg:col-span-3 text-center lg:text-left space-y-6 px-4 lg:px-0 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`} style={{ transitionDelay: '200ms' }}>
            
            {/* Titolo Caldo e Diretto */}
            <h3 className="typography-h2 text-foreground">
              Parla con un Esperto della Romagna
            </h3>
            
            {/* Paragrafo Coinvolgente */}
            <p className="typography-subtitle text-muted-foreground">
              Che tu stia cercando quel ristorante perfetto o un consiglio per una gita fuori porta, 
              il nostro team di appassionati del territorio è qui per aiutarti a creare la tua 
              <span className="font-semibold text-primary"> esperienza su misura</span>.
            </p>
            
            {/* Call to Action Warmth */}
            <div className="pt-4">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 py-6 text-lg lg:text-xl transition-all duration-500 hover:scale-105 active:scale-95 shadow-2xl hover:shadow-3xl rounded-2xl transform hover:rotate-1 hover:-translate-y-1">
                <div className="flex items-center gap-3">
                  <span className="text-2xl animate-bounce">💬</span>
                  <span className="typography-body font-bold tracking-wide">Chiedi un Consiglio</span>
                </div>
              </Button>
            </div>
            
            {/* Sottotesto Rassicurante */}
            <p className="typography-small text-muted-foreground mt-4">
              <span className="font-semibold text-primary">Risposta gratuita</span> • 
              <span className="mx-2">Consigli personalizzati</span> • 
              <span>Esperti sempre disponibili</span>
            </p>
          </div>

        </div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-ping animation-delay-300"></div>
        <div className="absolute bottom-6 left-6 w-4 h-4 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full animate-pulse animation-delay-600"></div>
        
        {/* Subtle twinkle effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-16 w-1 h-1 bg-primary-foreground/60 rounded-full animate-twinkle animation-delay-0"></div>
          <div className="absolute bottom-12 right-20 w-1.5 h-1.5 bg-primary-foreground/50 rounded-full animate-twinkle animation-delay-500"></div>
          <div className="absolute top-1/3 right-8 w-1 h-1 bg-primary-foreground/40 rounded-full animate-twinkle animation-delay-1000"></div>
        </div>
      </Card>
    </div>
  );
};

export default HelpBanner;
