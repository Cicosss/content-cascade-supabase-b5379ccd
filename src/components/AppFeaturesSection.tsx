
import React from 'react';
import { Smartphone } from 'lucide-react';

const AppFeaturesSection = () => {
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
    <section className="py-16 md:py-20 bg-brand-gradient-soft">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center space-x-2 bg-hsl(var(--primary)) text-white px-4 py-2 md:px-6 md:py-3 rounded-full text-sm font-semibold mb-6 md:mb-8 shadow-lg">
            <Smartphone className="h-4 w-4" />
            <span>Tecnologia All'Avanguardia</span>
          </div>
          <h2 className="typography-h2 typography-brand-primary mb-6 md:mb-8">La Tua Guida Intelligente</h2>
          <p className="typography-body-large max-w-3xl mx-auto text-muted-foreground">
            Un compagno di viaggio intelligente che ti offre accesso privilegiato alle autentiche meraviglie della Romagna, 
            con tecnologie avanzate e il supporto di esperti locali per un'esperienza indimenticabile
          </p>
        </div>

        {/* Features with Alternating Layout */}
        <div className="space-y-16 md:space-y-24">
          {features.map((feature, index) => (
            <div key={feature.id} className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              {/* Content Section */}
              <div className={`flex-1 ${feature.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
                  <h3 className="typography-h3 typography-brand-primary mb-4 md:mb-6">{feature.title}</h3>
                  <p className="typography-body leading-relaxed text-muted-foreground">{feature.description}</p>
                </div>
              </div>

              {/* Image Section */}
              <div className={`flex-1 ${feature.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative group max-w-lg mx-auto">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
                    <img
                      src={`https://images.unsplash.com/${feature.imagePlaceholder}?auto=format&fit=crop&w=600&h=450&q=80`}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-accent rounded-full opacity-80"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-primary rounded-full opacity-60"></div>
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
