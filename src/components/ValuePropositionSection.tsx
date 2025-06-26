
import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, ChefHat, Camera } from 'lucide-react';

const ValuePropositionSection = () => {
  const propositions = [
    {
      icon: MapPin,
      title: "Scopri Gemme Nascoste",
      description: "Accedi a luoghi autentici e suggestivi lontani dalle rotte del turismo di massa. La nostra rete di guide locali ti conduce verso tesori nascosti che solo i romagnoli conoscono davvero."
    },
    {
      icon: ChefHat,
      title: "Assapora la Tradizione",
      description: "Degusta la vera cucina romagnola in trattorie familiari e aziende agricole certificate. Ogni piatto racconta una storia di tradizione culinaria tramandata di generazione in generazione."
    },
    {
      icon: Camera,
      title: "Crea Ricordi Unici",
      description: "Vivi esperienze personalizzate e autentiche che si adattano ai tuoi interessi. Ogni momento diventa un ricordo prezioso da conservare e condividere con chi ami."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-brand-blue-50 text-brand-blue-700 px-6 py-3 rounded-full typography-body-small font-semibold mb-8">
            <span>✨</span>
            <span>La Differenza Mia Romagna</span>
          </div>
          <h2 className="typography-h2 typography-brand-primary mb-6">
            3 Modi per Vivere la Romagna Autentica
          </h2>
          <p className="typography-body-large max-w-3xl mx-auto text-slate-600">
            Non siamo solo un'app di viaggio. Siamo il tuo passaporto per scoprire 
            l'anima autentica della Romagna attraverso esperienze uniche e genuine.
          </p>
        </div>

        {/* Value Propositions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {propositions.map((prop, index) => (
            <Card key={index} className="group p-8 text-center hover:shadow-2xl transition-all duration-500 border-0 shadow-lg hover:scale-105 transform bg-white">
              <div className="space-y-6">
                {/* Icon */}
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-brand-blue-600 to-brand-blue-800 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <prop.icon className="h-10 w-10 text-white stroke-1" />
                </div>
                
                {/* Content */}
                <div className="space-y-4">
                  <h3 className="typography-h4 typography-brand-primary group-hover:text-brand-blue-700 transition-colors">
                    {prop.title}
                  </h3>
                  <p className="typography-body leading-relaxed text-slate-600">
                    {prop.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-brand-yellow-600">
            <span className="w-2 h-2 bg-brand-yellow-400 rounded-full animate-pulse"></span>
            <span className="typography-body-small font-medium">
              Inizia il tuo viaggio autentico oggi stesso
            </span>
            <span className="w-2 h-2 bg-brand-yellow-400 rounded-full animate-pulse"></span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
