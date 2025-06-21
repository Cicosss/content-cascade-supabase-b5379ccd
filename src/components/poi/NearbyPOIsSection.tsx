
import React from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { useNearbyPOIs } from '@/hooks/useNearbyPOIs';
import { useNavigate } from 'react-router-dom';
import NearbyPOICard from './NearbyPOICard';

interface NearbyPOIsSectionProps {
  currentPOI: {
    id: string;
    latitude: number;
    longitude: number;
  };
}

const NearbyPOIsSection: React.FC<NearbyPOIsSectionProps> = ({ currentPOI }) => {
  const { nearbyPOIs, isLoading } = useNearbyPOIs(currentPOI);
  const navigate = useNavigate();

  const handlePOIClick = (poiId: string) => {
    // Navigate to POI detail page - assuming the route structure
    navigate(`/poi/${poiId}`);
  };

  const handleViewAll = () => {
    // Navigate to dashboard with location filter
    navigate('/dashboard?showNearby=true');
  };

  if (isLoading) {
    return (
      <section className="py-8 border-t">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <MapPin className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Nei Dintorni</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 rounded-lg h-48 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (nearbyPOIs.length === 0) {
    return null; // Don't show section if no nearby POIs
  }

  return (
    <section className="py-8 border-t bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">Nei Dintorni</h2>
          </div>
          {nearbyPOIs.length >= 3 && (
            <button
              onClick={handleViewAll}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              Vedi tutti
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nearbyPOIs.map((poi) => (
            <NearbyPOICard
              key={poi.id}
              id={poi.id}
              name={poi.name}
              category={poi.category}
              distance={poi.distance}
              images={poi.images}
              address={poi.address}
              onClick={() => handlePOIClick(poi.id)}
            />
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Mostrando luoghi entro 2 km di distanza
          </p>
        </div>
      </div>
    </section>
  );
};

export default NearbyPOIsSection;
