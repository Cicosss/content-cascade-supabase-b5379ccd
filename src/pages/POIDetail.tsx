
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import NearbyPOIsSection from '@/components/poi/NearbyPOIsSection';
import POILocationMap from '@/components/poi/POILocationMap';
import POIDetailHeader from '@/components/poi/POIDetailHeader';
import POIDetailHero from '@/components/poi/POIDetailHero';
import POIDetailContent from '@/components/poi/POIDetailContent';
import POIDetailSkeleton from '@/components/poi/POIDetailSkeleton';
import POIDetailError from '@/components/poi/POIDetailError';

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
    return <POIDetailSkeleton />;
  }

  if (error || !poi) {
    return <POIDetailError error={error || 'POI non trovato'} />;
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <POIDetailHeader />
        <POIDetailHero poi={poi} />
        <POIDetailContent 
          description={poi.description}
          organizerInfo={poi.organizer_info}
        />
        
        {/* Location Map */}
        <div className="bg-white">
          <div className="container mx-auto px-4 pb-8">
            <POILocationMap
              latitude={poi.latitude}
              longitude={poi.longitude}
              name={poi.name}
              address={poi.address}
            />
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
