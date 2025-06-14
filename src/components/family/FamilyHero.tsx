
import React from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FamilyHero = () => {
  return (
    <div className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            👨‍👩‍👧‍👦 Sezione Family
          </h1>
          <p className="text-2xl md:text-3xl mb-6 font-light">
            Avventure autentiche pensate per tutta la famiglia
          </p>
          <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed mb-8">
            Scopri la Romagna attraverso esperienze educative e divertenti che coinvolgono 
            grandi e piccini, creando ricordi indimenticabili nel rispetto delle tradizioni locali
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-lg">
            <div className="bg-white/20 px-4 py-2 rounded-full">✅ Attività certificate</div>
            <div className="bg-white/20 px-4 py-2 rounded-full">✅ Guide specializzate</div>
            <div className="bg-white/20 px-4 py-2 rounded-full">✅ Prezzi family-friendly</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyHero;
