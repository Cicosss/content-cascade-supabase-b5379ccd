import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Bus, Ticket, Percent } from 'lucide-react';

const GuestCard = () => {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2 text-blue-500" strokeWidth={1.5} />
          <h3 className="typography-h3">Romagna Guest Card</h3>
        </div>
        <Button variant="default" size="sm" className="rounded-xl bg-blue-500 hover:bg-blue-600">
          Attiva
        </Button>
      </div>
      
      <p className="typography-body text-gray-600 mb-4">
        Scopri tutti i vantaggi della tua card ospite
      </p>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Bus className="h-8 w-8 mx-auto mb-2 text-blue-500" strokeWidth={1.5} />
          <div className="typography-caption text-gray-500">Trasporti</div>
        </div>
        <div className="text-center">
          <Ticket className="h-8 w-8 mx-auto mb-2 text-blue-500" strokeWidth={1.5} />
          <div className="typography-caption text-gray-500">Musei</div>
        </div>
        <div className="text-center">
          <Percent className="h-8 w-8 mx-auto mb-2 text-blue-500" strokeWidth={1.5} />
          <div className="typography-caption text-gray-500">Sconti</div>
        </div>
      </div>
    </Card>
  );
};

export default GuestCard;
