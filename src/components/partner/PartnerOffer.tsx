import React from 'react';
import { Button } from '@/components/ui/button';
const PartnerOffer = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <section className="py-20 bg-slate-900 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-8">
          Offerta Esclusiva di Pre-Lancio
        </h2>
        <p className="text-xl md:text-2xl max-w-4xl mx-auto mb-12 leading-relaxed">
          Per celebrare il nostro lancio, offriamo alle prime 50 attività partner un'adesione con il{' '}
          <span className="text-yellow-400 font-bold">50% di sconto per i primi due anni</span>.{' '}
          Un'opportunità unica per garantirti una visibilità senza precedenti.
        </p>
        <Button onClick={() => scrollToSection('contatti')} className="bg-gradient-to-r from-orange-400 to-yellow-400 hover:from-orange-500 hover:to-yellow-500 text-slate-900 text-xl px-12 py-4 h-auto rounded-xl shadow-2xl hover:shadow-3xl transition-all duration-300 font-bold">Richiedi lo Sconto 50%</Button>
      </div>
    </section>;
};
export default PartnerOffer;