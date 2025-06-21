
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import RestaurantsHero from '@/components/restaurants/RestaurantsHero';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import RestaurantGrid from '@/components/restaurants/RestaurantGrid';
import { Search, ChefHat } from 'lucide-react';
import { Restaurant } from '@/types/restaurant';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('points_of_interest')
      .select('*')
      .eq('macro_area', 'Gusto & Sapori')
      .order('created_at', { ascending: false });

    if (data) {
      setRestaurants(data);
    }
    setLoading(false);
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || restaurant.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  const hasActiveFilters = searchTerm.trim() !== '' || selectedCategory !== 'all';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <RestaurantsHero />

      <div className="container mx-auto px-4 py-8">
        <RestaurantFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />

        {loading ? (
          <RestaurantGrid restaurants={[]} loading={true} />
        ) : filteredRestaurants.length === 0 ? (
          restaurants.length === 0 ? (
            <EmptyState
              icon={ChefHat}
              title="Nessun ristorante disponibile"
              description="Al momento non ci sono ristoranti nel nostro database. Stiamo raccogliendo i migliori locali della Romagna!"
              actionLabel="Torna alla Home"
              onAction={() => window.location.href = '/'}
            />
          ) : (
            <EmptyState
              icon={Search}
              title="Nessun ristorante trovato"
              description={hasActiveFilters 
                ? "Non ci sono ristoranti che corrispondono ai tuoi filtri. Prova ad allargare la ricerca per scoprire nuovi sapori!"
                : "Non sono stati trovati ristoranti corrispondenti alla tua ricerca."
              }
              actionLabel={hasActiveFilters ? "Resetta i filtri" : "Esplora tutti"}
              onAction={handleResetFilters}
            />
          )
        ) : (
          <RestaurantGrid restaurants={filteredRestaurants} loading={false} />
        )}
      </div>
    </div>
  );
};

export default Restaurants;
