
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Clock, Euro, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

interface ExperienceCardProps {
  id: string;
  name: string;
  title?: string;
  description?: string;
  category: string;
  price_info?: string;
  price?: string;
  duration_info?: string;
  duration?: string;
  images?: string[];
  image?: string;
  address?: string;
  location_name?: string;
  poi_type?: 'place' | 'event';
  start_datetime?: string;
  end_datetime?: string;
  opening_hours?: string;
  rating?: number;
  groupSize?: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  id,
  name,
  title,
  description,
  category,
  price_info,
  price,
  duration_info,
  duration,
  images,
  image,
  address,
  location_name,
  poi_type = 'place',
  start_datetime,
  end_datetime,
  opening_hours,
  rating,
  groupSize
}) => {
  const navigate = useNavigate();
  const displayName = name || title || '';
  const displayPrice = price_info || price || '';
  const displayDuration = duration_info || duration || '';
  const coverImage = (images && images.length > 0) ? images[0] : image || null;
  const isEvent = poi_type === 'event';

  const handleCardClick = () => {
    navigate(`/poi/${id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCategoryIcon = () => {
    if (isEvent) return <Calendar className="h-4 w-4" />;
    return <MapPin className="h-4 w-4" />;
  };

  return (
    <Card 
      className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer group overflow-hidden"
      onClick={handleCardClick}
    >
      <div onClick={handleFavoriteClick}>
        <FavoriteButton
          itemId={id}
          itemType="poi"
          className="absolute top-3 right-3 z-10 opacity-70 group-hover:opacity-100 transition-opacity"
        />
      </div>
      
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
        {coverImage ? (
          <img
            src={coverImage}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            {getCategoryIcon()}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-500 text-sm">
            {getCategoryIcon()}
          </span>
          <span className="text-sm text-gray-600">{category}</span>
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
          {displayName}
        </h3>

        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {description}
          </p>
        )}

        <div className="space-y-2 mb-3">
          {(address || location_name) && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
              <span className="truncate">
                {location_name || address}
              </span>
            </div>
          )}

          {isEvent && start_datetime && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
              <span>
                {formatTime(start_datetime)}
                {end_datetime && ` - ${formatTime(end_datetime)}`}
              </span>
            </div>
          )}

          {!isEvent && opening_hours && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
              <span className="truncate">{opening_hours}</span>
            </div>
          )}

          {displayDuration && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
              <span>{displayDuration}</span>
            </div>
          )}

          {groupSize && (
            <div className="flex items-center text-sm text-gray-600">
              <User className="h-4 w-4 mr-2 flex-shrink-0 text-gray-400" />
              <span>{groupSize}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          {displayPrice && (
            <div className="flex items-center text-green-600 font-medium">
              <Euro className="h-4 w-4 mr-1" />
              <span>{displayPrice}</span>
            </div>
          )}

          {rating && (
            <div className="flex items-center">
              <span className="text-yellow-500 text-sm">★</span>
              <span className="text-sm text-gray-600 ml-1">{rating}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
