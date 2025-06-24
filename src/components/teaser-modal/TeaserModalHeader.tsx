
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TeaserContent } from './TeaserModalContent';

interface TeaserModalHeaderProps {
  content: TeaserContent;
  variant: 'offers' | 'passport' | 'weather';
}

const TeaserModalHeader: React.FC<TeaserModalHeaderProps> = ({ content, variant }) => {
  const IconComponent = content.icon;

  return (
    <div className={`bg-gradient-to-r ${content.gradient} p-8 text-white`}>
      <DialogHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <IconComponent className={`h-16 w-16 ${
            variant === 'weather' ? 'text-cyan-300' : 
            variant === 'passport' ? 'text-amber-300' : 'text-yellow-400'
          } animate-pulse`} />
        </div>
        <DialogTitle className="text-3xl font-bold">
          {content.title}
        </DialogTitle>
        <p className="text-lg text-white/90 max-w-md mx-auto">
          {content.subtitle}
        </p>
      </DialogHeader>
    </div>
  );
};

export default TeaserModalHeader;
