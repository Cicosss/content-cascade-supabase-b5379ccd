
import React, { useEffect, useRef, useState } from 'react';
import { MapPin, ArrowRight } from 'lucide-react';
import { useNearbyPOIs } from '@/hooks/useNearbyPOIs';
import { useNavigate } from 'react-router-dom';
import NearbyPOICard from './NearbyPOICard';
import { Skeleton } from '@/components/ui/skeleton';

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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
          fetchNearbyPOIs(currentPOI);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px'
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

  const SkeletonCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="aspect-[4/3] rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <section ref={sectionRef} className="py-8 border-t bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <MapPin className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">📍 Nei Dintorni</h2>
              <p className="text-gray-600 text-sm">Scopri altri luoghi interessanti nella zona</p>
            </div>
          </div>
          {nearbyPOIs.length >= 3 && (
            <button
              onClick={handleViewAll}
              className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors hover:underline"
            >
              Vedi tutti
              <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          )}
        </div>

        {isLoading && <SkeletonCards />}

        {error && !isLoading && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <MapPin className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Impossibile caricare i suggerimenti
              </h3>
              <p className="text-gray-600 mb-4">
                Si è verificato un errore durante il caricamento dei luoghi nelle vicinanze.
              </p>
              <button
                onClick={handleRetry}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Riprova
              </button>
            </div>
          </div>
        )}

        {!isLoading && !error && nearbyPOIs.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
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

            <div className="text-center">
              <p className="text-xs text-gray-500 mb-2">
                Mostrando luoghi entro 2 km di distanza
              </p>
              {nearbyPOIs.length >= 6 && (
                <button
                  onClick={handleViewAll}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium hover:underline"
                >
                  Scopri altri luoghi nelle vicinanze →
                </button>
              )}
            </div>
          </>
        )}

        {!isLoading && !error && nearbyPOIs.length === 0 && hasBeenVisible && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <div className="text-gray-400 mb-4">
                <MapPin className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nessun luogo nelle vicinanze
              </h3>
              <p className="text-gray-600">
                Non abbiamo trovato altri luoghi di interesse nel raggio di 2 km.
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default NearbyPOIsSection;
