
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

const FixedDonationButton = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button 
        size="lg" 
        className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 px-6 py-4 text-lg font-bold rounded-full"
      >
        <Heart className="h-5 w-5 mr-2" />
        FAI LA TUA DONAZIONE
      </Button>
    </div>
  );
};

export default FixedDonationButton;
