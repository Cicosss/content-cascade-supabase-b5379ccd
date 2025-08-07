
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
    <section className="relative">
      <div className="flex items-center justify-center mb-8 lg:mb-12">
        <div className="relative">
          <div className="flex items-center bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-yellow-400/30">
            <Zap className="h-8 w-8 lg:h-10 lg:w-10 text-yellow-600 mr-4 animate-pulse" />
            <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight tracking-tight">
              Offerte Lampo
            </h2>
          </div>
          <div className="absolute -top-1 -right-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold animate-bounce">
            Solo Oggi!
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {offers.map((offer, index) => (
          <Card 
            key={offer.id} 
            className="relative overflow-hidden shadow-2xl bg-gradient-to-br from-white/95 to-yellow-50/90 backdrop-blur-sm border border-yellow-200/50 rounded-3xl hover:scale-102 transition-all duration-300 transform will-change-transform"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* 3D Relief Shadow Layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 to-orange-300/20 rounded-3xl transform translate-x-1 translate-y-1 blur-sm -z-10"></div>
            
            {/* Gradient bar */}
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-t-3xl"></div>
            
            {/* Timer badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-2xl text-sm font-bold flex items-center shadow-lg animate-pulse">
              <Timer className="h-4 w-4 mr-2" />
              Fino alle {offer.validUntil}
            </div>
            
            <CardHeader className="p-6 lg:p-8 text-center">
              <div className="text-5xl lg:text-6xl mb-4 animate-bounce">{offer.image}</div>
              <CardTitle className="font-playfair text-xl lg:text-2xl font-bold text-slate-800 leading-tight mb-2">
                {offer.title}
              </CardTitle>
              <p className="font-lora text-base lg:text-lg text-slate-600 font-medium">{offer.partner}</p>
            </CardHeader>
            
            <CardContent className="p-6 lg:p-8 pt-0">
              <p className="font-lora text-sm lg:text-base text-slate-700 mb-6 leading-relaxed">{offer.description}</p>
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-playfair text-2xl lg:text-3xl font-bold text-green-600">
                    {offer.discountedPrice}
                  </span>
                  <span className="font-lora text-base lg:text-lg text-slate-500 line-through">
                    {offer.originalPrice}
                  </span>
                </div>
              </div>
              
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold font-inter py-3 lg:py-4 text-base lg:text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                🔥 Approfittane Ora
              </Button>
            </CardContent>
            
            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-8 left-8 w-1.5 h-1.5 bg-yellow-400/60 rounded-full animate-twinkle animation-delay-0"></div>
              <div className="absolute bottom-12 right-12 w-1 h-1 bg-orange-400/60 rounded-full animate-twinkle animation-delay-500"></div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default FlashOffersSection;
