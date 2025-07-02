
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import POIContactInfo from './POIContactInfo';
import POITimeInfo from './POITimeInfo';
import POIPracticalInfo from './POIPracticalInfo';
import POIMiniMap from './POIMiniMap';

interface POIStickyDetailsCardProps {
  address?: string;
  openingHours?: string;
  startDatetime?: string;
  endDatetime?: string;
  priceInfo?: string;
  durationInfo?: string;
  targetAudience?: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  poiType?: string;
  latitude: number;
  longitude: number;
  name: string;
}

const POIStickyDetailsCard: React.FC<POIStickyDetailsCardProps> = ({
  address,
  openingHours,
  startDatetime,
  endDatetime,
  priceInfo,
  durationInfo,
  targetAudience,
  phone,
  email,
  websiteUrl,
  poiType,
  latitude,
  longitude,
  name
}) => {
  const handleAddressClick = () => {
    if (address) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Informazioni Pratiche
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {address && (
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <button
                onClick={handleAddressClick}
                className="text-blue-600 hover:text-blue-700 text-left hover:underline text-sm leading-tight"
              >
                {address}
              </button>
            </div>
          </div>
        )}

        <POITimeInfo
          openingHours={openingHours}
          startDatetime={startDatetime}
          endDatetime={endDatetime}
          poiType={poiType}
        />

        <POIPracticalInfo
          priceInfo={priceInfo}
          durationInfo={durationInfo}
          targetAudience={targetAudience}
        />

        <POIContactInfo
          phone={phone}
          email={email}
          websiteUrl={websiteUrl}
        />

        <POIMiniMap
          latitude={latitude}
          longitude={longitude}
          name={name}
        />
      </CardContent>
    </Card>
  );
};

export default POIStickyDetailsCard;
