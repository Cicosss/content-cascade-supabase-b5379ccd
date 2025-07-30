
import React from 'react';
import { Card } from '@/components/ui/card';
import { Star, Euro, MapPin, Utensils } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import TouchTarget from '@/components/ui/TouchTarget';
import LazyImage from '@/components/ui/LazyImage';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface RestaurantCardProps {
  id?: string;
  name: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  location_name: string;
  image: string;
  specialty: string;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  id,
  name,
  cuisine,
  rating,
  priceRange,
  location_name,
  image,
  specialty
}) => {
  const navigate = useNavigate();
  const { isMobile, getContainerPadding, getMobileTypography } = useMobileOptimization();
  const itemId = `${name}-${location_name}`.toLowerCase().replace(/\s+/g, '-');
  const itemData = {
    name,
    cuisine,
    rating,
    priceRange,
    location_name,
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
    <TouchTarget 
      variant="card"
      asChild
      onClick={id ? handleCardClick : undefined}
      className="block w-full"
    >
      <Card className="bg-white border border-gray-200 mobile-shadow hover:shadow-md transition-shadow duration-300 group overflow-hidden">
        <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
          {image ? (
            <LazyImage
              src={image}
              alt={name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-300">
              <Utensils className={isMobile ? "h-6 w-6" : "h-8 w-8"} />
            </div>
          )}
          
          <div onClick={handleFavoriteClick}>
            <FavoriteButton 
              itemType="restaurant"
              itemId={itemId}
              itemData={itemData}
              className={`absolute ${isMobile ? 'top-2 right-2' : 'top-3 right-3'} z-10 opacity-70 group-hover:opacity-100 transition-opacity`}
            />
          </div>
        </div>
        
        <div className={getContainerPadding()}>
          <div className="flex items-center gap-2 mb-2">
            <Utensils className="h-4 w-4 text-gray-500" />
            <span className={`${getMobileTypography('text-sm')} text-gray-600`}>{cuisine}</span>
          </div>
          
          <h3 className={`font-semibold ${getMobileTypography('text-lg')} mb-2 text-gray-900 group-hover:text-blue-600 transition-colors truncate-mobile-2`}>
            {name}
          </h3>
          
          <p className={`${getMobileTypography('text-sm')} text-gray-600 mb-3 truncate-mobile-1`}>
            Specialità: {specialty}
          </p>
          
          <div className={`flex items-center ${getMobileTypography('text-sm')} text-gray-600 mb-3`}>
            <MapPin className="h-4 w-4 mr-2 text-gray-400 flex-shrink-0" />
            <span className="truncate">{location_name}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span className={`${getMobileTypography('text-sm')} font-medium`}>{rating}</span>
            </div>
            <div className={`flex items-center text-green-600 font-medium ${getMobileTypography('text-sm')}`}>
              <Euro className="h-4 w-4 mr-1" />
              {priceRange}
            </div>
          </div>
        </div>
      </Card>
    </TouchTarget>
  );
};

export default RestaurantCard;
