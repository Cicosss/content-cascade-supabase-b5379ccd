
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';
import { formatWalkingTime } from '@/utils/distanceCalculator';
import { useNavigate } from 'react-router-dom';

interface NearbyPOICardProps {
  id: string;
  name: string;
  category: string;
  distance: number;
  images?: string[];
  address?: string;
  onClick?: () => void;
}

const NearbyPOICard: React.FC<NearbyPOICardProps> = ({
  id,
  name,
  category,
  distance,
  images,
  address,
  onClick
}) => {
  const navigate = useNavigate();
  const coverImage = images && images.length > 0 ? images[0] : null;

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/poi/${id}`);
    }
  };

  return (
    <Card 
      className="overflow-hidden cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
      onClick={handleClick}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {coverImage ? (
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <span className="text-2xl opacity-50">📍</span>
          </div>
        )}
        <Badge className="absolute top-2 left-2 bg-white/90 text-gray-900 text-xs">
          {category}
        </Badge>
      </div>

      <div className="p-3">
        <h4 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {name}
        </h4>
        
        <div className="flex items-center text-xs text-gray-600 mb-1">
          <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>

        <div className="text-xs text-blue-600 font-medium">
          {formatWalkingTime(distance)}
        </div>
      </div>
    </Card>
  );
};

export default NearbyPOICard;
