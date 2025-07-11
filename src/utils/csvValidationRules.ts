export const MACRO_AREA_VALUES = [
  'Gusto & Sapori',
  'Cultura & Territorio',
  'Divertimento & Famiglia',
  'Eventi & Spettacoli'
] as const;

export const CATEGORY_MAPPING: Record<string, string> = {
  // Gusto & Sapori
  'ristoranti': 'Ristoranti',
  'restaurant': 'Ristoranti', 
  'restaurants': 'Ristoranti',
  'food': 'Ristoranti',
  'dining': 'Ristoranti',
  'bar': 'Bar',
  'bars': 'Bar',
  'pub': 'Bar',
  'pubs': 'Bar',
  'wine': 'Enoteche',
  'winery': 'Enoteche',
  'wineries': 'Enoteche',
  'enoteca': 'Enoteche',
  'enoteche': 'Enoteche',
  
  // Cultura & Territorio
  'museo': 'Musei',
  'musei': 'Musei',
  'museum': 'Musei',
  'museums': 'Musei',
  'arte': 'Arte',
  'art': 'Arte',
  'gallery': 'Arte',
  'galleria': 'Arte',
  'chiesa': 'Chiese',
  'chiese': 'Chiese',
  'church': 'Chiese',
  'churches': 'Chiese',
  'monument': 'Monumenti',
  'monumento': 'Monumenti',
  'monumenti': 'Monumenti',
  
  // Divertimento & Famiglia
  'sport': 'Sport',
  'sports': 'Sport',
  'beach': 'Spiagge',
  'beaches': 'Spiagge',
  'spiaggia': 'Spiagge',
  'spiagge': 'Spiagge',
  'park': 'Parchi',
  'parks': 'Parchi',
  'parco': 'Parchi',
  'parchi': 'Parchi',
  'activity': 'Attività',
  'activities': 'Attività',
  'attività': 'Attività',
  
  // Eventi & Spettacoli
  'evento': 'Concerti',
  'eventi': 'Concerti',
  'event': 'Concerti',
  'events': 'Concerti',
  'concerto': 'Concerti',
  'concerti': 'Concerti',
  'concert': 'Concerti',
  'concerts': 'Concerti',
  'show': 'Spettacoli',
  'shows': 'Spettacoli',
  'spettacolo': 'Spettacoli',
  'spettacoli': 'Spettacoli',
  'theater': 'Teatro',
  'theatre': 'Teatro',
  'teatro': 'Teatro'
};

export const POI_TYPE_VALUES = ['place', 'experience'] as const;

export const TARGET_AUDIENCE_VALUES = [
  'everyone', 
  'families', 
  'adults', 
  'children', 
  'teenagers',
  'seniors'
] as const;

export const validateMacroArea = (value: string): string => {
  if (!value) return 'Gusto & Sapori'; // Default
  
  const normalized = value.trim();
  if (MACRO_AREA_VALUES.includes(normalized as any)) {
    return normalized;
  }
  
  // Try to match by keywords
  const lower = normalized.toLowerCase();
  if (lower.includes('food') || lower.includes('ristoran') || lower.includes('sapor')) {
    return 'Gusto & Sapori';
  }
  if (lower.includes('cultur') || lower.includes('museo') || lower.includes('arte') || lower.includes('territori')) {
    return 'Cultura & Territorio';
  }
  if (lower.includes('divertimento') || lower.includes('famiglia') || lower.includes('sport') || lower.includes('spiaggia')) {
    return 'Divertimento & Famiglia';
  }
  if (lower.includes('event') || lower.includes('concerto') || lower.includes('spettacol')) {
    return 'Eventi & Spettacoli';
  }
  
  return 'Gusto & Sapori'; // Default fallback
};

export const validateCategory = (value: string, macroArea: string): string => {
  if (!value) {
    // Return default based on macro_area
    switch (macroArea) {
      case 'Gusto & Sapori': return 'Ristoranti';
      case 'Cultura & Territorio': return 'Musei';
      case 'Divertimento & Famiglia': return 'Sport';
      case 'Eventi & Spettacoli': return 'Concerti';
      default: return 'Ristoranti';
    }
  }
  
  const normalized = value.trim().toLowerCase();
  const mapped = CATEGORY_MAPPING[normalized];
  
  if (mapped) return mapped;
  
  // If no mapping found, capitalize first letter
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
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