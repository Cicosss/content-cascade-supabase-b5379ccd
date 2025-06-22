
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
    e.stopPropagation(); // Prevent card click when clicking favorite button
  };

  return (
    <Card 
      className={`overflow-hidden group relative animate-fade-in hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${id ? 'cursor-pointer' : ''}`}
      onClick={id ? handleCardClick : undefined}
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center">
          <span className="text-white text-sm">{image}</span>
        </div>
        
        {/* Badge distintivo per eventi */}
        <Badge className="absolute top-3 left-3 bg-green-600 text-white rounded-xl flex items-center gap-1">
          <Calendar className="h-3 w-3" />
          {date}
        </Badge>
        
        <Badge className="absolute top-3 right-12 bg-white/90 text-gray-900 rounded-xl">
          {category}
        </Badge>
        
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
