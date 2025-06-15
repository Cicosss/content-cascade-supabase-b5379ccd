
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import EmptyState from '@/components/EmptyState';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, MapPin, Search, Phone, Globe, ChefHat, RotateCcw } from 'lucide-react';

interface Restaurant {
  id: string;
  name: string;
  description: string;
  macro_area: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  price_info: string;
  duration_info: string;
  target_audience: string;
  images: string[];
  video_url: string;
  phone: string;
  email: string;
  avg_rating: number;
  status: string;
  created_at: string;
  updated_at: string;
  tags: string[];
}

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Tutti' },
    { value: 'Ristoranti', label: 'Ristoranti' },
    { value: 'Agriturismi', label: 'Agriturismi' },
    { value: 'Cantine', label: 'Cantine' },
    { value: 'Street Food', label: 'Street Food' },
    { value: 'Mercati', label: 'Mercati' }
  ];

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
      
      <div className="romagna-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Ristoranti in Romagna</h1>
          <p className="text-xl">Assapora i sapori autentici della nostra tradizione</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cerca ristoranti..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-80 bg-gray-200 animate-pulse" />
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Card key={restaurant.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[4/3] bg-gradient-to-br from-green-400 to-blue-400 flex items-center justify-center">
                  <span className="text-white text-sm">🍽️ {restaurant.category}</span>
                </div>
                <div className="p-4">
                  {restaurant.category && (
                    <Badge className="mb-2">{restaurant.category}</Badge>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {restaurant.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-3">
                    {restaurant.avg_rating > 0 && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm font-medium">{restaurant.avg_rating}</span>
                      </div>
                    )}
                    {restaurant.price_info && (
                      <div className="text-sm font-medium text-green-600">
                        {restaurant.price_info}
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {restaurant.address || 'Romagna'}
                    </div>
                    {restaurant.phone && (
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2" />
                        {restaurant.phone}
                      </div>
                    )}
                    {restaurant.video_url && (
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2" />
                        <a href={restaurant.video_url} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline">
                          Visita sito
                        </a>
                      </div>
                    )}
                  </div>

                  {restaurant.tags && restaurant.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {restaurant.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
