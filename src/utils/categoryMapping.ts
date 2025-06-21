
export const getCategoryMapping = (): { [key: string]: string[] } => {
  return {
    'cibo': ['Ristoranti', 'Agriturismi', 'Cantine', 'Street Food', 'Mercati'],
    'arte e cultura': ['Musei', 'Borghi', 'Castelli', 'Arte', 'Artigianato'],
    'parchi e natura': ['Parchi', 'Spiagge', 'Attività per Bambini', 'Sport', 'Natura'],
    'divertimento': ['Concerti', 'Festival', 'Teatro', 'Cinema', 'Mostre'],
    'sport': ['Sport'],
    'shopping': ['shopping'],
    'vita notturna': ['vita notturna']
  };
};

export const getCategoriesForFilters = (activityTypes: string[]): string[] => {
  const categoryMapping = getCategoryMapping();
  const categoriesForFilter: string[] = [];
  
  activityTypes.forEach(filterType => {
    const mappedCategories = categoryMapping[filterType.toLowerCase()];
    if (mappedCategories) {
      categoriesForFilter.push(...mappedCategories);
    }
  });
  
  return categoriesForFilter;
};
