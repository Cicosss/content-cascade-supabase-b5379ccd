
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Euro, Phone, Mail, Globe, Calendar, Users } from 'lucide-react';

interface POIDetailsCardProps {
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
}

const POIDetailsCard: React.FC<POIDetailsCardProps> = ({
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
  longitude
}) => {
  const isEvent = poiType === 'experience' && (startDatetime || endDatetime);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Dettagli
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        {address && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <button
                onClick={handleAddressClick}
                className="text-blue-600 hover:text-blue-700 text-left hover:underline"
              >
                {address}
              </button>
              <p className="text-xs text-gray-500 mt-1">Clicca per aprire in Google Maps</p>
            </div>
          </div>
        )}

        {/* Time/Schedule Information */}
        {isEvent ? (
          <div className="space-y-2">
            {startDatetime && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Inizio</p>
                  <p className="text-gray-700">{formatDateTime(startDatetime)}</p>
                </div>
              </div>
            )}
            {endDatetime && (
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Fine</p>
                  <p className="text-gray-700">{formatDateTime(endDatetime)}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          openingHours && (
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Orari di apertura</p>
                <p className="text-gray-700">{openingHours}</p>
              </div>
            </div>
          )
        )}

        {priceInfo && (
          <div className="flex items-start gap-3">
            <Euro className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Prezzo</p>
              <p className="text-gray-700">{priceInfo}</p>
            </div>
          </div>
        )}

        {durationInfo && (
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Durata</p>
              <p className="text-gray-700">{durationInfo}</p>
            </div>
          </div>
        )}

        {targetAudience && targetAudience !== 'everyone' && (
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-sm">Pubblico</p>
              <p className="text-gray-700">{targetAudience}</p>
            </div>
          </div>
        )}

        {phone && (
          <div className="flex items-start gap-3">
            <Phone className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <a href={`tel:${phone}`} className="text-blue-600 hover:text-blue-700 hover:underline">
              {phone}
            </a>
          </div>
        )}

        {email && (
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <a href={`mailto:${email}`} className="text-blue-600 hover:text-blue-700 hover:underline">
              {email}
            </a>
          </div>
        )}

        {websiteUrl && (
          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <a 
              href={websiteUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 hover:underline"
            >
              Visita il sito web
            </a>
          </div>
        )}
      </CardContent>
    </div>
  );
};

export default POIDetailsCard;
