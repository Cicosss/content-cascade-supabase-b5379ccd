
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const HelpBanner: React.FC = () => {
  return (
    <Card className="p-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-3xl border-0 shadow-xl">
      <div className="flex items-center mb-4">
        <HelpCircle className="h-8 w-8 mr-3" />
        <h3 className="text-2xl font-bold">Hai bisogno d'aiuto?</h3>
      </div>
      <p className="text-green-100 mb-6 text-lg">
        Il nostro team di esperti locali è sempre disponibile per consigli personalizzati
      </p>
      <Button className="bg-white text-green-600 hover:bg-green-50 font-semibold px-8 py-3 rounded-xl">
        Contatta un Esperto
      </Button>
    </Card>
  );
};

export default HelpBanner;
