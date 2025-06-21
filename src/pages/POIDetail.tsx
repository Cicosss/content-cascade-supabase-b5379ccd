
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import NearbyPOIsSection from '@/components/poi/NearbyPOIsSection';
import POILocationMap from '@/components/poi/POILocationMap';
import POIDetailHeader from '@/components/poi/POIDetailHeader';
import POIHeroSection from '@/components/poi/POIHeroSection';
import POIImageGallerySection from '@/components/poi/POIImageGallerySection';
import POIDetailsSection from '@/components/poi/POIDetailsSection';
import POIDetailContent from '@/components/poi/POIDetailContent';
import POIDetailSkeleton from '@/components/poi/POIDetailSkeleton';
import POIDetailError from '@/components/poi/POIDetailError';
import { usePOIDetail } from '@/hooks/usePOIDetail';

const POIDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { poi, isLoading, error } = usePOIDetail(id);

  if (isLoading) {
    return <POIDetailSkeleton />;
  }

  if (error || !poi) {
    return <POIDetailError error={error || 'POI non trovato'} />;
  }

  return (
    <Layout showSidebar={true}>
      <div className="min-h-screen bg-gray-50">
        <POIDetailHeader />
        
        {/* New Hero Section */}
        <POIHeroSection poi={poi} />
        
        {/* Image Gallery Section */}
        <POIImageGallerySection
          images={poi.images || []}
          videoUrl={poi.video_url}
          name={poi.name}
        />
        
        {/* Details Section */}
        <POIDetailsSection poi={poi} />
        
        {/* Description Content */}
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
