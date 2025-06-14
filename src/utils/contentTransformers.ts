
export const transformPoisToRestaurants = (pois: any[]) => {
  return pois
    .filter(poi => poi.poi_type === 'restaurant' || poi.category === 'cibo')
    .map(poi => ({
      name: poi.name,
      cuisine: poi.description || 'Cucina Locale',
      rating: poi.avg_rating || 4.5,
      priceRange: poi.price_info || '€€',
      location: poi.address || 'Romagna',
      image: poi.images?.[0] || '🍝',
      specialty: poi.description
    }));
};

export const transformPoisToExperiences = (pois: any[]) => {
  return pois
    .filter(poi => poi.poi_type === 'experience' || 
                  ['sport', 'arte e cultura', 'parchi e natura', 'intrattenimento'].includes(poi.category))
    .map(poi => ({
      title: poi.name,
      image: poi.images?.[0] || '🎭',
      rating: poi.avg_rating || 4.5,
      duration: poi.duration_info || '2h',
      groupSize: 'Max 15 persone',
      price: poi.price_info || '€25',
      category: poi.category || 'Esperienza'
    }));
};

export const transformEventsToCards = (events: any[]) => {
  return events.map(event => ({
    title: event.name,
    date: new Date(event.start_datetime).toLocaleDateString('it-IT'),
    time: new Date(event.start_datetime).toLocaleTimeString('it-IT', { 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    location: event.location_name || event.address || 'Romagna',
    category: event.category || 'Evento',
    image: event.images?.[0] || '🎉'
  }));
};
