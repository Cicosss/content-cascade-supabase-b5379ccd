import { OFFICIAL_CATEGORIES } from '@/config/categoryMapping';

export const POI_TYPE_VALUES = ['place', 'experience'] as const;

export const TARGET_AUDIENCE_VALUES = [
  'everyone', 
  'families', 
  'adults', 
  'children', 
  'teenagers',
  'seniors'
] as const;

export const validateCategory = (value: string): string => {
  if (!value) return 'Ristoranti'; // Default category
  
  const normalized = value.trim();
  
  // Check if it's already a valid category
  if (OFFICIAL_CATEGORIES.includes(normalized as any)) {
    return normalized;
  }
  
  // Simple mapping for common variations
  const categoryMapping: Record<string, string> = {
    'ristoranti': 'Ristoranti',
    'restaurant': 'Ristoranti', 
    'restaurants': 'Ristoranti',
    'food': 'Ristoranti',
    'dining': 'Ristoranti',
    'museo': 'Musei',
    'musei': 'Musei',
    'museum': 'Musei',
    'museums': 'Musei',
    'arte': 'Musei',
    'art': 'Musei',
    'gallery': 'Musei',
    'galleria': 'Musei',
    'sport': 'Sport',
    'sports': 'Sport',
    'beach': 'Spiagge',
    'beaches': 'Spiagge',
    'spiaggia': 'Spiagge',
    'spiagge': 'Spiagge',
    'park': 'Parchi Naturali e Riserve',
    'parks': 'Parchi Naturali e Riserve',
    'parco': 'Parchi Naturali e Riserve',
    'parchi': 'Parchi Naturali e Riserve',
    'evento': 'Eventi',
    'eventi': 'Eventi',
    'event': 'Eventi',
    'events': 'Eventi',
    'concerto': 'Eventi',
    'concerti': 'Eventi',
    'concert': 'Eventi',
    'concerts': 'Eventi'
  };
  
  const lower = normalized.toLowerCase();
  const mapped = categoryMapping[lower];
  
  if (mapped) return mapped;
  
  // If no mapping found, return the first valid category as fallback
  return 'Ristoranti';
};

export const validatePoiType = (value: string): string => {
  if (!value) return 'place';
  
  const normalized = value.trim().toLowerCase();
  if (POI_TYPE_VALUES.includes(normalized as any)) {
    return normalized;
  }
  
  // Try to map common variations
  if (normalized.includes('event') || normalized.includes('experience') || normalized.includes('esperienza')) {
    return 'experience';
  }
  
  return 'place'; // Default
};

export const validateTargetAudience = (value: string): string => {
  if (!value) return 'everyone';
  
  const normalized = value.trim().toLowerCase();
  if (TARGET_AUDIENCE_VALUES.includes(normalized as any)) {
    return normalized;
  }
  
  // Try to map common variations
  if (normalized.includes('tutti') || normalized.includes('all')) return 'everyone';
  if (normalized.includes('famiglia') || normalized.includes('family')) return 'families';
  if (normalized.includes('adult') || normalized.includes('adulti')) return 'adults';
  if (normalized.includes('bambin') || normalized.includes('child')) return 'children';
  if (normalized.includes('teen') || normalized.includes('adolescent')) return 'teenagers';
  if (normalized.includes('senior') || normalized.includes('anzian')) return 'seniors';
  
  return 'everyone'; // Default
};