
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  itemId: string;
  itemType: 'experience' | 'restaurant' | 'event' | 'poi';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  itemId, 
  itemType, 
  className 
}) => {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const [isToggling, setIsToggling] = useState(false);
  const favoriteState = isFavorite(itemId, itemType);

  const handleToggle = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      if (favoriteState) {
        await removeFavorite(itemId, itemType);
      } else {
        await addFavorite(itemId, itemType);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isToggling}
      className={cn(
        "w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/90 transition-all duration-200",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-colors duration-200",
          favoriteState 
            ? "fill-red-500 text-red-500" 
            : "text-gray-600 hover:text-red-500"
        )} 
      />
    </Button>
  );
};

export default FavoriteButton;
