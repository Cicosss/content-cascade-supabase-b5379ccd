
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import { Skeleton } from '@/components/ui/skeleton';

interface EventCardProps {
  id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  time,
  location,
  category,
  image
}) => {
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const itemId = `${title}-${date}`.toLowerCase().replace(/\s+/g, '-');
  const itemData = {
    title,
    date,
    time,
    location,
    category,
    image
  };

  const handleCardClick = () => {
    if (id) {
      navigate(`/poi/${id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
    setImageError(true);
  };

  return (
    <Card 
      className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group overflow-hidden"
      onClick={id ? handleCardClick : undefined}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
        {imageLoading && (
          <Skeleton className="w-full h-full absolute inset-0" />
        )}
        
        {image && !imageError ? (
          <img
            src={image}
            alt={title}
            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          !imageLoading && (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <Calendar className="h-12 w-12 text-gray-300" />
            </div>
          )
        )}
        
        <div onClick={handleFavoriteClick}>
          <FavoriteButton 
            itemType="event"
            itemId={itemId}
            itemData={itemData}
            className="absolute top-3 right-3 z-10"
            size="md"
          />
        </div>
      </div>
      
      <div className="p-4 bg-white">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{category}</span>
        </div>

        <h3 className="font-bold text-lg mb-3 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-400" />
            <span>{time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
