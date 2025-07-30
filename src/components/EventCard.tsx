
import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';

interface EventCardProps {
  id?: string;
  title: string;
  date: string;
  time: string;
  location_name: string;
  category: string;
  image: string;
}

const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  date,
  time,
  location_name,
  category,
  image
}) => {
  const navigate = useNavigate();
  const { isMobile, getTouchTargetClasses, getMobileTypography } = useMobileOptimization();
  
  const itemId = `${title}-${date}`.toLowerCase().replace(/\s+/g, '-');
  const itemData = {
    title,
    date,
    time,
    location_name,
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
      className={`bg-card border border-border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group overflow-hidden ${getTouchTargetClasses()}`}
      onClick={id ? handleCardClick : undefined}
    >
      <div className={`${isMobile ? 'aspect-[3/2]' : 'aspect-[4/3]'} relative overflow-hidden bg-muted`}>
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Calendar className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`} />
          </div>
        )}
        
        <div onClick={handleFavoriteClick}>
          <FavoriteButton 
            itemType="event"
            itemId={itemId}
            itemData={itemData}
            className={`absolute ${isMobile ? 'top-2 right-2' : 'top-3 right-3'} z-10 opacity-70 group-hover:opacity-100 transition-opacity`}
          />
        </div>
      </div>
      
      <div className={`${isMobile ? 'p-3' : 'p-4'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className={`${getMobileTypography('text-sm')} text-muted-foreground`}>{category}</span>
        </div>

        <h3 className={`font-semibold ${getMobileTypography('text-lg')} ${isMobile ? 'mb-2' : 'mb-3'} line-clamp-2 text-foreground group-hover:text-primary transition-colors`}>
          {title}
        </h3>
        
        <div className={`space-y-${isMobile ? '1' : '2'} ${getMobileTypography('text-sm')} text-muted-foreground`}>
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground/70" />
            <span className="truncate">{date}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground/70" />
            <span className="truncate">{time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-muted-foreground/70" />
            <span className="truncate">{location_name}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EventCard;
