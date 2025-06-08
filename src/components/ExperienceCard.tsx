
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, Users } from 'lucide-react';
import FavoriteButton from './FavoriteButton';

interface ExperienceCardProps {
  title: string;
  image: string;
  rating: number;
  duration: string;
  groupSize: string;
  price: string;
  category: string;
}

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  image,
  rating,
  duration,
  groupSize,
  price,
  category
}) => {
  const itemId = `${title}-${category}`.toLowerCase().replace(/\s+/g, '-');
  const itemData = {
    title,
    image,
    rating,
    duration,
    groupSize,
    price,
    category
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group relative">
      <div className="aspect-[4/3] relative overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
          <span className="text-white text-sm">{image}</span>
        </div>
        <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900">
          {category}
        </Badge>
        <FavoriteButton 
          itemType="experience"
          itemId={itemId}
          itemData={itemData}
        />
      </div>
      
      <div className="p-4">
        <div className="flex items-center mb-2">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {duration}
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            {groupSize}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-900">
            {price}
          </div>
          <div className="text-sm text-gray-500">
            a persona
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExperienceCard;
