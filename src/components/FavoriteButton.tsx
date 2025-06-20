
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  itemId: string;
  itemType: 'experience' | 'restaurant' | 'event' | 'poi';
  itemData?: any;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  itemId, 
  itemType, 
  itemData,
  className,
  size = 'sm'
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [isToggling, setIsToggling] = useState(false);
  const favoriteState = isFavorite(itemType, itemId);

  const handleToggle = async () => {
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      if (favoriteState) {
        await removeFromFavorites(itemType, itemId);
      } else {
        await addToFavorites(itemType, itemId, itemData || {});
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12"
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isToggling}
      className={cn(
        `${sizeClasses[size]} rounded-full bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/90 transition-all duration-200`,
        className
      )}
    >
      <Heart 
        className={cn(
          `${iconSizes[size]} transition-colors duration-200`,
          favoriteState 
            ? "fill-red-500 text-red-500" 
            : "text-gray-600 hover:text-red-500"
        )} 
      />
    </Button>
  );
};

export default FavoriteButton;
