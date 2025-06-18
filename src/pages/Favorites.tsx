import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';
import FavoritesCarousel from '@/components/FavoritesCarousel';

const Favorites = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p>Devi effettuare l'accesso per vedere i tuoi preferiti.</p>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={true}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center mb-8">
            <Heart className="h-8 w-8 mr-4 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">I Miei Preferiti</h1>
              <p className="text-gray-600 mt-1">Le tue esperienze salvate in Romagna</p>
            </div>
          </div>

          <FavoritesCarousel />
        </div>
      </div>
    </Layout>
  );
};

export default Favorites;
