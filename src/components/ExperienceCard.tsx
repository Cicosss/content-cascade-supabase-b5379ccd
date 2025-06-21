
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Euro, Calendar } from 'lucide-react';
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
    e.stopPropagation(); // Prevent card click when clicking favorite button
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

  return (
    <Card 
      className="overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer relative group"
      onClick={handleCardClick}
    >
      <div onClick={handleFavoriteClick}>
        <FavoriteButton
          itemId={id}
          itemType="poi"
          className="absolute top-3 right-3 z-10 opacity-70 group-hover:opacity-100 transition-opacity"
        />
      </div>
      
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {coverImage ? (
          <img
            src={coverImage}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <span className="text-4xl opacity-50">
              {isEvent ? '🗓️' : '📍'}
            </span>
          </div>
        )}
        
        {/* Badge distintivo per tipo POI */}
        <div className="absolute top-3 left-3">
          {isEvent && start_datetime ? (
            <Badge className="bg-green-600 text-white flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(start_datetime)}
            </Badge>
          ) : (
            <Badge className="bg-blue-600 text-white flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              Luogo
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
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
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {location_name || address}
              </span>
            </div>
          )}

          {/* Mostra orari per eventi o apertura per luoghi */}
          {isEvent && start_datetime && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>
                {formatTime(start_datetime)}
                {end_datetime && ` - ${formatTime(end_datetime)}`}
              </span>
            </div>
          )}

          {!isEvent && opening_hours && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{opening_hours}</span>
            </div>
          )}

          {displayDuration && (
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
              <span>{displayDuration}</span>
            </div>
          )}

          {groupSize && (
            <div className="flex items-center text-sm text-gray-600">
              <span>{groupSize}</span>
            </div>
          )}
        </div>

        {displayPrice && (
          <div className="flex items-center text-green-600 font-semibold">
            <Euro className="h-4 w-4 mr-1" />
            <span>{displayPrice}</span>
          </div>
        )}

        {rating && (
          <div className="flex items-center mt-2">
            <span className="text-yellow-500">★</span>
            <span className="text-sm text-gray-600 ml-1">{rating}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
