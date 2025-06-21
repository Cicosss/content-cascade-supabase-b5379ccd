
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Euro, MapPin, Utensils } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

interface RestaurantCardProps {
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  location: string;
  image: string;
  specialty: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  name,
  cuisine,
  rating,
  priceRange,
  location,
  image,
  specialty
}) => {
  const itemId = `${name}-${location}`.toLowerCase().replace(/\s+/g, '-');
  const itemData = {
    name,
    cuisine,
    rating,
    priceRange,
    location,
    image,
    specialty
  };

  return (
    <Card className="overflow-hidden cursor-pointer group relative animate-fade-in">
      <div className="aspect-[4/3] relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
          <span className="text-white text-sm">{image}</span>
        </div>
        
        {/* Badge distintivo per ristoranti */}
        <Badge className="absolute top-3 left-3 bg-orange-600 text-white rounded-xl flex items-center gap-1">
          <Utensils className="h-3 w-3" />
          Ristorante
        </Badge>
        
        <Badge className="absolute top-3 right-12 bg-white/90 text-gray-900 rounded-xl">
          {cuisine}
        </Badge>
        
        <FavoriteButton 
          itemType="restaurant"
          itemId={itemId}
          itemData={itemData}
          className="absolute top-3 right-3 z-10 opacity-70 group-hover:opacity-100 transition-opacity"
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" strokeWidth={1.5} />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Euro className="h-4 w-4 mr-1" strokeWidth={1.5} />
            {priceRange}
          </div>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">
          Specialità: {specialty}
        </p>
        
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1" strokeWidth={1.5} />
          {location}
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
