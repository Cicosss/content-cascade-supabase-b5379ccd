
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

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isToggling) return;
    
    setIsToggling(true);
    try {
      console.log('Toggling favorite for:', { itemType, itemId, favoriteState });
      
      if (favoriteState) {
        const success = await removeFromFavorites(itemType, itemId);
        console.log('Remove result:', success);
      } else {
        const success = await addToFavorites(itemType, itemId, itemData || {});
        console.log('Add result:', success);
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
    lg: "w-14 h-14" // Increased size for better prominence
  };

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-7 w-7" // Larger icon for better visibility
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isToggling}
      className={cn(
        `${sizeClasses[size]} rounded-full bg-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105`,
        favoriteState && "bg-red-50/90 border-red-200/50 hover:bg-red-100/90 shadow-red-200/30",
        className
      )}
      title={favoriteState ? "Rimuovi dai preferiti" : "Aggiungi ai preferiti"}
    >
      <Heart 
        className={cn(
          `${iconSizes[size]} transition-all duration-300`,
          favoriteState 
            ? "fill-red-500 text-red-500 scale-110" 
            : "text-gray-600 hover:text-red-500 hover:scale-110"
        )} 
      />
    </Button>
  );
};

export default FavoriteButton;
