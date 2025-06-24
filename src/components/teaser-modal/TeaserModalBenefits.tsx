
import React from 'react';
import { TeaserBenefit } from './TeaserModalContent';

interface TeaserModalBenefitsProps {
  benefits: TeaserBenefit[];
  variant: 'offers' | 'passport' | 'weather';
}

const TeaserModalBenefits: React.FC<TeaserModalBenefitsProps> = ({ benefits, variant }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {benefits.map((benefit, index) => (
        <div key={index} className="text-center space-y-3">
          <div className={`${
            variant === 'weather'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-600'
              : variant === 'passport'
              ? 'bg-gradient-to-r from-amber-500 to-orange-600'
              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
          } w-12 h-12 rounded-full flex items-center justify-center mx-auto`}>
            <benefit.icon className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-semibold text-sm">{benefit.title}</h3>
          <p className="text-xs text-slate-600">{benefit.description}</p>
        </div>
      ))}
    </div>
  );
};

export default TeaserModalBenefits;
