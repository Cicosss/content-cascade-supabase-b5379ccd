
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
  if (activityTypes.includes('tutto')) {
    return [];
  }

  const categories: string[] = [];
  activityTypes.forEach(filterType => {
    const mappedCategories = POI_CATEGORY_MAPPING[filterType.toLowerCase()];
    if (mappedCategories) {
      categories.push(...mappedCategories);
    }
  });

  return categories;
};
