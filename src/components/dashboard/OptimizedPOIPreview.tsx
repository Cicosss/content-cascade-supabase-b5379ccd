import React, { memo } from 'react';
import { MapPin, Euro, Star, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface POI {
  id: string;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  images?: string[];
  price_info?: string;
  avg_rating?: number;
}

interface OptimizedPOIPreviewProps {
  poi: POI;
  onClose: () => void;
  onGetDirections: (poi: POI) => void;
  isMobile?: boolean;
}

// Utility functions for data processing
const categoryIconMap: Record<string, string> = {
  'Ristoranti': '🍽️',
  'Arte': '🏛️',
  'Sport': '⚽',
  'Concerti': '🎵',
  'Parchi': '🌳',
  'Spiagge': '🏖️',
  'Musei': '🏛️',
  'Agriturismi': '🚜',
  'Cantine': '🍷',
  'Street Food': '🍕',
  'Mercati': '🛒',
  'Borghi': '🏘️',
  'Castelli': '🏰',
  'Artigianato': '🎨',
  'Festival': '🎭',
  'Teatro': '🎭',
  'Cinema': '🎬',
  'Mostre': '🖼️',
  'Attività per Bambini': '🎠',
  'Natura': '🌲'
};

const getCategoryIcon = (category: string): string => {
  return categoryIconMap[category] || '📍';
};

const sanitizeHtmlText = (htmlString: string): string => {
  if (!htmlString || typeof htmlString !== 'string') return '';
  
  return htmlString
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
};

const truncateText = (text: string, maxWords: number = 18): string => {
  if (!text) return '';
  
  const cleanText = sanitizeHtmlText(text);
  const words = cleanText.split(/\s+/).filter(word => word.length > 0);
  
  if (words.length <= maxWords) return cleanText;
  return words.slice(0, maxWords).join(' ') + '...';
};

const validatePriceInfo = (priceInfo?: string): boolean => {
  if (!priceInfo) return false;
  
  const normalizedPrice = priceInfo.toString().trim().toLowerCase();
  
  // Lista di valori che indicano "nessun prezzo valido"
  const invalidPriceValues = [
    '', '0', '0€', '0 €', '€0', '€ 0',
    'null', 'undefined', 'nan', '0.00', '0,00'
  ];
  
  if (invalidPriceValues.includes(normalizedPrice)) return false;
  
  // Controlla se è solo un numero che vale 0
  const numericValue = parseFloat(normalizedPrice.replace(/[€\s]/g, ''));
  if (!isNaN(numericValue) && numericValue === 0) return false;
  
  return true;
};

const validateRating = (rating?: number): boolean => {
  return typeof rating === 'number' && rating > 0 && rating <= 5;
};

const formatRating = (rating: number): string => {
  return rating.toFixed(1);
};

// Main component
const OptimizedPOIPreview: React.FC<OptimizedPOIPreviewProps> = memo(({ 
  poi, 
  onClose, 
  onGetDirections,
  isMobile = false
}) => {
  const navigate = useNavigate();

  // Event handlers
  const handleDiscoverMore = () => {
    navigate(`/poi/${poi.id}`);
  };

  const handleGetDirections = () => {
    onGetDirections(poi);
  };

  // Data processing
  const categoryIcon = getCategoryIcon(poi.category);
  const truncatedDescription = truncateText(poi.description);
  const hasValidPrice = validatePriceInfo(poi.price_info);
  const hasValidRating = validateRating(poi.avg_rating);
  
  // Image handling
  const placeholderImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&crop=center';
  const primaryImage = poi.images?.[0] || placeholderImage;

  return (
    <Card className={`${isMobile ? 'w-full max-w-[240px]' : 'max-w-[300px]'} overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group bg-white border border-gray-200 shadow-sm relative ${isMobile ? 'p-2' : 'p-4'}`}>
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-1 right-1 z-10 bg-black/50 hover:bg-black/70 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
        aria-label="Chiudi anteprima"
      >
        <X className="h-2.5 w-2.5 text-white" />
      </button>

      {/* Image section - Always visible now */}
      <div className={`${isMobile ? 'aspect-[5/3]' : 'aspect-[4/3]'} relative overflow-hidden bg-gray-50 rounded-lg`}>
        <img
          src={primaryImage}
          alt={poi.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== placeholderImage) {
              target.src = placeholderImage;
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {/* Content section */}
      <CardContent className={`space-y-2 p-0 ${isMobile ? 'mt-2' : 'mt-4'}`}>
        {/* Title and category */}
        <div>
          <h4 className={`font-semibold line-clamp-1 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight ${isMobile ? 'text-sm mb-0.5' : 'text-lg mb-2'}`}>
            {poi.name}
          </h4>
          <div className={`flex items-center gap-1 text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            <span className="text-base" role="img" aria-label={poi.category}>
              {categoryIcon}
            </span>
            <span>{poi.category}</span>
          </div>
        </div>

        {/* Description - Now visible on mobile too, but shorter */}
        {truncatedDescription && (
          <p className={`text-gray-600 line-clamp-2 leading-relaxed ${isMobile ? 'text-xs mb-1' : 'text-sm mb-3'}`}>
            {isMobile ? truncateText(poi.description, 8) : truncatedDescription}
          </p>
        )}

        {/* Rating and price row */}
        <div className="flex items-center justify-between">
          {/* Rating section */}
          <div className="flex items-center">
            {hasValidRating && (
              <>
                <Star className={`fill-yellow-400 text-yellow-400 mr-1 ${isMobile ? 'h-2.5 w-2.5' : 'h-4 w-4'}`} />
                <span className={`font-medium text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  {formatRating(poi.avg_rating!)}
                </span>
              </>
            )}
          </div>
          
          {/* Price section */}
          {hasValidPrice && (
            <div className="flex items-center text-green-600 font-medium">
              <Euro className={`mr-1 ${isMobile ? 'h-2.5 w-2.5' : 'h-4 w-4'}`} />
              <span className={`${isMobile ? 'text-xs' : 'text-sm'}`}>{poi.price_info}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className={`flex gap-1.5 ${isMobile ? 'pt-1' : 'pt-2'}`}>
          <Button
            onClick={handleDiscoverMore}
            className={`flex-1 bg-blue-900 hover:bg-blue-800 text-white ${isMobile ? 'text-xs h-7 px-2' : 'text-sm h-9'}`}
          >
            Scopri di più
          </Button>
          <Button
            onClick={handleGetDirections}
            variant="outline"
            className={`flex-1 border-blue-900 text-blue-900 hover:bg-blue-50 ${isMobile ? 'text-xs h-7 px-2' : 'text-sm h-9'}`}
          >
            <ExternalLink className={`mr-1 ${isMobile ? 'h-2 w-2' : 'h-3 w-3'}`} />
            Raggiungi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedPOIPreview.displayName = 'OptimizedPOIPreview';

export default OptimizedPOIPreview;