// Utility per estrarre il nome della località dall'indirizzo e aggiungere emoticon

const LOCATION_EMOJIS: Record<string, string> = {
  // Principali città della Romagna
  'rimini': '🏖️',
  'riccione': '🏖️',
  'cattolica': '🏖️',
  'cesenatico': '🏖️',
  'milano marittima': '🏖️',
  'cervia': '🏖️',
  'ravenna': '🏛️',
  'forlì': '🏛️',
  'cesena': '🏛️',
  'faenza': '🏛️',
  'imola': '🏛️',
  'lugo': '🏛️',
  'fusignano': '🏛️',
  'bagnacavallo': '🏛️',
  'castel bolognese': '🏛️',
  'solarolo': '🏛️',
  'cotignola': '🏛️',
  'massa lombarda': '🏛️',
  'conselice': '🏛️',
  'alfonsine': '🏛️',
  'sant\'alberto': '🏛️',
  'russi': '🏛️',
  'porto corsini': '⚓',
  'marina romea': '🏖️',
  'marina di ravenna': '🏖️',
  'lido adriano': '🏖️',
  'lido di classe': '🏖️',
  'lido di savio': '🏖️',
  'punta marina': '🏖️',
  'bellaria': '🏖️',
  'igea marina': '🏖️',
  'san mauro pascoli': '🌿',
  'savignano sul rubicone': '🌿',
  'gatteo': '🌿',
  'bagno di romagna': '🏔️',
  'santa sofia': '🏔️',
  'civitella di romagna': '🏔️',
  'galeata': '🏔️',
  'premilcuore': '🏔️',
  'portico e san benedetto': '🏔️',
  'rocca san casciano': '🏔️',
  'dovadola': '🏔️',
  'modigliana': '🏔️',
  'tredozio': '🏔️',
  'castrocaro terme': '💎',
  'terra del sole': '💎',
  'meldola': '🌿',
  'bertinoro': '🍷',
  'longiano': '🏰',
  'borghi': '🏰',
  'roncofreddo': '🌿',
  'montiano': '🌿',
  'sogliano al rubicone': '🌿',
  'mercato saraceno': '🌿',
  'sarsina': '🏛️',
  'verghereto': '🏔️',
  // Default per località non specificate
  // Default per località non specificate
  'default': '📍'
};


/**
 * Ottiene l'emoticon appropriata per una località
 * @param locationName - Il nome della località
 * @returns L'emoticon corrispondente
 */
export const getLocationEmoji = (locationName: string): string => {
  if (!locationName) return LOCATION_EMOJIS.default;
  
  const normalizedLocation = locationName.toLowerCase().trim();
  
  // Cerca una corrispondenza esatta
  if (LOCATION_EMOJIS[normalizedLocation]) {
    return LOCATION_EMOJIS[normalizedLocation];
  }
  
  // Cerca una corrispondenza parziale
  for (const [location, emoji] of Object.entries(LOCATION_EMOJIS)) {
    if (normalizedLocation.includes(location) || location.includes(normalizedLocation)) {
      return emoji;
    }
  }
  
  return LOCATION_EMOJIS.default;
};
