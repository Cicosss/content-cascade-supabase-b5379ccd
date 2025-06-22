
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star, Euro, MapPin, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

interface RestaurantCardProps {
  id?: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  location: string;
  image: string;
  specialty: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  cuisine,
  rating,
  priceRange,
  location,
  image,
  specialty
}) => {
  const navigate = useNavigate();
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

  const handleCardClick = () => {
    if (id) {
      navigate(`/poi/${id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group overflow-hidden"
      onClick={id ? handleCardClick : undefined}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <Utensils className="h-8 w-8" />
          </div>
        )}
        
        <div onClick={handleFavoriteClick}>
          <FavoriteButton 
            itemType="restaurant"
            itemId={itemId}
            itemData={itemData}
            className="absolute top-3 right-3 z-10 opacity-70 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Utensils className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{cuisine}</span>
        </div>
        
        <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">
          Specialità: {specialty}
        </p>
        
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-2 text-gray-400" />
          {location}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <div className="flex items-center text-green-600 font-medium">
            <Euro className="h-4 w-4 mr-1" />
            {priceRange}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
