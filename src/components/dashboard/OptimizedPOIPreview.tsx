
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
}

const getCategoryIcon = (category: string): string => {
  const icons: Record<string, string> = {
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
  return icons[category] || '📍';
};

const stripHtmlTags = (html: string): string => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
};

const truncateDescription = (text: string, maxWords: number = 18): string => {
  if (!text) return '';
  const cleanText = stripHtmlTags(text);
  const words = cleanText.split(' ');
  if (words.length <= maxWords) return cleanText;
  return words.slice(0, maxWords).join(' ') + '...';
};

const shouldShowPrice = (price_info?: string): boolean => {
  if (!price_info) return false;
  const trimmedPrice = price_info.trim();
  if (trimmedPrice === '' || trimmedPrice === '0' || trimmedPrice === '0€' || trimmedPrice === '0 €' || trimmedPrice.toLowerCase() === 'null') return false;
  // Controlla se è solo un numero 0
  if (parseFloat(trimmedPrice) === 0) return false;
  return true;
};

const OptimizedPOIPreview: React.FC<OptimizedPOIPreviewProps> = memo(({ poi, onClose, onGetDirections }) => {
  const navigate = useNavigate();

  const handleDiscoverMore = () => {
    navigate(`/poi/${poi.id}`);
  };

  const handleGetDirections = () => {
    onGetDirections(poi);
  };

  const placeholderImage = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&crop=center`;

  return (
    <Card className="max-w-[300px] overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group bg-white border border-gray-200 shadow-sm relative p-4">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
      >
        <X className="h-3 w-3 text-white" />
      </button>

      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50 rounded-lg">
        {poi.images?.[0] ? (
          <img
            src={poi.images[0]}
            alt={poi.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = placeholderImage;
            }}
          />
        ) : (
          <img
            src={placeholderImage}
            alt={poi.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <CardContent className="space-y-3 mt-4 p-0">
        <div>
          <h4 className="font-semibold text-lg mb-2 line-clamp-1 text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
            {poi.name}
          </h4>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span className="text-base">{getCategoryIcon(poi.category)}</span>
            <span>{poi.category}</span>
          </div>
        </div>

        {poi.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2 leading-relaxed">
            {truncateDescription(poi.description)}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {poi.avg_rating && poi.avg_rating > 0 && (
              <>
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="text-sm font-medium text-gray-900">
                  {poi.avg_rating.toFixed(1)}
                </span>
              </>
            )}
          </div>
          
          {shouldShowPrice(poi.price_info) && (
            <div className="flex items-center text-green-600 font-medium">
              <Euro className="h-4 w-4 mr-1" />
              <span className="text-sm">{poi.price_info}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleDiscoverMore}
            className="flex-1 bg-blue-900 hover:bg-blue-800 text-white text-sm h-9"
          >
            Scopri di più
          </Button>
          <Button
            onClick={handleGetDirections}
            variant="outline"
            className="flex-1 border-blue-900 text-blue-900 hover:bg-blue-50 text-sm h-9"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Raggiungi
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

OptimizedPOIPreview.displayName = 'OptimizedPOIPreview';

export default OptimizedPOIPreview;
