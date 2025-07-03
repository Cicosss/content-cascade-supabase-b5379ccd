
import React from 'react';
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
        {/* Header Section - Semplificato */}
        <div className="text-center mb-20">
          <h2 className="typography-h2 typography-brand-primary mb-8">
            3 Modi per Vivere la Romagna Autentica
          </h2>
          <p className="typography-body-large max-w-3xl mx-auto text-slate-600">
            Non siamo solo un'app di viaggio. Siamo il tuo passaporto per scoprire 
            l'anima autentica della Romagna attraverso esperienze uniche e genuine.
          </p>
        </div>

        {/* I Pilastri - Design Aperto ed Elegante */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {propositions.map((prop, index) => (
            <div 
              key={index} 
              className={`text-center px-8 ${
                index === 1 
                  ? 'md:border-l md:border-r md:border-slate-200' 
                  : index === 2 
                  ? 'md:border-l md:border-slate-200' 
                  : ''
              }`}
            >
              {/* Icona Outline Grande */}
              <div className="mb-8">
                <prop.icon className="h-12 w-12 mx-auto text-brand-yellow-400 stroke-1" />
              </div>
              
              {/* Titolo del Pilastro */}
              <h4 className="typography-h4 typography-brand-primary mb-6 font-bold">
                {prop.title}
              </h4>
              
              {/* Descrizione con Larghezza Limitata */}
              <p className="typography-body text-slate-600 leading-relaxed max-w-sm mx-auto">
                {prop.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom CTA - Manteniamo l'elemento esistente */}
        <div className="text-center mt-20">
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
