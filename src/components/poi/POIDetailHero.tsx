
import React from 'react';
import POIImageGallery from './POIImageGallery';
import POIStatusBadge from './POIStatusBadge';
import VisitButton from './VisitButton';
import FavoriteButton from '@/components/FavoriteButton';
import POIDetailsCard from './POIDetailsCard';
import { Badge } from '@/components/ui/badge';
import { POIDetailData } from '@/types/poiDetail';

interface POIDetailHeroProps {
  poi: POIDetailData;
}

const POIDetailHero: React.FC<POIDetailHeroProps> = ({ poi }) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column: Image Gallery */}
          <POIImageGallery
            images={poi.images || []}
            videoUrl={poi.video_url}
            name={poi.name}
          />

          {/* Right Column: Header and Actions */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <POIStatusBadge
                  poiType={poi.poi_type || 'place'}
                  startDatetime={poi.start_datetime}
                  endDatetime={poi.end_datetime}
                  category={poi.category}
                />
                <Badge variant="secondary">{poi.category}</Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{poi.name}</h1>
              <p className="text-lg text-gray-600">
                {poi.location_name || poi.address}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <div className="flex-1">
                <VisitButton poiId={poi.id} poiName={poi.name} />
              </div>
              <div onClick={handleFavoriteClick}>
                <FavoriteButton
                  itemType="poi"
                  itemId={poi.id}
                  itemData={{
                    name: poi.name,
                    description: poi.description,
                    category: poi.category,
                    images: poi.images,
                    address: poi.address,
                    poi_type: poi.poi_type
                  }}
                  size="lg"
                  className="bg-white border border-gray-300 hover:bg-gray-50"
                />
              </div>
            </div>

            {/* Details Card - moved below action buttons */}
            <div className="mt-6">
              <POIDetailsCard
                address={poi.address}
                openingHours={poi.opening_hours}
                startDatetime={poi.start_datetime}
                endDatetime={poi.end_datetime}
                priceInfo={poi.price_info}
                durationInfo={poi.duration_info}
                targetAudience={poi.target_audience}
                phone={poi.phone}
                email={poi.email}
                websiteUrl={poi.website_url}
                poiType={poi.poi_type}
                latitude={poi.latitude}
                longitude={poi.longitude}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POIDetailHero;
