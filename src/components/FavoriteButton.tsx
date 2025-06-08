
import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  itemType: 'restaurant' | 'experience' | 'event';
  itemId: string;
  itemData: any;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  itemType,
  itemId,
  itemData,
  className,
  size = 'sm'
}) => {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const favorite = isFavorite(itemType, itemId);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsProcessing(true);

    try {
      if (favorite) {
        await removeFromFavorites(itemType, itemId);
      } else {
        await addToFavorites(itemType, itemId, itemData);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        sizeClasses[size],
        'absolute top-2 right-2 rounded-full bg-white/90 hover:bg-white shadow-md transition-all duration-200',
        favorite 
          ? 'text-yellow-500 hover:text-yellow-600' 
          : 'text-gray-400 hover:text-yellow-500',
        isProcessing && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleToggleFavorite}
      disabled={isProcessing}
    >
      <Star 
        className={cn(
          iconSizes[size],
          'transition-all duration-200',
          favorite ? 'fill-current' : 'fill-none'
        )} 
      />
    </Button>
  );
};

export default FavoriteButton;
