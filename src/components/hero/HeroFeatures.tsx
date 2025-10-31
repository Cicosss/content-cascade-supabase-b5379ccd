
import React from 'react';

const HeroFeatures = () => {
  const features = [
    {
      color: 'bg-brand-yellow',
      text: 'Supporto 6 lingue complete'
    },
    {
      color: 'bg-brand-blue',
      text: 'GPS integrato e mappe offline'
    },
    {
      color: 'bg-brand-yellow',
      text: 'Guide locali certificate'
    }
  ];

  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-4 lg:gap-6 max-w-5xl mx-auto">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center justify-center space-x-3 text-foreground bg-brand-blue/40 backdrop-blur-md rounded-2xl p-4 lg:p-6 border border-brand-yellow/30 shadow-2xl hover:bg-brand-blue/50 transition-all duration-300 hover:scale-105 min-w-[280px]">
          <div className={`w-3 h-3 lg:w-4 lg:h-4 ${feature.color} rounded-full animate-pulse shadow-lg`}></div>
          <span className="typography-small text-sm lg:text-base font-medium text-primary-foreground text-center">
            {feature.text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default HeroFeatures;
