
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
}

const EventCard: React.FC<EventCardProps> = ({
  title,
  date,
  time,
  location,
  category,
  image
}) => {
  const itemId = `${title}-${date}`.toLowerCase().replace(/\s+/g, '-');
  const itemData = {
    title,
    date,
    time,
    location,
    category,
    image
  };

  return (
    <Card className="overflow-hidden cursor-pointer group relative animate-fade-in">
      <div className="aspect-[4/3] relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
          <span className="text-white text-sm">{image}</span>
        </div>
        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 rounded-xl">
          {category}
        </Badge>
        <FavoriteButton 
          itemType="event"
          itemId={itemId}
          itemData={itemData}
        />
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" strokeWidth={1.5} />
            {date}
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" strokeWidth={1.5} />
            {time}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" strokeWidth={1.5} />
            {location}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
