
import React, { useEffect, useRef, useState } from 'react';
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
  const { nearbyPOIs, isLoading, error, fetchNearbyPOIs } = useNearbyPOIs();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  // Intersection Observer per caricamento lazy
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasBeenVisible) {
          console.log('🔍 Sezione "Nei Dintorni" è diventata visibile, caricamento POI...');
          setHasBeenVisible(true);
          fetchNearbyPOIs(currentPOI);
        }
      },
      {
        threshold: 0.1, // Trigger when 10% of the section is visible
        rootMargin: '50px' // Start loading 50px before the section is visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [currentPOI, fetchNearbyPOIs, hasBeenVisible]);

  const handlePOIClick = (poiId: string) => {
    navigate(`/poi/${poiId}`);
  };

  const handleViewAll = () => {
    navigate('/dashboard?showNearby=true');
  };

  const handleRetry = () => {
    fetchNearbyPOIs(currentPOI);
  };

  return (
    <section ref={sectionRef} className="py-8 border-t bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-900">📍 Nei Dintorni</h2>
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

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse"></div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Impossibile caricare i suggerimenti.</p>
            <button
              onClick={handleRetry}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Riprova
            </button>
          </div>
        )}

        {/* Success State */}
        {!isLoading && !error && nearbyPOIs.length > 0 && (
          <>
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
          </>
        )}

        {/* Empty State */}
        {!isLoading && !error && nearbyPOIs.length === 0 && hasBeenVisible && (
          <div className="text-center py-8">
            <p className="text-gray-600">Nessun luogo trovato nei dintorni.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NearbyPOIsSection;
