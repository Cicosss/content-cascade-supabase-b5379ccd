
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';

interface POIStatusBadgeProps {
  poiType: string;
  startDatetime?: string;
  endDatetime?: string;
  category: string;
}

const POIStatusBadge: React.FC<POIStatusBadgeProps> = ({
  poiType,
  startDatetime,
  endDatetime,
  category
}) => {
  const isEvent = poiType === 'experience' && (startDatetime || endDatetime);
  
  if (!isEvent) {
    return (
      <Badge className="bg-blue-600 text-white flex items-center gap-1">
        <MapPin className="h-3 w-3" />
        Luogo
      </Badge>
    );
  }

  // Logic for event status
  const now = new Date();
  const start = startDatetime ? new Date(startDatetime) : null;
  const end = endDatetime ? new Date(endDatetime) : null;

  let status = 'Evento';
  let bgColor = 'bg-green-600';
  let icon = Calendar;

  if (start && end) {
    if (now < start) {
      status = 'Prossimamente';
      bgColor = 'bg-orange-600';
      icon = Clock;
    } else if (now >= start && now <= end) {
      status = 'In Corso Ora';
      bgColor = 'bg-green-600';
      icon = Calendar;
    } else {
      status = 'Concluso';
      bgColor = 'bg-gray-600';
      icon = Calendar;
    }
  } else if (start) {
    if (now < start) {
      status = 'Prossimamente';
      bgColor = 'bg-orange-600';
      icon = Clock;
    } else {
      status = 'In Corso';
      bgColor = 'bg-green-600';
      icon = Calendar;
    }
  }

  const IconComponent = icon;

  return (
    <Badge className={`${bgColor} text-white flex items-center gap-1`}>
      <IconComponent className="h-3 w-3" />
      {status}
    </Badge>
  );
};

export default POIStatusBadge;
