
import { useState, useEffect } from 'react';
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

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    setLoading(true);
    try {
      console.log('Fetching favorites for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching favorites:', error);
        throw error;
      }
      
      console.log('Fetched favorites:', data);
      
      // Cast the data to our expected type
      const typedFavorites = (data || []).map(item => ({
        ...item,
        item_type: item.item_type as 'restaurant' | 'experience' | 'event' | 'poi'
      }));
      
      setFavorites(typedFavorites);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Errore nel caricamento dei preferiti');
    } finally {
      setLoading(false);
    }
  };

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
      console.log('Item data:', itemData);
      
      const favoriteData = {
        user_id: user.id,
        item_type: itemType,
        item_id: itemId,
        item_data: itemData
      };
      
      console.log('Inserting favorite data:', favoriteData);

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

  return {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    refetch: fetchFavorites
  };
};
