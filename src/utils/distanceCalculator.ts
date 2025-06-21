
interface Coordinates {
  latitude: number;
  longitude: number;
}

export const calculateDistance = (point1: Coordinates, point2: Coordinates): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (point2.latitude - point1.latitude) * Math.PI / 180;
  const dLon = (point2.longitude - point1.longitude) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(point1.latitude * Math.PI / 180) * Math.cos(point2.latitude * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance;
};

export const formatWalkingTime = (distanceKm: number): string => {
  // Assuming walking speed of 5 km/h
  const walkingMinutes = Math.round((distanceKm / 5) * 60);
  
  if (walkingMinutes <= 1) {
    return 'A 1 minuto a piedi';
  } else if (walkingMinutes <= 5) {
    return `A ${walkingMinutes} minuti a piedi`;
  } else if (walkingMinutes <= 15) {
    return `A ${walkingMinutes} minuti a piedi`;
  } else {
    return `A ${Math.round(distanceKm * 10) / 10} km`;
  }
};
