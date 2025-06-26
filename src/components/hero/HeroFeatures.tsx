
import React from 'react';

const HeroFeatures = () => {
  const features = [
    {
      color: 'bg-brand-yellow-400',
      text: 'Supporto 6 lingue complete'
    },
    {
      color: 'bg-brand-blue-400',
      text: 'GPS integrato e mappe offline'
    },
    {
      color: 'bg-brand-yellow-500',
      text: 'Guide locali certificate'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-base mb-12">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center justify-center space-x-3 text-slate-200 bg-brand-blue-900/30 backdrop-blur-md rounded-2xl p-4 border border-brand-yellow-400/20 shadow-xl">
          <div className={`w-3 h-3 ${feature.color} rounded-full animate-pulse shadow-lg`}></div>
          <span className="typography-body-small font-medium drop-shadow-lg text-white">{feature.text}</span>
        </div>
      ))}
    </div>
  );
};

export default HeroFeatures;
