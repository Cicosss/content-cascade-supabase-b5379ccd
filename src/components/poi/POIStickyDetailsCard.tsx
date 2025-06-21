
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Euro, Phone, Mail, Globe, Calendar, Users } from 'lucide-react';

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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const isEvent = poiType === 'experience' && (startDatetime || endDatetime);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleAddressClick = () => {
    if (address) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
      window.open(mapsUrl, '_blank');
    }
  };

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBYu9y2Rig3ueioFfy-Ait65lRcOTIIR6A&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = initMap;
        document.head.appendChild(script);
      } else {
        initMap();
      }
    };

    const initMap = () => {
      if (!mapRef.current) return;

      const position = { lat: latitude, lng: longitude };

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        zoom: 14,
        center: position,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: true,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      });

      // Add marker
      new window.google.maps.Marker({
        position: position,
        map: mapInstanceRef.current,
        title: name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="30" viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.37 0 0 5.37 0 12C0 21 12 30 12 30S24 21 24 12C24 5.37 18.63 0 12 0ZM12 16.2C9.51 16.2 7.5 14.19 7.5 11.7C7.5 9.21 9.51 7.2 12 7.2C14.49 7.2 16.5 9.21 16.5 11.7C16.5 14.19 14.49 16.2 12 16.2Z" fill="#3B82F6"/>
              <circle cx="12" cy="12" r="3" fill="white"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 30),
          anchor: new window.google.maps.Point(12, 30)
        }
      });
    };

    loadGoogleMaps();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude, name]);

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

        {/* Time/Schedule Information */}
        {isEvent ? (
          <div className="space-y-2">
            {startDatetime && (
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-xs text-gray-600">Inizio</p>
                  <p className="text-gray-900 text-sm">{formatDateTime(startDatetime)}</p>
                </div>
              </div>
            )}
            {endDatetime && (
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-xs text-gray-600">Fine</p>
                  <p className="text-gray-900 text-sm">{formatDateTime(endDatetime)}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          openingHours && (
            <div className="flex items-start gap-3">
              <Clock className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-xs text-gray-600">Orari</p>
                <p className="text-gray-900 text-sm">{openingHours}</p>
              </div>
            </div>
          )
        )}

        {priceInfo && (
          <div className="flex items-start gap-3">
            <Euro className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xs text-gray-600">Prezzo</p>
              <p className="text-gray-900 text-sm">{priceInfo}</p>
            </div>
          </div>
        )}

        {durationInfo && (
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xs text-gray-600">Durata</p>
              <p className="text-gray-900 text-sm">{durationInfo}</p>
            </div>
          </div>
        )}

        {targetAudience && targetAudience !== 'everyone' && (
          <div className="flex items-start gap-3">
            <Users className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-medium text-xs text-gray-600">Pubblico</p>
              <p className="text-gray-900 text-sm">{targetAudience}</p>
            </div>
          </div>
        )}

        {/* Contact Information */}
        {(phone || email || websiteUrl) && (
          <div className="border-t pt-4 space-y-3">
            {phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-700 hover:underline text-sm">
                  {phone}
                </a>
              </div>
            )}

            {email && (
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-700 hover:underline text-sm">
                  {email}
                </a>
              </div>
            )}

            {websiteUrl && (
              <div className="flex items-center gap-3">
                <Globe className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a 
                  href={websiteUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-700 hover:underline text-sm"
                >
                  Sito web
                </a>
              </div>
            )}
          </div>
        )}

        {/* Mini Map */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-sm text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-600" />
            Posizione
          </h4>
          <div 
            ref={mapRef} 
            className="w-full h-32 rounded-lg border border-gray-200"
            style={{ minHeight: '128px' }}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default POIStickyDetailsCard;
