
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Timer } from 'lucide-react';

interface FlashOffer {
  id: number;
  title: string;
  partner: string;
  description: string;
  originalPrice: string;
  discountedPrice: string;
  validUntil: string;
  image: string;
}

interface FlashOffersSectionProps {
  offers: FlashOffer[];
}

const FlashOffersSection: React.FC<FlashOffersSectionProps> = ({ offers }) => {
  return (
    <section>
      <div className="flex items-center mb-6">
        <Zap className="h-8 w-8 text-yellow-500 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Offerte Lampo (Valide solo Oggi!)</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <Card key={offer.id} className="relative overflow-hidden border-2 border-yellow-400 shadow-lg animate-pulse-border">
            <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
              <Timer className="h-3 w-3 mr-1" />
              Fino alle {offer.validUntil}
            </div>
            
            <CardHeader>
              <div className="text-4xl text-center mb-2">{offer.image}</div>
              <CardTitle className="text-lg">{offer.title}</CardTitle>
              <p className="text-sm text-gray-600">{offer.partner}</p>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-gray-700 mb-4">{offer.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-lg font-bold text-green-600">{offer.discountedPrice}</span>
                  <span className="text-sm text-gray-500 line-through ml-2">{offer.originalPrice}</span>
                </div>
              </div>
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                Scopri l'Offerta
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FlashOffersSection;
