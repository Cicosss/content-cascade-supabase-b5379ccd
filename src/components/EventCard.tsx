
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';

interface EventCardProps {
  id?: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  time,
  location,
  category,
  image
}) => {
  const navigate = useNavigate();
  const itemId = `${title}-${date}`.toLowerCase().replace(/\s+/g, '-');
  const itemData = {
    title,
    date,
    time,
    location,
    category,
    image
  };

  const handleCardClick = () => {
    if (id) {
      navigate(`/poi/${id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card 
      className={`overflow-hidden group relative animate-fade-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white shadow-md border border-gray-100 ${id ? 'cursor-pointer' : ''}`}
      onClick={id ? handleCardClick : undefined}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-50">
        {image && !image.includes('gradient') ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <span className="text-4xl opacity-30 text-gray-400">📅</span>
          </div>
        )}
        
        <div onClick={handleFavoriteClick}>
          <FavoriteButton 
            itemType="event"
            itemId={itemId}
            itemData={itemData}
            className="absolute top-3 right-3 z-10 opacity-70 group-hover:opacity-100 transition-opacity"
          />
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm">📅</span>
          <span className="text-sm text-gray-600 font-medium">{category}</span>
          <div className="ml-auto flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="h-3 w-3" />
            {date}
          </div>
        </div>
        
        <h3 className="font-semibold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" strokeWidth={1.5} />
            {time}
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" strokeWidth={1.5} />
            <span className="truncate">{location}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
