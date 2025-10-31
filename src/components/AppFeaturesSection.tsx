import React from 'react';
import { useServiceVisibility } from '@/hooks/useServiceVisibility';

const AppFeaturesSection = () => {
  const { isVisible, elementRef } = useServiceVisibility({ threshold: 0.2 });
  
  const features = [
    {
      id: 1,
      title: "Esplora il Territorio come un Abitante del Posto",
      description: "La nostra mappa interattiva rivela non solo i luoghi famosi, ma anche i tesori nascosti. Filtra, cerca e scopri i suggerimenti dei nostri esperti direttamente sulla mappa.",
      imagePosition: "left",
      imagePlaceholder: "photo-1488590528505-98d2b5aba04b"
    },
    {
      id: 2,
      title: "Itinerari Creati Apposta per Te",
      description: "Dicci cosa ami e per quanto tempo rimarrai. La nostra tecnologia AI creerà un itinerario unico per te, combinando i tuoi interessi in un'avventura indimenticabile.",
      imagePosition: "right",
      imagePlaceholder: "photo-1433086966358-54859d0ed716"
    },
    {
      id: 3,
      title: "Non Perderti Nulla di Ciò che Accade",
      description: "Festival, concerti, mostre. Ricevi notifiche e scopri gli eventi in corso vicino a te, aggiornati in tempo reale per vivere appieno la Romagna.",
      imagePosition: "left",
      imagePlaceholder: "photo-1581090464777-f3220bbe1b8b"
    }
  ];

  return (
    <section ref={elementRef} className="py-16 md:py-20 bg-brand-gradient-soft relative overflow-hidden">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float animation-delay-0"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-accent/5 rounded-full animate-drift animation-delay-500"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/5 rounded-full animate-pulse animation-delay-1000"></div>
      </div>
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="typography-h1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-slate-900 dark:text-white mb-6 md:mb-8">
            La Tua Guida Intelligente
          </h2>
          <p className="typography-subtitle text-lg sm:text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto text-slate-700 dark:text-slate-300 px-4">
            Un compagno di viaggio intelligente che ti offre accesso privilegiato alle autentiche meraviglie della Romagna, 
            con tecnologie avanzate e il supporto di esperti locali per un'esperienza indimenticabile
          </p>
        </div>

        {/* Features with Alternating Layout */}
        <div className="space-y-20 md:space-y-32">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className={`flex flex-col lg:flex-row items-center gap-8 md:gap-12 lg:gap-20 transition-all duration-1000 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
              }`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              {/* Content Section */}
              <div className={`flex-1 ${feature.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className={`max-w-xl mx-auto lg:mx-0 ${feature.imagePosition === 'right' ? 'text-center lg:text-right' : 'text-center lg:text-left'} px-4 lg:px-0`}>
                  <h3 className="typography-h2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-slate-900 dark:text-white mb-6 md:mb-8">
                    {feature.title}
                  </h3>
                  <p className="typography-subtitle text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Image Section */}
              <div className={`flex-1 ${feature.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative group max-w-lg mx-auto perspective-1000">
                  {/* 3D Relief Shadow Layer */}
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-200/60 to-slate-400/40 rounded-3xl transform translate-x-2 translate-y-2 blur-sm"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-slate-300/40 to-slate-100/60 rounded-3xl transform translate-x-1 translate-y-1"></div>
                  
                  {/* Main Image Container */}
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10 transform transition-all duration-700 hover:scale-105 hover:rotate-1 hover:shadow-3xl group-hover:translate-y-2">
                    <img
                      src={`https://images.unsplash.com/${feature.imagePlaceholder}?auto=format&fit=crop&w=700&h=525&q=85`}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                      loading="lazy"
                    />
                    
                    {/* Image Overlay Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/10 opacity-60 group-hover:opacity-30 transition-opacity duration-500"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Animated Decorative Elements */}
                  <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-accent to-accent/80 rounded-full opacity-80 animate-bounce animation-delay-300 shadow-lg"></div>
                  <div className="absolute -bottom-6 -left-6 w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full opacity-70 animate-pulse animation-delay-600 shadow-lg"></div>
                  <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gradient-to-br from-secondary to-secondary/80 rounded-full opacity-60 animate-ping animation-delay-1000"></div>
                  
                  {/* Floating Particles */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-4 left-4 w-2 h-2 bg-white/60 rounded-full animate-twinkle animation-delay-0"></div>
                    <div className="absolute bottom-6 right-8 w-1.5 h-1.5 bg-white/50 rounded-full animate-twinkle animation-delay-500"></div>
                    <div className="absolute top-1/3 right-4 w-1 h-1 bg-white/40 rounded-full animate-twinkle animation-delay-1000"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AppFeaturesSection;
