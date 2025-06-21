
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import NearbyPOIsSection from '@/components/poi/NearbyPOIsSection';
import POIDetailHeader from '@/components/poi/POIDetailHeader';
import POIHeroSection from '@/components/poi/POIHeroSection';
import POIImageGallerySection from '@/components/poi/POIImageGallerySection';
import POIDetailContent from '@/components/poi/POIDetailContent';
import POIDetailSkeleton from '@/components/poi/POIDetailSkeleton';
import POIDetailError from '@/components/poi/POIDetailError';
import POIStickyDetailsCard from '@/components/poi/POIStickyDetailsCard';
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
        
        {/* Hero Section - Full Width */}
        <POIHeroSection poi={poi} />
        
        {/* Image Gallery Section - Full Width */}
        <POIImageGallerySection
          images={poi.images || []}
          videoUrl={poi.video_url}
          name={poi.name}
        />
        
        {/* Two Column Layout */}
        <div className="bg-white">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Main Content (2/3 width) */}
              <div className="lg:col-span-2 space-y-8">
                {/* Description Content */}
                <POIDetailContent 
                  description={poi.description}
                  organizerInfo={poi.organizer_info}
                />
                
                {/* Nearby POIs Section */}
                <div className="border-t pt-8">
                  <NearbyPOIsSection 
                    currentPOI={{
                      id: poi.id,
                      latitude: poi.latitude,
                      longitude: poi.longitude
                    }}
                  />
                </div>
              </div>

              {/* Right Column - Sticky Details (1/3 width) */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <POIStickyDetailsCard
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
                    name={poi.name}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default POIDetail;
