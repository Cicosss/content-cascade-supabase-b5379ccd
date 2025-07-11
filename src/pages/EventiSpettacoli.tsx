
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Euro, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getCategoriesForNavbar } from '@/config/categoryMapping';

interface POI {
  id: string;
  name: string;
  description: string;
  category: string;
  address: string;
  price_info: string;
  duration_info: string;
  target_audience: string;
  tags: string[];
  images: string[];
  start_datetime: string;
  end_datetime: string;
}

const EventiSpettacoli = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [pois, setPois] = useState<POI[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('tutte');

  const categories = getCategoriesForNavbar('Eventi & Spettacoli');

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    fetchPOIs();
  }, [selectedCategory]);

  const fetchPOIs = async () => {
    try {
      let query = supabase
        .from('points_of_interest')
        .select('*')
        .in('category', selectedCategory === 'tutte' ? categories : [selectedCategory]);

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching POIs:', error);
        return;
      }

      setPois(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Caricamento...</div>
      </div>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">🎭 Eventi & Spettacoli</h1>
          <p className="text-xl text-purple-100">
            Vivi le emozioni degli eventi culturali e degli spettacoli del territorio
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filtri Categoria */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Filtra per Categoria</h2>
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={selectedCategory === 'tutte' ? 'default' : 'outline'}
              className="cursor-pointer px-4 py-2"
              onClick={() => setSelectedCategory('tutte')}
            >
              Tutte
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className="cursor-pointer px-4 py-2"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Risultati */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-lg">Caricamento eventi...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pois.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500">Nessun evento trovato per questa categoria</p>
              </div>
            ) : (
              pois.map((poi) => (
                <Card key={poi.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{poi.name}</CardTitle>
                      <Badge variant="secondary">{poi.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {poi.description && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {poi.description}
                      </p>
                    )}
                    
                    <div className="space-y-2 text-sm">
                      {poi.start_datetime && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span>{new Date(poi.start_datetime).toLocaleDateString('it-IT')}</span>
                        </div>
                      )}
                      
                      {poi.address && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          <span>{poi.address}</span>
                        </div>
                      )}
                      
                      {poi.price_info && (
                        <div className="flex items-center gap-2">
                          <Euro className="h-4 w-4 text-gray-500" />
                          <span>{poi.price_info}</span>
                        </div>
                      )}
                      
                      {poi.duration_info && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>{poi.duration_info}</span>
                        </div>
                      )}
                    </div>

                    {poi.tags && poi.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {poi.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {poi.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{poi.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EventiSpettacoli;
