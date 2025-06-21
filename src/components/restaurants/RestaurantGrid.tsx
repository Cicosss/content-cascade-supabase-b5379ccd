
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Phone, Globe } from 'lucide-react';
import { Restaurant } from '@/types/restaurant';

interface RestaurantGridProps {
  restaurants: Restaurant[];
  loading: boolean;
}

const RestaurantGrid: React.FC<RestaurantGridProps> = ({ restaurants, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="h-80 bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {restaurants.map((restaurant) => (
        <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
          <div className="aspect-[4/3] bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
            <span className="text-white text-sm">🍽️ {restaurant.category}</span>
          </div>
          <div className="p-4">
            {restaurant.category && (
              <Badge className="mb-2">{restaurant.category}</Badge>
            )}
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {restaurant.name}
            </h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {restaurant.description}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              {restaurant.avg_rating > 0 && (
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium">{restaurant.avg_rating}</span>
                </div>
              )}
              {restaurant.price_info && (
                <div className="text-sm font-medium text-green-600">
                  {restaurant.price_info}
                </div>
              )}
            </div>

            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {restaurant.address || 'Romagna'}
              </div>
              {restaurant.phone && (
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {restaurant.phone}
                </div>
              )}
              {restaurant.website_url && (
                <div className="flex items-center">
                  <Globe className="h-4 w-4 mr-2" />
                  <a href={restaurant.website_url} target="_blank" rel="noopener noreferrer" 
                     className="text-blue-600 hover:underline">
                    Visita sito
                  </a>
                </div>
              )}
            </div>

            {restaurant.tags && restaurant.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {restaurant.tags.slice(0, 3).map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default RestaurantGrid;
