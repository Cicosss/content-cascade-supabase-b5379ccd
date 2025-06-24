
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

const HelpBanner = () => {
  return (
    <Card className="p-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center mb-16">
      <MessageCircle className="h-12 w-12 mx-auto mb-4" />
      <h3 className="text-2xl font-semibold mb-4">Hai bisogno di aiuto?</h3>
      <p className="text-green-100 mb-6 text-lg leading-relaxed">
        I nostri esperti locali sono sempre disponibili per consigli personalizzati, 
        informazioni aggiornate e supporto durante la tua visita in Romagna.
      </p>
      <Button variant="secondary" className="px-8 py-3 text-lg font-semibold">
        Contattaci Subito
      </Button>
    </Card>
  );
};

export default HelpBanner;
