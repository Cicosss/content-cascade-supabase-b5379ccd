
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 max-w-4xl mx-auto">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center justify-center space-x-3 text-slate-200 bg-brand-blue-900/40 backdrop-blur-md rounded-2xl p-4 lg:p-6 border border-brand-yellow-400/30 shadow-2xl hover:bg-brand-blue-900/50 transition-all duration-300 hover:scale-105">
          <div className={`w-3 h-3 lg:w-4 lg:h-4 ${feature.color} rounded-full animate-pulse shadow-lg`}></div>
          <span className="text-sm lg:text-base font-medium text-white leading-tight">
            {feature.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default HeroFeatures;
