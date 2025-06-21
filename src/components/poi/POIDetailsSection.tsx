
import React from 'react';
import POIDetailsCard from './POIDetailsCard';
import { POIDetailData } from '@/types/poiDetail';

interface POIDetailsSectionProps {
  poi: POIDetailData;
}

const POIDetailsSection: React.FC<POIDetailsSectionProps> = ({ poi }) => {
  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Informazioni Dettagliate</h2>
            <p className="text-gray-600">Tutti i dettagli pratici per la tua visita</p>
          </div>
          
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
  );
};

export default POIDetailsSection;
