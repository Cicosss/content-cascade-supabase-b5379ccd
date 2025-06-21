
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, Users, Calendar, MapPin, Euro, Heart, Trash2, Navigation } from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import EmptyState from './EmptyState';
import { useNavigate } from 'react-router-dom';

const FavoritesCarousel = () => {
  const { favorites, loading, removeFromFavorites } = useFavorites();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="h-80 bg-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <EmptyState
        icon={Heart}
        title="Nessun preferito ancora"
        description="Inizia a esplorare la Romagna e salva le tue esperienze preferite! Usa il cuore nelle schede per aggiungerle ai tuoi preferiti."
        actionLabel="Esplora Dashboard"
        onAction={() => navigate('/dashboard')}
      />
    );
  }

  const handleRemoveFromFavorites = async (favorite: any, e: React.MouseEvent) => {
    e.stopPropagation();
    await removeFromFavorites(favorite.item_type, favorite.item_id);
  };

  const handleCardClick = (favorite: any) => {
    if (favorite.item_type === 'poi') {
      navigate(`/poi/${favorite.item_id}`);
    } else if (favorite.item_type === 'restaurant') {
      // Navigate to restaurant detail if exists
      console.log('Navigate to restaurant:', favorite.item_id);
    } else if (favorite.item_type === 'experience') {
      // Navigate to experience detail if exists
      console.log('Navigate to experience:', favorite.item_id);
    } else if (favorite.item_type === 'event') {
      // Navigate to event detail if exists
      console.log('Navigate to event:', favorite.item_id);
    }
  };

  const renderFavoriteCard = (favorite: any) => {
    const { item_type, item_data } = favorite;

    return (
      <Card 
        key={favorite.id} 
        className="overflow-hidden cursor-pointer group relative hover:shadow-lg transition-shadow"
        onClick={() => handleCardClick(favorite)}
      >
        <div className="aspect-[4/3] relative overflow-hidden">
          {item_data.images && item_data.images.length > 0 ? (
            <img
              src={item_data.images[0]}
              alt={item_data.name || item_data.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br flex items-center justify-center ${
              item_type === 'restaurant' ? 'from-green-400 to-blue-400' :
              item_type === 'experience' ? 'from-blue-400 to-green-400' :
              item_type === 'poi' ? 'from-purple-400 to-pink-400' :
              'from-orange-400 to-red-400'
            }`}>
              <span className="text-white text-4xl">
                {item_type === 'restaurant' ? '🍽️' :
                 item_type === 'experience' ? '🎯' :
                 item_type === 'poi' ? '📍' : '🎉'}
              </span>
            </div>
          )}
          
          <Badge className="absolute top-3 left-3 bg-white/90 text-gray-900 rounded-xl">
            {item_data.category || item_data.cuisine || 'Generale'}
          </Badge>
          
          <div className="absolute top-2 right-2 bg-red-500/80 rounded-full p-1">
            <Heart className="h-3 w-3 text-white fill-current" />
          </div>
          
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-10 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            onClick={(e) => handleRemoveFromFavorites(favorite, e)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {item_data.title || item_data.name}
          </h3>
          
          {/* POI specific information */}
          {item_type === 'poi' && (
            <div className="space-y-2">
              {item_data.price_info && (
                <div className="flex items-center text-gray-600 text-sm">
                  <Euro className="h-4 w-4 mr-1" />
                  {item_data.price_info}
                </div>
              )}
              {item_data.duration_info && (
                <div className="flex items-center text-gray-600 text-sm">
                  <Clock className="h-4 w-4 mr-1" />
                  {item_data.duration_info}
                </div>
              )}
              {(item_data.location_name || item_data.address) && (
                <div className="flex items-center text-gray-500 text-sm">
                  <MapPin className="h-4 w-4 mr-1" />
                  {item_data.location_name || item_data.address}
                </div>
              )}
              {item_data.target_audience && item_data.target_audience !== 'everyone' && (
                <div className="flex items-center text-gray-500 text-sm">
                  <Users className="h-4 w-4 mr-1" />
                  {item_data.target_audience}
                </div>
              )}
            </div>
          )}
          
          {/* Restaurant specific information */}
          {item_type === 'restaurant' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  <span className="font-medium">{item_data.rating || 'N/A'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Euro className="h-4 w-4 mr-1" />
                  {item_data.priceRange || 'N/A'}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {item_data.specialty}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                {item_data.location}
              </div>
            </div>
          )}
          
          {/* Experience specific information */}
          {item_type === 'experience' && (
            <div className="space-y-2">
              <div className="flex items-center text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                <span className="font-medium">{item_data.rating || 'N/A'}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600 space-x-4">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {item_data.duration}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {item_data.groupSize}
                </div>
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {item_data.price}
              </div>
            </div>
          )}
          
          {/* Event specific information */}
          {item_type === 'event' && (
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {item_data.date}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {item_data.time}
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {item_data.location}
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {favorites.map(renderFavoriteCard)}
    </div>
  );
};

export default FavoritesCarousel;
