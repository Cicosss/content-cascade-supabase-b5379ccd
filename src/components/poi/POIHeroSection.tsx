
import React from 'react';
import { Badge } from '@/components/ui/badge';
import POIStatusBadge from './POIStatusBadge';
import VisitButton from './VisitButton';
import FavoriteButton from '@/components/FavoriteButton';
import { POIDetailData } from '@/types/poiDetail';

interface POIHeroSectionProps {
  poi: POIDetailData;
}

const POIHeroSection: React.FC<POIHeroSectionProps> = ({ poi }) => {
  const heroImage = poi.images?.[0] || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop&crop=center';

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Debug log to check what data we're receiving
  console.log('POI data in hero:', poi);
  console.log('POI name:', poi.name);

  return (
    <div className="relative w-full h-[60vh] min-h-[400px] sm:min-h-[300px] overflow-hidden">
      {/* Hero Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="relative h-full flex flex-col justify-end">
        <div className="container mx-auto px-4 pb-8 sm:pb-4">
          <div className="max-w-4xl">
            {/* Badges and Category */}
            <div className="flex items-center gap-3 mb-4 animate-fade-in">
              <POIStatusBadge
                poiType={poi.poi_type || 'place'}
                startDatetime={poi.start_datetime}
                endDatetime={poi.end_datetime}
                category={poi.category}
              />
              <Badge variant="secondary" className="bg-white/20 border-white/30 text-white backdrop-blur-sm">
                {poi.category}
              </Badge>
            </div>

            {/* Main Title - Fixed to properly display POI name */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 animate-fade-in drop-shadow-2xl">
              {poi.name || poi.location_name || 'Nome non disponibile'}
            </h1>

            {/* Address - Location name or address */}
            <p className="text-lg md:text-xl text-white/90 mb-6 animate-fade-in drop-shadow-lg">
              {poi.location_name || poi.address}
            </p>

            {/* Action Buttons Bar - Improved grouping and hierarchy */}
            <div className="flex items-center gap-3 max-w-md animate-fade-in">
              {/* Primary Action - Visit Button (takes most space) */}
              <div className="flex-1">
                <VisitButton 
                  poiId={poi.id} 
                  poiName={poi.name || poi.location_name || 'POI'}
                />
              </div>
              
              {/* Secondary Action - Favorite Button (icon-based, larger and well-defined) */}
              <div onClick={handleFavoriteClick}>
                <FavoriteButton
                  itemType="poi"
                  itemId={poi.id}
                  itemData={{
                    name: poi.name || poi.location_name || 'POI',
                    description: poi.description,
                    category: poi.category,
                    images: poi.images,
                    address: poi.address,
                    poi_type: poi.poi_type,
                    location_name: poi.location_name,
                    price_info: poi.price_info,
                    duration_info: poi.duration_info,
                    target_audience: poi.target_audience
                  }}
                  size="lg"
                  className="bg-white/15 border-white/25 backdrop-blur-sm hover:bg-white/25 text-white shadow-lg hover:shadow-xl transition-all duration-300 w-14 h-14 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POIHeroSection;
