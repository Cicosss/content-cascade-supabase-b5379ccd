
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Euro } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import { Skeleton } from '@/components/ui/skeleton';
import MiaRomagnaLogo from './MiaRomagnaLogo';
import { useMapSync } from '@/contexts/MapSyncContext';

interface POICardProps {
  id: string;
  name: string;
  category: string;
  description?: string;
  images?: string[];
  avg_rating?: number;
  price_info?: string;
  isLoading?: boolean;
  latitude?: number;
  longitude?: number;
}

const POICard: React.FC<POICardProps> = ({
  id,
  name,
  category,
  description,
  images,
  avg_rating,
  price_info,
  isLoading = false,
  latitude,
  longitude
}) => {
  const navigate = useNavigate();
  const { highlightPOI, centerOnPOI } = useMapSync();
  const coverImage = images && images.length > 0 ? images[0] : null;

  const handleCardClick = () => {
    // If coordinates are available, center map and highlight
    if (latitude && longitude) {
      const poi = { id, name, category, description, images, avg_rating, price_info, latitude, longitude };
      centerOnPOI(poi);
    }
    
    // Navigate to detail page
    navigate(`/poi/${id}`);
  };

  const handleMouseEnter = () => {
    highlightPOI(id);
  };

  const handleMouseLeave = () => {
    highlightPOI(null);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const formatDescription = (desc?: string) => {
    if (!desc) return '';
    return desc.length > 120 ? desc.substring(0, 120) + '...' : desc;
  };

  const formatRating = (rating?: number) => {
    if (!rating || rating === 0) return null;
    return rating.toFixed(1);
  };

  // Skeleton loader component
  if (isLoading) {
    return (
      <Card className="overflow-hidden bg-white border border-gray-200 shadow-sm">
        <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
          <Skeleton className="w-full h-full" />
          <div className="absolute top-3 left-3">
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="absolute top-3 right-3">
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group bg-white border border-gray-200 shadow-sm hover:border-blue-300"
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Immagine di copertina */}
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
        {coverImage ? (
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="flex flex-col items-center space-y-2">
              <MiaRomagnaLogo width={32} height={32} className="opacity-60" />
              <span className="text-xs text-gray-500 font-medium">Mia Romagna</span>
            </div>
          </div>
        )}
        
        {/* Barra Azioni Rapide */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
          <Badge className="bg-white/90 backdrop-blur-sm text-gray-900 text-xs border-0 shadow-sm group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors">
            {category}
          </Badge>
          
          <div onClick={handleFavoriteClick}>
            <FavoriteButton 
              itemType="poi"
              itemId={id}
              itemData={{ id, name, category, description, images, avg_rating, price_info }}
              className="opacity-90 hover:opacity-100 transition-opacity bg-white/90 backdrop-blur-sm shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Corpo Informativo */}
      <div className="p-4">
        {/* Titolo del POI */}
        <h3 className="font-semibold text-lg mb-2 line-clamp-1 text-gray-900 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        
        {/* Descrizione Breve */}
        {description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {formatDescription(description)}
          </p>
        )}

        {/* Riga dei Dati Chiave */}
        <div className="flex items-center justify-between">
          {/* Valutazione */}
          <div className="flex items-center">
            {avg_rating && avg_rating > 0 ? (
              <>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium text-gray-900">
                  {formatRating(avg_rating)}
                </span>
              </>
            ) : (
              <span className="text-sm text-gray-500">Nuovo</span>
            )}
          </div>
          
          {/* Prezzo */}
          {price_info && (
            <div className="flex items-center text-green-600 font-medium">
              <Euro className="h-4 w-4 mr-1" />
              <span className="text-sm">{price_info}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default POICard;
