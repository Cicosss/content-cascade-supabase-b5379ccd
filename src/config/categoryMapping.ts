
// Architettura a 2 livelli: 17 Categorie Ufficiali + Tag
export const OFFICIAL_CATEGORIES = [
  // Gusto & Sapori (5)
  'Ristoranti',
  'Agriturismi', 
  'Aziende Agricole',
  'Street Food',
  'Mercati Locali',
  
  // Cultura & Territorio (3)
  'Musei',
  'Artigianato Locale',
  'Storia e Borghi',
  
  // Eventi (1)
  'Eventi',
  
  // Natura & Avventura (3)
  'Spiagge',
  'Parchi Naturali e Riserve',
  'Sport',
  
  // Divertimento & Famiglia (5)
  'Parchi a Tema e Acquatici',
  'Attività per Bambini',
  'Fattorie Didattiche e Animali',
  'Esperienze Educative',
  'Vita Notturna'
] as const;

// Mapping navbar → categorie per pre-filtri intelligenti (basato sui dati reali del DB)
export const NAVBAR_CATEGORY_MAPPING: Record<string, string[]> = {
  'Gusto & Sapori': ['Ristoranti', 'Agriturismi', 'Aziende Agricole', 'Mercati Locali'],
  'Eventi': ['Eventi'],
  'Eventi & Spettacoli': ['Eventi'], // Solo eventi dalla events table
  'Natura & Avventura': ['Spiagge', 'Parchi Naturali e Riserve', 'Sport'],
  'Divertimento & Famiglia': ['Parchi a Tema e Acquatici', 'Attività per Bambini', 'Fattorie Didattiche e Animali', 'Sport'],
  'Cultura & Territorio': ['Musei', 'Artigianato Locale', 'Storia e Borghi'] // Categorie reali disponibili
};

// UNIFIED FILTER MAPPING - Replaces poiCategoryMapping.ts logic
export const FILTER_TO_CATEGORY_MAPPING: Record<string, string[]> = {
  'cibo': ['Ristoranti', 'Agriturismi', 'Aziende Agricole', 'Street Food', 'Mercati Locali'],
  'arte e cultura': ['Musei', 'Storia e Borghi', 'Artigianato Locale'],
  'parchi e natura': ['Parchi Naturali e Riserve', 'Spiagge', 'Sport'],
  'divertimento': ['Eventi', 'Vita Notturna', 'Parchi a Tema e Acquatici', 'Attività per Bambini'],
  'sport': ['Sport'],
  'shopping': ['Mercati Locali'],
  'vita notturna': ['Vita Notturna']
};

export const AVAILABLE_TAGS = [
  // Tag universali
  'Pet-Friendly',
  'Accessibile',
  'Adatto ai bambini',
  'Romantico',
  'Opzioni Vegetariane',
  'Gratuito',
  'All\'aperto',
  'Al coperto',
  'Prenotazione richiesta',
  'Parcheggio disponibile'
] as const;

// Tag specifici per Eventi
export const EVENT_TAGS = [
  'Musica / Concerto',
  'Sagra / Festa',
  'Teatro / Spettacolo',
  'Cinema',
  'Mostra / Arte',
  'Cultura / Incontro',
  'Community'
] as const;

// Tag specifici per Sport
export const SPORT_TAGS = [
  'Percorsi Ciclabili',
  'Trekking',
  'Sport Acquatici'
] as const;

export const getAllCategories = (): string[] => {
  return [...OFFICIAL_CATEGORIES];
};

export const getCategoriesForNavbar = (navbarItem: string): string[] => {
  return [...(NAVBAR_CATEGORY_MAPPING[navbarItem as keyof typeof NAVBAR_CATEGORY_MAPPING] || [])];
};

// UNIFIED FILTER PROCESSING - Replaces poiCategoryMapping.ts getCategoriesForFilters
export const getCategoriesForFilters = (activityTypes: string[]): string[] => {
  console.log('🏷️ [UNIFIED] getCategoriesForFilters called with:', activityTypes);
  
  // If "tutto" or "tutte" is selected, return empty array to show all categories
  if (activityTypes.includes('tutto') || activityTypes.includes('tutte') || activityTypes.length === 0) {
    console.log('🌍 [UNIFIED] Returning empty array for all categories');
    return [];
  }

  const categories: string[] = [];
  const unmappedTypes: string[] = [];
  
  activityTypes.forEach(filterType => {
    const mappedCategories = FILTER_TO_CATEGORY_MAPPING[filterType.toLowerCase()];
    if (mappedCategories) {
      categories.push(...mappedCategories);
      console.log(`🎯 [UNIFIED] Added categories for ${filterType}:`, mappedCategories);
    } else {
      unmappedTypes.push(filterType);
      // Fallback: use the filter type as category name (capitalized)
      const fallbackCategory = filterType.charAt(0).toUpperCase() + filterType.slice(1);
      categories.push(fallbackCategory);
      console.log(`⚠️ [UNIFIED] No mapping found for filter type: ${filterType}, using fallback: ${fallbackCategory}`);
    }
  });

  if (unmappedTypes.length > 0) {
    console.warn('🔧 [UNIFIED] Consider updating FILTER_TO_CATEGORY_MAPPING for:', unmappedTypes);
  }

  console.log('🏷️ [UNIFIED] Final categories array:', categories);
  return [...new Set(categories)]; // Remove duplicates
};

export const getTagsForCategory = (category: string): string[] => {
  if (category === 'Eventi') {
    return [...EVENT_TAGS, ...AVAILABLE_TAGS];
  }
  if (category === 'Sport') {
    return [...SPORT_TAGS, ...AVAILABLE_TAGS];
  }
  return [...AVAILABLE_TAGS];
};
