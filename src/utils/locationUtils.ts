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
 * Estrae il nome della località da un indirizzo completo
 * @param address - L'indirizzo completo
 * @returns Il nome della località estratto
 */
export const extractLocationName = (address: string): string => {
  if (!address) return '';
  
  // Rimuove il numero civico e prende la parte principale
  const cleanAddress = address.replace(/^\d+\s*,?\s*/, '');
  
  // Divide per virgole e prende il primo elemento significativo
  const parts = cleanAddress.split(',').map(part => part.trim());
  
  // Se il primo elemento è una via/strada, prende il secondo
  const streetKeywords = ['via', 'strada', 'piazza', 'corso', 'viale', 'largo', 'vicolo'];
  let locationPart = parts[0];
  
  if (streetKeywords.some(keyword => 
    locationPart.toLowerCase().startsWith(keyword)
  )) {
    locationPart = parts[1] || parts[0];
  }
  
  // Rimuove eventuali codici postali e province
  locationPart = locationPart.replace(/\d{5}/, '').trim();
  locationPart = locationPart.replace(/\([A-Z]{2}\)/, '').trim();
  
  return locationPart || parts[0] || address;
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

/**
 * Formatta una località con nome ed emoticon
 * @param address - L'indirizzo completo
 * @returns La località formattata con emoticon
 */
export const formatLocationWithEmoji = (address: string): string => {
  if (!address) return '';
  
  const locationName = extractLocationName(address);
  const emoji = getLocationEmoji(locationName);
  
  return `${locationName} ${emoji}`;
};