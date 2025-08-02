
export const POI_CATEGORY_MAPPING: { [key: string]: string[] } = {
  'cibo': ['Ristoranti', 'Agriturismi', 'Cantine', 'Street Food', 'Mercati', 'Mercati Locali', 'Aziende Agricole'],
  'arte e cultura': ['Musei', 'Borghi', 'Castelli', 'Arte', 'Artigianato', 'Mostre'],
  'parchi e natura': ['Parchi', 'Spiagge', 'Attività per Bambini', 'Sport', 'Natura', 'Parchi Naturali e Riserve'],
  'divertimento': ['Concerti', 'Festival', 'Teatro', 'Cinema', 'Eventi'],
  'sport': ['Sport'],
  'shopping': ['shopping'],
  'vita notturna': ['vita notturna']
};

export const getCategoriesForFilters = (activityTypes: string[]): string[] => {
  console.log('🏷️ getCategoriesForFilters called with:', activityTypes);
  
  // If "tutto" or "tutte" is selected, return empty array to show all categories
  if (activityTypes.includes('tutto') || activityTypes.includes('tutte') || activityTypes.length === 0) {
    console.log('🌍 Returning empty array for all categories');
    return [];
  }

  const categories: string[] = [];
  const unmappedTypes: string[] = [];
  
  activityTypes.forEach(filterType => {
    const mappedCategories = POI_CATEGORY_MAPPING[filterType.toLowerCase()];
    if (mappedCategories) {
      categories.push(...mappedCategories);
      console.log(`🎯 Added categories for ${filterType}:`, mappedCategories);
    } else {
      unmappedTypes.push(filterType);
      // Fallback: use the filter type as category name (capitalized)
      const fallbackCategory = filterType.charAt(0).toUpperCase() + filterType.slice(1);
      categories.push(fallbackCategory);
      console.log(`⚠️ No mapping found for filter type: ${filterType}, using fallback: ${fallbackCategory}`);
    }
  });

  if (unmappedTypes.length > 0) {
    console.warn('🔧 Consider updating POI_CATEGORY_MAPPING for:', unmappedTypes);
  }

  console.log('🏷️ Final categories array:', categories);
  return categories;
};
