import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import NearbyPOIsSection from '@/components/poi/NearbyPOIsSection';
import VisitButton from '@/components/poi/VisitButton';
import POIImageGallery from '@/components/poi/POIImageGallery';
import POIStatusBadge from '@/components/poi/POIStatusBadge';
import POIDetailsCard from '@/components/poi/POIDetailsCard';
import POILocationMap from '@/components/poi/POILocationMap';
import FavoriteButton from '@/components/FavoriteButton';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface POIData {
  id: string;
  name: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  address: string;
  images: string[];
  price_info?: string;
  duration_info?: string;
  opening_hours?: string;
  phone?: string;
  email?: string;
  website_url?: string;
  video_url?: string;
  target_audience: string;
  poi_type?: string;
  start_datetime?: string;
  end_datetime?: string;
  location_name?: string;
  organizer_info?: string;
}

const POIDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poi, setPoi] = useState<POIData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPOI = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('points_of_interest')
          .select('*')
          .eq('id', id)
          .eq('status', 'approved')
          .single();

        if (error) {
          setError('POI non trovato');
          return;
        }

        setPoi(data);
      } catch (error) {
        setError('Errore nel caricamento del POI');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPOI();
  }, [id]);

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50">
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-4">
              <Skeleton className="h-5 w-20" />
            </div>
          </div>

          <div className="bg-white">
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Skeleton className="aspect-[16/9] rounded-xl" />
                <div className="space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !poi) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">POI non trovato</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Torna alla Dashboard
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Indietro
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            {/* Hero Section with Gallery and Header */}
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

                {/* Details Card - MOVED HERE */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
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

            {/* Description Section - NOW FULL WIDTH */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Descrizione</h2>
              {poi.description ? (
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed text-lg">{poi.description}</p>
                </div>
              ) : (
                <p className="text-gray-500 italic">Nessuna descrizione disponibile.</p>
              )}

              {poi.organizer_info && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <h3 className="font-semibold text-gray-900 mb-2">Informazioni Organizzatore</h3>
                  <p className="text-gray-700">{poi.organizer_info}</p>
                </div>
              )}
            </div>

            {/* Location Map */}
            <div className="mb-8">
              <POILocationMap
                latitude={poi.latitude}
                longitude={poi.longitude}
                name={poi.name}
                address={poi.address}
              />
            </div>
          </div>
        </div>

        {/* Nearby POIs Section */}
        <NearbyPOIsSection 
          currentPOI={{
            id: poi.id,
            latitude: poi.latitude,
            longitude: poi.longitude
          }}
        />
      </div>
    </Layout>
  );
};

export default POIDetail;
