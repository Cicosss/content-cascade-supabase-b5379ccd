
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Lightbulb, Star } from 'lucide-react';

interface Suggestion {
  id: number;
  title: string;
  category: string;
  description: string;
  reason: string;
  rating: number;
  image: string;
  type: string;
}

interface SuggestionsSectionProps {
  suggestions: Suggestion[];
}

const SuggestionsSection: React.FC<SuggestionsSectionProps> = ({ suggestions }) => {
  return (
    <section className="relative">
      <div className="flex items-center justify-center mb-8 lg:mb-12">
        <div className="flex items-center bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl px-6 py-4 border border-green-400/30">
          <Lightbulb className="h-8 w-8 lg:h-10 lg:w-10 text-green-600 mr-4 animate-pulse" />
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-800 leading-tight tracking-tight">
            Suggerito per Te, Oggi
          </h2>
        </div>
      </div>
      
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4 lg:-ml-6">
          {suggestions.map((suggestion, index) => (
            <CarouselItem key={suggestion.id} className="pl-4 lg:pl-6 md:basis-1/2 lg:basis-1/3">
              <Card className="relative overflow-hidden h-full bg-gradient-to-br from-green-50/95 to-emerald-50/90 backdrop-blur-sm border border-green-200/50 rounded-3xl shadow-2xl hover:scale-102 transition-all duration-300 transform will-change-transform">
                {/* 3D Relief Shadow Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-200/30 to-emerald-300/20 rounded-3xl transform translate-x-1 translate-y-1 blur-sm -z-10"></div>
                
                <Badge className="absolute top-4 left-4 z-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold text-sm px-4 py-2 rounded-xl shadow-lg animate-pulse">
                  Consigliato per te
                </Badge>
                
                <div className="aspect-[4/3] bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20"></div>
                  <span className="relative z-10 text-6xl lg:text-7xl animate-bounce">{suggestion.image}</span>
                  {/* Floating particles */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-green-500/40 rounded-full animate-twinkle"></div>
                  <div className="absolute bottom-6 left-6 w-1.5 h-1.5 bg-emerald-400/40 rounded-full animate-twinkle animation-delay-500"></div>
                </div>
                
                <CardContent className="p-6 lg:p-8">
                  <Badge className="mb-4 bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-300/50 font-medium text-sm px-3 py-1 rounded-xl">
                    {suggestion.category}
                  </Badge>
                  
                  <h3 className="font-playfair text-xl lg:text-2xl font-bold text-slate-800 mb-3 leading-tight">
                    {suggestion.title}
                  </h3>
                  
                  <p className="font-lora text-sm lg:text-base text-slate-700 mb-6 leading-relaxed">
                    {suggestion.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-2" />
                      <span className="font-playfair text-lg font-bold text-slate-800">{suggestion.rating}</span>
                    </div>
                    <span className="font-lora text-sm text-purple-600 font-medium bg-purple-100/80 px-3 py-1 rounded-xl">
                      {suggestion.reason}
                    </span>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold font-inter py-3 lg:py-4 text-base lg:text-lg rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                    ✨ Esplora Questo Consiglio
                  </Button>
                </CardContent>
                
                {/* Additional floating particles */}
                <div className="absolute bottom-4 right-4 w-1 h-1 bg-green-600/60 rounded-full animate-twinkle animation-delay-700"></div>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 bg-white/90 hover:bg-white border border-green-200/50 text-green-600 shadow-lg" />
        <CarouselNext className="right-4 bg-white/90 hover:bg-white border border-green-200/50 text-green-600 shadow-lg" />
      </Carousel>
    </section>
  );
};

export default SuggestionsSection;
