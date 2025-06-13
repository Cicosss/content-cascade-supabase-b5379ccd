
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Bus, Ticket, Percent } from 'lucide-react';

const GuestCard = () => {
  return (
    <Card className="p-6 sunset-gradient text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <CreditCard className="h-6 w-6 mr-3" />
          <h3 className="text-lg font-semibold">Romagna Guest Card</h3>
        </div>
        <Button variant="secondary" size="sm" className="rounded-xl">
          Attiva
        </Button>
      </div>
      
      <p className="text-white/90 mb-4">
        Scopri tutti i vantaggi della tua card ospite
      </p>
      
      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <Bus className="h-8 w-8 mx-auto mb-2 text-white/80" />
          <div className="text-sm">Trasporti</div>
        </div>
        <div className="text-center">
          <Ticket className="h-8 w-8 mx-auto mb-2 text-white/80" />
          <div className="text-sm">Musei</div>
        </div>
        <div className="text-center">
          <Percent className="h-8 w-8 mx-auto mb-2 text-white/80" />
          <div className="text-sm">Sconti</div>
        </div>
      </div>
    </Card>
  );
};

export default GuestCard;
