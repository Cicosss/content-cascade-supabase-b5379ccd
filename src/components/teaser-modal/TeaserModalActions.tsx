
import React from 'react';
import { Button } from '@/components/ui/button';
import { TeaserContent } from './TeaserModalContent';

interface TeaserModalActionsProps {
  content: TeaserContent;
  variant: 'offers' | 'passport' | 'weather';
  onSignup: () => void;
  onLogin: () => void;
}

const TeaserModalActions: React.FC<TeaserModalActionsProps> = ({ 
  content, 
  variant, 
  onSignup, 
  onLogin 
}) => {
  const IconComponent = content.icon;

  return (
    <div className="space-y-4">
      <Button 
        onClick={onSignup}
        className={`w-full text-lg py-6 font-semibold ${
          variant === 'weather'
            ? 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
            : variant === 'passport' 
            ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700'
            : 'auth-button-secondary'
        }`}
      >
        <IconComponent className="h-5 w-5 mr-2" />
        {content.ctaText}
      </Button>
      
      <div className="text-center">
        <span className="text-sm text-slate-600">Hai già un account? </span>
        <Button 
          variant="link" 
          onClick={onLogin}
          className="text-blue-600 hover:text-blue-800 p-0 h-auto text-sm font-semibold"
        >
          Accedi qui
        </Button>
      </div>
    </div>
  );
};

export default TeaserModalActions;
