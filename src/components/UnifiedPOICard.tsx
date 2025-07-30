
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Euro, Clock, Users, Calendar, Eye, Phone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import FavoriteButton from './FavoriteButton';
import HtmlContent from '@/components/ui/html-content';
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
  const displayPrice = price_info || price || '';
  const displayDuration = duration_info || duration || '';
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
      className={`bg-white border border-gray-200 shadow-sm hover:shadow-md active:shadow-lg transition-shadow duration-300 cursor-pointer group overflow-hidden min-h-[200px] md:min-h-[220px] ${className}`}
      onClick={handleCardClick}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
        {coverImage ? (
          <img
            src={coverImage}
            alt={displayName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gradient-to-br from-blue-100 to-purple-100">
            <CategoryIcon className="h-8 w-8" />
          </div>
        )}
        
        {/* Badge categoria */}
        <Badge className="absolute top-2 left-2 bg-white/90 text-gray-900 text-xs">
          {category}
        </Badge>

        {/* Rating badge */}
        {displayRating > 0 && (
          <Badge className="absolute top-2 right-12 bg-white/90 text-gray-900 flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {displayRating.toFixed(1)}
          </Badge>
        )}

        {/* Favorite button */}
        <div onClick={handleFavoriteClick}>
          <FavoriteButton 
            itemType="poi"
            itemId={id}
            className="absolute top-3 right-3 z-10 opacity-70 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>

      <CardContent className="p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <CategoryIcon className="h-4 w-4 text-gray-500" />
          <span className="text-sm text-gray-600">{category}</span>
        </div>

        <h3 className="font-semibold text-base md:text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
          {displayName}
        </h3>

        {description && (
          <HtmlContent 
            content={description} 
            className="text-sm text-gray-600 line-clamp-2 mb-3"
          />
        )}

        {displayLocation && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-[#0377F9] stroke-2" strokeWidth={2} fill="none" />
            <span className="truncate">{displayLocation}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UnifiedPOICard;
