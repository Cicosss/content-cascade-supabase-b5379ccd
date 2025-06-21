
import React from 'react';
import { MapPin, Clock, Euro, Star, X, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

interface POIPreviewCardProps {
  poi: POI;
  onClose: () => void;
  onGetDirections: (poi: POI) => void;
}

const getCategoryIcon = (category: string) => {
  const icons: Record<string, React.ReactNode> = {
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

const truncateDescription = (text: string, maxWords: number = 18): string => {
  if (!text) return '';
  const words = text.split(' ');
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '...';
};

const POIPreviewCard: React.FC<POIPreviewCardProps> = ({ poi, onClose, onGetDirections }) => {
  const navigate = useNavigate();

  const handleDiscoverMore = () => {
    navigate(`/poi/${poi.id}`);
  };

  const handleGetDirections = () => {
    onGetDirections(poi);
  };

  const placeholderImage = `https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=200&fit=crop&crop=center`;

  return (
    <Card className="w-[300px] bg-white shadow-xl border-0 overflow-hidden relative">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-2 right-2 z-10 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
      >
        <X className="h-3 w-3 text-white" />
      </button>

      {/* Cover Image */}
      <div className="h-32 bg-gradient-to-br from-blue-500 to-blue-600 relative overflow-hidden">
        <img
          src={poi.images?.[0] || placeholderImage}
          alt={poi.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = placeholderImage;
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Title and Category */}
        <div>
          <h4 className="font-semibold text-gray-900 text-lg leading-tight mb-1">
            {poi.name}
          </h4>
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span className="text-base">{getCategoryIcon(poi.category)}</span>
            <span>{poi.category}</span>
          </div>
        </div>

        {/* Description */}
        {poi.description && (
          <p className="text-sm text-gray-700 leading-relaxed">
            {truncateDescription(poi.description)}
          </p>
        )}

        {/* Key Information */}
        <div className="flex items-center gap-4 text-xs text-gray-500">
          {poi.price_info && (
            <div className="flex items-center gap-1">
              <Euro className="h-3 w-3" />
              <span>{poi.price_info}</span>
            </div>
          )}
          {poi.avg_rating && poi.avg_rating > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span>{poi.avg_rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
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
};

export default POIPreviewCard;
