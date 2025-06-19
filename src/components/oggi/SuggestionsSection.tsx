
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
    <section>
      <div className="flex items-center mb-6">
        <Lightbulb className="h-8 w-8 text-purple-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-900">Suggerito per Te, Oggi</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="overflow-hidden relative">
            <Badge className="absolute top-3 left-3 z-10 bg-purple-600 text-white">
              Consigliato per te
            </Badge>
            
            <div className="aspect-[4/3] bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <span className="text-white text-4xl">{suggestion.image}</span>
            </div>
            
            <CardContent className="p-4">
              <Badge className="mb-2" variant="outline">{suggestion.category}</Badge>
              <h3 className="font-semibold text-gray-900 mb-2">
                {suggestion.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {suggestion.description}
              </p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center text-sm">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span>{suggestion.rating}</span>
                </div>
                <span className="text-xs text-purple-600 font-medium">
                  {suggestion.reason}
                </span>
              </div>
              <Button className="w-full">
                Scopri di più
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default SuggestionsSection;
