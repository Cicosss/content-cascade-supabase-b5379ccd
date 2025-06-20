
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Euro, Calendar } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

interface ExperienceCardProps {
  id: string;
  name: string;
  title?: string; // Compatibility with legacy usage
  description?: string;
  category: string;
  price_info?: string;
  price?: string; // Compatibility with legacy usage
  duration_info?: string;
  duration?: string; // Compatibility with legacy usage
  images?: string[];
  image?: string; // Compatibility with legacy usage
  address?: string;
  location_name?: string;
  poi_type?: 'place' | 'event';
  start_datetime?: string;
  end_datetime?: string;
  opening_hours?: string;
  rating?: number; // Compatibility with legacy usage
  groupSize?: string; // Compatibility with legacy usage
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
  // Handle legacy props compatibility
  const displayName = name || title || '';
  const displayPrice = price_info || price || '';
  const displayDuration = duration_info || duration || '';
  const coverImage = (images && images.length > 0) ? images[0] : image || null;
  const isEvent = poi_type === 'event';

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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow relative group">
      <FavoriteButton
        itemId={id}
        itemType="poi"
        className="absolute top-3 right-3 z-10 opacity-70 group-hover:opacity-100 transition-opacity"
      />
      
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {coverImage ? (
          <img
            src={coverImage}
            alt={displayName}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <span className="text-4xl opacity-50">
              {isEvent ? '🗓️' : '📍'}
            </span>
          </div>
        )}
        
        {/* Badge distintivo */}
        {isEvent && start_datetime && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-green-600 text-white flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(start_datetime)}
            </Badge>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          {!isEvent && (
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <MapPin className="h-2 w-2" />
              Luogo
            </Badge>
          )}
        </div>

        <h3 className="font-semibold text-lg mb-2 line-clamp-2 text-gray-900">
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
