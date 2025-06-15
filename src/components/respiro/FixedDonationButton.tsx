
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const FixedDonationButton = () => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <Button 
        size="lg" 
        className="bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-200 px-8 py-4 text-base font-medium rounded-xl backdrop-blur-sm"
      >
        <Heart className="h-4 w-4 mr-3 text-red-500" />
        Fai una donazione
      </Button>
    </div>
  );
};

export default FixedDonationButton;
