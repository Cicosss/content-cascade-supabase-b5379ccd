import React from 'react';
import { useServiceVisibility } from '@/hooks/useServiceVisibility';
import LazyImage from '@/components/ui/LazyImage';

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
    <section ref={elementRef} className="py-16 md:py-20 bg-secondary relative overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 relative z-10">
        {/* Header Section */}
        <div className={`text-center mb-12 md:mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="typography-h1 text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-foreground mb-6 md:mb-8">
            La Tua Guida Intelligente
          </h2>
          <p className="typography-subtitle text-lg sm:text-xl md:text-2xl leading-relaxed max-w-4xl mx-auto text-muted-foreground px-4">
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
                  <h3 className="typography-h2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-6 md:mb-8">
                    {feature.title}
                  </h3>
                  <p className="typography-subtitle text-lg sm:text-xl md:text-2xl text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              </div>

              {/* Image Section - Optimized */}
              <div className={`flex-1 ${feature.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative group max-w-lg mx-auto">
                  {/* Main Image Container */}
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10 transform transition-all duration-700 hover:scale-105">
                    <LazyImage
                      src={`https://images.unsplash.com/${feature.imagePlaceholder}?auto=format&fit=crop&w=600&h=400&q=70`}
                      alt={feature.title}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    
                    {/* Image Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-primary-foreground/10 opacity-60 group-hover:opacity-30 transition-opacity duration-500"></div>
                  </div>
                  
                  {/* Decorative Element */}
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-full blur-2xl"></div>
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
