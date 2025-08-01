
import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface FavoriteItem {
  id: string;
  item_type: 'restaurant' | 'experience' | 'event' | 'poi';
  item_id: string;
  item_data: any;
  created_at: string;
}

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Refs to prevent infinite loops and manage state
  const isFetchingRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // Stable fetch function with error recovery
  const fetchFavorites = useCallback(async (userId: string, isRetry = false) => {
    // Prevent concurrent fetches
    if (isFetchingRef.current && !isRetry) {
      return;
    }

    // Circuit breaker - stop after too many failures
    if (retryCountRef.current >= maxRetries) {
      console.log('Max retries reached for favorites fetch');
      return;
    }

    isFetchingRef.current = true;
    setLoading(true);

    try {
      console.log('Fetching favorites for user:', userId);
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }
      
      console.log('Successfully fetched favorites:', data?.length || 0);
      
      // Cast the data to our expected type
      const typedFavorites = (data || []).map(item => ({
        ...item,
        item_type: item.item_type as 'restaurant' | 'experience' | 'event' | 'poi'
      }));
      
      setFavorites(typedFavorites);
      retryCountRef.current = 0; // Reset retry count on success
      
    } catch (error) {
      console.error('Error fetching favorites:', error);
      retryCountRef.current += 1;
      
      // Only show toast error if it's not a network error and we've exhausted retries
      if (retryCountRef.current >= maxRetries) {
        toast.error('Errore nel caricamento dei preferiti');
      }
      
      // Exponential backoff retry for network errors
      if (retryCountRef.current < maxRetries && error instanceof Error && 
          (error.message.includes('Failed to fetch') || error.message.includes('network'))) {
        const delay = Math.pow(2, retryCountRef.current) * 1000; // 1s, 2s, 4s
        setTimeout(() => {
          fetchFavorites(userId, true);
        }, delay);
      }
    } finally {
      isFetchingRef.current = false;
      setLoading(false);
    }
  }, []);

  // Stable useEffect with user.id dependency instead of user object
  useEffect(() => {
    const userId = user?.id;
    
    // Only fetch if user exists and changed
    if (userId && userId !== lastUserIdRef.current) {
      lastUserIdRef.current = userId;
      retryCountRef.current = 0; // Reset retry count for new user
      fetchFavorites(userId);
    } else if (!userId) {
      // Clear favorites when user logs out
      setFavorites([]);
      lastUserIdRef.current = null;
      retryCountRef.current = 0;
    }
  }, [user?.id, fetchFavorites]); // Stable dependency on user.id only

  const addToFavorites = async (
    itemType: 'restaurant' | 'experience' | 'event' | 'poi',
    itemId: string,
    itemData: any
  ) => {
    if (!user) {
      toast.error('Devi effettuare l\'accesso per salvare i preferiti');
      return false;
    }

    try {
      console.log('Adding to favorites:', { itemType, itemId, user: user.id });
      
      const favoriteData = {
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
        item_data: itemData
      };

      const { data, error } = await supabase
        .from('user_favorites')
        .insert(favoriteData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error adding favorite:', error);
        
        if (error.code === '23505') {
          toast.error('Questo elemento è già nei tuoi preferiti');
          return false;
        }
        
        toast.error(`Errore nel salvare: ${error.message}`);
        throw error;
      }

      console.log('Successfully added favorite:', data);

      // Update local state with the returned data
      if (data) {
        const newFavorite: FavoriteItem = {
          id: data.id,
          item_type: itemType,
          item_id: itemId,
          item_data: itemData,
          created_at: data.created_at
        };

        setFavorites(prev => [newFavorite, ...prev]);
      }

      toast.success('✨ Salvato nei preferiti!', {
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return false;
    }
  };

  const removeFromFavorites = async (itemType: string, itemId: string) => {
    if (!user) return false;

    try {
      console.log('Removing favorite:', { itemType, itemId, user: user.id });
      
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('item_type', itemType)
        .eq('item_id', itemId);

      if (error) {
        console.error('Error removing favorite:', error);
        toast.error(`Errore nella rimozione: ${error.message}`);
        throw error;
      }

      console.log('Successfully removed favorite');

      setFavorites(prev => prev.filter(
        fav => !(fav.item_type === itemType && fav.item_id === itemId)
      ));

      toast.success('Rimosso dai preferiti');
      return true;
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return false;
    }
  };

  const isFavorite = (itemType: string, itemId: string) => {
    return favorites.some(fav => fav.item_type === itemType && fav.item_id === itemId);
  };

  // Manual refetch function
  const refetch = useCallback(() => {
    if (user?.id) {
      retryCountRef.current = 0; // Reset retry count
      fetchFavorites(user.id);
    }
  }, [user?.id, fetchFavorites]);

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refetch
  };
};
