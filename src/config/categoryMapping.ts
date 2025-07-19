
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

// Mapping navbar → categorie per pre-filtri intelligenti
export const NAVBAR_CATEGORY_MAPPING = {
  'Gusto & Sapori': ['Ristoranti', 'Agriturismi', 'Aziende Agricole', 'Street Food', 'Mercati Locali'],
  'Cultura & Territorio': ['Musei', 'Artigianato Locale', 'Storia e Borghi'],
  'Eventi & Spettacoli': ['Eventi'],
  'Divertimento & Famiglia': ['Parchi a Tema e Acquatici', 'Attività per Bambini', 'Fattorie Didattiche e Animali', 'Esperienze Educative', 'Vita Notturna'],
  'Natura & Avventura': ['Spiagge', 'Parchi Naturali e Riserve', 'Sport']
} as const;

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

export const getTagsForCategory = (category: string): string[] => {
  if (category === 'Eventi') {
    return [...EVENT_TAGS, ...AVAILABLE_TAGS];
  }
  if (category === 'Sport') {
    return [...SPORT_TAGS, ...AVAILABLE_TAGS];
  }
  return [...AVAILABLE_TAGS];
};
