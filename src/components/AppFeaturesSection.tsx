
import React from 'react';
import { Smartphone } from 'lucide-react';

const AppFeaturesSection = () => {
  const features = [
    {
      id: 1,
      title: "Esplora il Territorio come un Locale",
      description: "La nostra mappa interattiva ti svela non solo i luoghi famosi, ma anche le gemme nascoste. Filtra, cerca e scopri i consigli dei nostri esperti direttamente sulla mappa.",
      imagePosition: "left",
      imagePlaceholder: "photo-1461749280684-dccba630e2f6"
    },
    {
      id: 2,
      title: "Itinerari Creati su Misura per Te",
      description: "Dicci cosa ami e per quanto tempo resti. La nostra tecnologia AI creerà per te un itinerario unico, combinando i tuoi interessi in un'avventura indimenticabile.",
      imagePosition: "right",
      imagePlaceholder: "photo-1461749280684-dccba630e2f6"
    },
    {
      id: 3,
      title: "Non Perderti Nulla di Ciò che Accade",
      description: "Sagre, concerti, mostre. Ricevi notifiche e scopri gli eventi in corso vicino a te, aggiornati in tempo reale per vivere la Romagna al massimo.",
      imagePosition: "left",
      imagePlaceholder: "photo-1581090464777-f3220bbe1b8b"
    }
  ];

  return (
    <section className="py-20 bg-brand-gradient-soft">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-brand-blue-900 text-white px-6 py-3 rounded-full typography-body-small font-semibold mb-8 shadow-lg">
            <Smartphone className="h-4 w-4" />
            <span>Tecnologia All'Avanguardia</span>
          </div>
          <h2 className="typography-h1 typography-brand-primary mb-8">La Tua Guida Intelligente</h2>
          <p className="typography-story-intro max-w-4xl mx-auto">
            Un compagno di viaggio intelligente che ti offre accesso privilegiato alle autentiche meraviglie della Romagna, 
            con tecnologie avanzate e il supporto di esperti locali per un'esperienza indimenticabile
          </p>
        </div>

        {/* Features with Alternating Layout */}
        <div className="space-y-20">
          {features.map((feature, index) => (
            <div key={feature.id} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
              {/* Content Section */}
              <div className={`flex-1 ${feature.imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="max-w-xl">
                  <h3 className="typography-h3 typography-brand-primary mb-6">{feature.title}</h3>
                  <p className="typography-body leading-relaxed text-slate-700">{feature.description}</p>
                </div>
              </div>

              {/* Image Section */}
              <div className={`flex-1 ${feature.imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="relative group">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-brand-blue-100 to-brand-yellow-100">
                    <img
                      src={`https://images.unsplash.com/${feature.imagePlaceholder}?auto=format&fit=crop&w=600&h=400&q=80`}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  {/* Decorative Elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-brand-yellow-400 rounded-full opacity-80"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-brand-blue-500 rounded-full opacity-60"></div>
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
