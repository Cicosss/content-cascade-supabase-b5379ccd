
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Clock, Users, MapPin, Search, Filter } from 'lucide-react';

const Experiences = () => {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'Tutte' },
    { value: 'arte-cultura', label: 'Arte e Cultura' },
    { value: 'natura', label: 'Natura' },
    { value: 'avventura', label: 'Avventura' },
    { value: 'famiglia', label: 'Famiglia' },
    { value: 'gastronomia', label: 'Gastronomia' }
  ];

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('points_of_interest')
      .select('*')
      .eq('poi_type', 'experience')
      .order('created_at', { ascending: false });

    if (data) {
      setExperiences(data);
    }
    setLoading(false);
  };

  const filteredExperiences = experiences.filter(exp => {
    const matchesSearch = exp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exp.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || exp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <div className="hero-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Esperienze in Romagna</h1>
          <p className="text-xl">Scopri le attività più emozionanti della nostra terra</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cerca esperienze..."
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

        {/* Experiences Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-80 bg-gray-200 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiences.map((experience) => (
              <Card key={experience.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center">
                  <span className="text-white text-sm">🎯 Esperienza</span>
                </div>
                <div className="p-4">
                  {experience.category && (
                    <Badge className="mb-2">{experience.category}</Badge>
                  )}
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {experience.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {experience.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                    {experience.duration_info && (
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {experience.duration_info}
                      </div>
                    )}
                    {experience.avg_rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        {experience.avg_rating}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="h-4 w-4 mr-1" />
                    {experience.address || 'Romagna'}
                  </div>
                  {experience.price_info && (
                    <div className="mt-3 text-lg font-semibold text-blue-600">
                      {experience.price_info}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {filteredExperiences.length === 0 && !loading && (
          <Card className="p-8 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nessuna esperienza trovata
            </h3>
            <p className="text-gray-600">
              Prova a modificare i filtri di ricerca
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Experiences;
