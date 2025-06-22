
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star, Euro, MapPin } from 'lucide-react';
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
      className={`overflow-hidden group relative animate-fade-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white shadow-md border border-gray-100 ${id ? 'cursor-pointer' : ''}`}
      onClick={id ? handleCardClick : undefined}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
        {image && !image.includes('gradient') ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-4xl opacity-30 text-gray-400">🍽️</span>
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
          <span className="text-sm">🍽️</span>
          <span className="text-sm text-gray-600 font-medium">{cuisine}</span>
        </div>

        <h3 className="font-semibold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        
        <p className="text-sm text-gray-600 mb-3">
          Specialità: {specialty}
        </p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" strokeWidth={1.5} />
            <span className="text-sm font-medium">{rating}</span>
          </div>
          <div className="flex items-center text-sm text-green-600 font-semibold">
            <Euro className="h-4 w-4 mr-1" strokeWidth={1.5} />
            {priceRange}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-1" strokeWidth={1.5} />
          <span className="truncate">{location}</span>
        </div>
      </div>
    </Card>
  );
};

export default RestaurantCard;
