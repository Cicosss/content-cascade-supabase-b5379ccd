
export const POI_CATEGORY_MAPPING: { [key: string]: string[] } = {
  'cibo': ['Ristoranti', 'Agriturismi', 'Cantine', 'Street Food', 'Mercati'],
  'arte e cultura': ['Musei', 'Borghi', 'Castelli', 'Arte', 'Artigianato'],
  'parchi e natura': ['Parchi', 'Spiagge', 'Attività per Bambini', 'Sport', 'Natura'],
  'divertimento': ['Concerti', 'Festival', 'Teatro', 'Cinema', 'Mostre'],
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
  activityTypes.forEach(filterType => {
    const mappedCategories = POI_CATEGORY_MAPPING[filterType.toLowerCase()];
    if (mappedCategories) {
      categories.push(...mappedCategories);
      console.log(`🎯 Added categories for ${filterType}:`, mappedCategories);
    } else {
      console.log(`⚠️ No mapping found for filter type: ${filterType}`);
    }
  });

  console.log('🏷️ Final categories array:', categories);
  return categories;
};
