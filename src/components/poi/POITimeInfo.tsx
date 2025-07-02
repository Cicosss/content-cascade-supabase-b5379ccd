
import React from 'react';
import { Clock, Calendar } from 'lucide-react';

interface POITimeInfoProps {
  openingHours?: string;
  startDatetime?: string;
  endDatetime?: string;
  poiType?: string;
}

const POITimeInfo: React.FC<POITimeInfoProps> = ({
  openingHours,
  startDatetime,
  endDatetime,
  poiType
}) => {
  const isEvent = (poiType === 'experience' || poiType === 'event') && (startDatetime || endDatetime);

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

  if (isEvent) {
    return (
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
    );
  }

  if (openingHours) {
    return (
      <div className="flex items-start gap-3">
        <Clock className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-xs text-gray-600">Orari</p>
          <p className="text-gray-900 text-sm">{openingHours}</p>
        </div>
      </div>
    );
  }

  return null;
};

export default POITimeInfo;
