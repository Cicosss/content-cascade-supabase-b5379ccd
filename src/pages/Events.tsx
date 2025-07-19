
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import EmptyState from '@/components/EmptyState';
import UnifiedPOICard from '@/components/UnifiedPOICard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search, CalendarX } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Tutti' },
    { value: 'festival', label: 'Festival' },
    { value: 'gastronomia', label: 'Gastronomia' },
    { value: 'musica', label: 'Musica' },
    { value: 'mercati', label: 'Mercati' },
    { value: 'cultura', label: 'Cultura' }
  ];

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .gte('start_datetime', new Date().toISOString())
      .order('start_datetime', { ascending: true });

    if (data) {
      setEvents(data);
    }
    setLoading(false);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
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
      
      {/* Hero Section */}
      <div className="sunset-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Eventi in Romagna</h1>
          <p className="text-xl">Non perdere i migliori eventi della regione</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cerca eventi..."
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

        {/* Events Grid */}
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
        ) : filteredEvents.length === 0 ? (
          events.length === 0 ? (
            <EmptyState
              icon={CalendarX}
              title="Nessun evento in programma"
              description="Al momento non ci sono eventi futuri programmati. Controlla di nuovo presto per nuovi appuntamenti!"
              actionLabel="Torna alla Home"
              onAction={() => window.location.href = '/'}
            />
          ) : (
            <EmptyState
              icon={Search}
              title="Nessun evento trovato"
              description={hasActiveFilters 
                ? "Non ci sono eventi che corrispondono ai tuoi filtri. Prova ad allargare la ricerca per non perdere nessun appuntamento!"
                : "Non sono stati trovati eventi corrispondenti alla tua ricerca."
              }
              actionLabel={hasActiveFilters ? "Resetta i filtri" : "Vedi tutti gli eventi"}
              onAction={handleResetFilters}
            />
          )
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <UnifiedPOICard 
                key={event.id}
                id={event.id}
                name={event.name}
                category={event.category}
                description={event.description}
                images={event.images}
                avg_rating={event.avg_rating}
                price_info={event.price_info}
                duration_info={event.duration_info}
                target_audience={event.target_audience}
                address={event.address || event.location_name}
                location_name={event.location_name}
                startDatetime={event.start_datetime}
                endDatetime={event.end_datetime}
                poiType="event"
                opening_hours={event.opening_hours}
                phone={event.phone}
                website_url={event.website_url}
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

export default Events;
