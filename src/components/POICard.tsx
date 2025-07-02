import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Euro, Clock, Users, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import FavoriteButton from './FavoriteButton';
import HtmlContent from '@/components/ui/html-content';

interface POICardProps {
  id: string;
  name: string;
  category: string;
  description?: string;
  images?: string[];
  avg_rating?: number;
  price_info?: string;
  duration_info?: string;
  target_audience?: string;
  address?: string;
  isLoading?: boolean;
  startDatetime?: string;
  endDatetime?: string;
  poiType?: string;
}

const POICard: React.FC<POICardProps> = ({
  id,
  name,
  category,
  description,
  images,
  avg_rating,
  price_info,
  duration_info,
  target_audience,
  address,
  isLoading = false,
  startDatetime,
  endDatetime,
  poiType
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <div className="relative">
          <Skeleton className="h-48 w-full" />
          <div className="absolute top-2 right-2">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-300 overflow-hidden group">
      {images && images.length > 0 ? (
        <div className="relative">
          <img
            src={images[0]}
            alt={name}
            className="w-full h-48 object-cover rounded-t-md"
          />
          <div className="absolute top-2 right-2">
            {avg_rating && (
              <Badge>
                <Star className="mr-1 h-4 w-4" />
                {avg_rating.toFixed(1)}
              </Badge>
            )}
          </div>
        </div>
      ) : (
        <div className="relative">
          <img
            src="/placeholder-image.jpg"
            alt="Placeholder"
            className="w-full h-48 object-cover rounded-t-md"
          />
          <div className="absolute top-2 right-2">
            {avg_rating && (
              <Badge>
                <Star className="mr-1 h-4 w-4" />
                {avg_rating.toFixed(1)}
              </Badge>
            )}
          </div>
        </div>
      )}

      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex-1 min-w-0 pr-2">
            <Link to={`/poi/${id}`} className="block">
              <h3 className="font-semibold text-base text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                {name}
              </h3>
            </Link>
            <Badge variant="secondary" className="mt-1 text-xs">
              {category}
            </Badge>
          </div>
          <FavoriteButton itemId={id} itemType="poi" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {description && (
          <HtmlContent 
            content={description} 
            className="text-sm text-gray-600 line-clamp-2"
          />
        )}

        <div className="flex flex-wrap gap-2 text-sm">
          {address && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span>{address}</span>
            </div>
          )}
          {price_info && (
            <div className="flex items-center gap-1">
              <Euro className="h-4 w-4 text-gray-500" />
              <span>{price_info}</span>
            </div>
          )}
          {duration_info && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{duration_info}</span>
            </div>
          )}
          {target_audience && target_audience !== 'everyone' && (
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-gray-500" />
              <span>{target_audience}</span>
            </div>
          )}
          {startDatetime && endDatetime && poiType === 'event' && (
            <>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span>{formatDate(startDatetime)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <span>{formatTime(startDatetime)} - {formatTime(endDatetime)}</span>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default POICard;
