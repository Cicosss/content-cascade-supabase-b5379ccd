
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Euro, Clock, Users, Calendar, Eye, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import FavoriteButton from './FavoriteButton';

import { getCategoryIcon } from '@/utils/categoryIcons';


interface UnifiedPOICardProps {
  id: string;
  name: string;
  title?: string; // Per retrocompatibilità con ExperienceCard
  category: string;
  description?: string;
  images?: string[];
  image?: string; // Per retrocompatibilità con ExperienceCard
  avg_rating?: number;
  rating?: number; // Per retrocompatibilità con ExperienceCard
  price_info?: string;
  price?: string; // Per retrocompatibilità con ExperienceCard
  duration_info?: string;
  duration?: string; // Per retrocompatibilità con ExperienceCard
  target_audience?: string;
  address?: string;
  location_name?: string; // Per retrocompatibilità con ExperienceCard
  isLoading?: boolean;
  startDatetime?: string;
  endDatetime?: string;
  start_datetime?: string; // Per retrocompatibilità
  end_datetime?: string; // Per retrocompatibilità
  poiType?: string;
  poi_type?: string; // Per retrocompatibilità
  opening_hours?: string;
  groupSize?: string;
  website_url?: string;
  phone?: string;
  onClick?: () => void;
  className?: string;
}

const UnifiedPOICard: React.FC<UnifiedPOICardProps> = ({
  id,
  name,
  title,
  category,
  description,
  images,
  image,
  avg_rating,
  rating,
  price_info,
  price,
  duration_info,
  duration,
  target_audience,
  address,
  location_name,
  isLoading = false,
  startDatetime,
  endDatetime,
  start_datetime,
  end_datetime,
  poiType,
  poi_type,
  opening_hours,
  groupSize,
  website_url,
  phone,
  onClick,
  className = ""
}) => {
  // Normalizzazione dei dati per compatibilità
  const displayName = name || title || '';
  const displayRating = avg_rating || rating || 0;
  const displayLocation = location_name || address || '';
  const displayPoiType = poiType || poi_type || 'place';
  const displayStartDate = startDatetime || start_datetime;
  const displayEndDate = endDatetime || end_datetime;
  
  // Gestione immagini
  const coverImage = (images && images.length > 0) ? images[0] : image || null;
  
  // Tipo di POI
  const isEvent = displayPoiType === 'event';
  
  // Icona categoria dinamica
  const CategoryIcon = getCategoryIcon(category);
  
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

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (id) {
      window.location.href = `/poi/${id}`;
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (isLoading) {
    return (
      <Card className={`w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-300 overflow-hidden ${className}`}>
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
    <Card 
      className={`bg-white border border-gray-200 shadow-sm hover:shadow-md active:shadow-lg transition-shadow duration-300 cursor-pointer group overflow-hidden flex flex-col h-full poi-card-protected ${className}`}
      onClick={handleCardClick}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50 flex-shrink-0">
        {coverImage ? (
          <img
            src={coverImage}
            alt={displayName}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-blue-100 to-purple-100">
            <CategoryIcon className="h-8 w-8" />
          </div>
        )}
        
        {/* Category Badge */}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="text-xs font-medium bg-white/90 text-gray-700 backdrop-blur-sm">
            {category}
          </Badge>
        </div>

        {/* Rating Badge */}
        {displayRating > 0 && (
          <div className="absolute top-2 right-12">
            <Badge className="text-xs font-medium bg-primary text-white">
              <Star className="mr-1 h-3 w-3 fill-current" />
              {displayRating.toFixed(1)}
            </Badge>
          </div>
        )}

        {/* Favorite button */}
        <div onClick={handleFavoriteClick} className="absolute top-2 right-2">
          <FavoriteButton 
            itemType="poi"
            itemId={id}
            className="opacity-80 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col min-h-0">
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <CategoryIcon className="h-4 w-4 text-gray-500 flex-shrink-0" />
              <h3 className="typography-h4 font-semibold text-sm text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                {displayName}
              </h3>
            </div>
          </div>

          <div className="mb-3 min-h-10">
            {description && (
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {description
                  .replace(/<[^>]*>/g, '')
                  .replace(/&nbsp;/g, ' ')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&quot;/g, '"')
                  .replace(/&#39;/g, "'")
                  .trim()}
              </p>
            )}
          </div>

          <div className="space-y-2">
            {displayLocation && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{displayLocation}</span>
              </div>
            )}

          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UnifiedPOICard;
