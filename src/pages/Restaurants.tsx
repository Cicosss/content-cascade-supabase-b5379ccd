
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import EmptyState from '@/components/EmptyState';
import RestaurantsHero from '@/components/restaurants/RestaurantsHero';
import RestaurantFilters from '@/components/restaurants/RestaurantFilters';
import UnifiedPOICard from '@/components/UnifiedPOICard';
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
    try {
      // @ts-ignore - Workaround for Supabase TypeScript issue
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .eq('macro_area', 'Gusto & Sapori')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setRestaurants(data as Restaurant[]);
      }
    } catch (error) {
      console.error('Error fetching restaurants:', error);
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
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <RestaurantsHero />

      <div className="container mx-auto px-4 py-8">
        <RestaurantFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <UnifiedPOICard 
                key={i}
                id=""
                name=""
                category=""
                isLoading={true}
              />
            ))}
          </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <UnifiedPOICard 
                key={restaurant.id}
                id={restaurant.id}
                name={restaurant.name}
                category={restaurant.category}
                description={restaurant.description}
                images={restaurant.images}
                avg_rating={restaurant.avg_rating}
                price_info={restaurant.price_info}
                duration_info={restaurant.duration_info}
                target_audience={restaurant.target_audience}
                address={restaurant.address}
                phone={restaurant.phone}
                website_url={restaurant.website_url}
                opening_hours={restaurant.opening_hours}
                poiType="place"
                isLoading={false}
              />
            ))}
          </div>
        )}
        </div>
      </div>
    </Layout>
  );
};

export default Restaurants;
