
import React from 'react';
import { Card } from '@/components/ui/card';

const AgeGroupsSection = () => {
  const ageGroups = [
    {
      age: "0-3 anni",
      activities: "Attività sensoriali, mini-laboratori, spazi gioco sicuri",
      icon: "👶"
    },
    {
      age: "4-8 anni",
      activities: "Laboratori creativi, giochi didattici, mini-avventure",
      icon: "🧒"
    },
    {
      age: "9-14 anni",
      activities: "Esperienze interattive, sport, tecnologia educativa",
      icon: "👦"
    },
    {
      age: "Adulti",
      activities: "Relax, cultura, enogastronomia, benessere",
      icon: "👨‍👩‍👧‍👦"
    }
  ];

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center text-slate-900 mb-8">
        Attività per Ogni Età
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {ageGroups.map((group, index) => (
          <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="text-4xl mb-4">{group.icon}</div>
            <h3 className="font-bold text-slate-900 mb-3">{group.age}</h3>
            <p className="text-slate-600 text-sm">{group.activities}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AgeGroupsSection;
