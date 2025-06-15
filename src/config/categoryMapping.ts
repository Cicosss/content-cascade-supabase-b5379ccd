
export const MACRO_AREAS = {
  'Gusto & Sapori': {
    categories: ['Ristoranti', 'Agriturismi', 'Cantine', 'Street Food', 'Mercati']
  },
  'Cultura & Territorio': {
    categories: ['Musei', 'Borghi', 'Castelli', 'Arte', 'Artigianato']
  },
  'Eventi & Spettacoli': {
    categories: ['Concerti', 'Festival', 'Teatro', 'Cinema', 'Mostre']
  },
  'Divertimento & Famiglia': {
    categories: ['Parchi', 'Spiagge', 'Attività per Bambini', 'Sport', 'Natura']
  }
} as const;

export const AVAILABLE_TAGS = [
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

export const getCategoriesForMacroArea = (macroArea: string): string[] => {
  return MACRO_AREAS[macroArea as keyof typeof MACRO_AREAS]?.categories || [];
};

export const getAllCategories = (): string[] => {
  return Object.values(MACRO_AREAS).flatMap(area => area.categories);
};
