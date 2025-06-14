
import React from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Star, Gift, Heart } from 'lucide-react';

const FamilyBenefitsSection = () => {
  const familyBenefits = [
    {
      icon: Shield,
      title: "Sicurezza Certificata",
      description: "Tutte le attività rispettano rigorosi standard di sicurezza per bambini",
      color: "green"
    },
    {
      icon: Star,
      title: "Guide Specializzate",
      description: "Educatori esperti nell'intrattenimento e formazione per famiglie",
      color: "blue"
    },
    {
      icon: Gift,
      title: "Prezzi Family-Friendly",
      description: "Tariffe speciali per famiglie numerose e sconti per più bambini",
      color: "purple"
    },
    {
      icon: Heart,
      title: "Educazione Divertente",
      description: "Impara giocando con le tradizioni e la cultura romagnola autentica",
      color: "orange"
    }
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
        Perché Scegliere la Sezione Family
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {familyBenefits.map((benefit, index) => (
          <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className={`w-16 h-16 mx-auto mb-4 bg-${benefit.color}-100 rounded-full flex items-center justify-center`}>
              <benefit.icon className={`h-8 w-8 text-${benefit.color}-600`} />
            </div>
            <h3 className="font-bold text-slate-900 mb-3">{benefit.title}</h3>
            <p className="text-slate-600 text-sm">{benefit.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FamilyBenefitsSection;
