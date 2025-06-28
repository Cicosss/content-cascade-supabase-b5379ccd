
import React from 'react';
import { getAllCategories } from '@/config/categoryMapping';
import FilterSection from '@/components/filters/FilterSection';
import FilterChip from '@/components/filters/FilterChip';

interface CategoryFiltersProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const CategoryFilters = React.memo<CategoryFiltersProps>(({ categories, onCategoriesChange }) => {
  const allCategories = getAllCategories();

  const handleCategoryToggle = React.useCallback((category: string) => {
    if (category === 'Tutte') {
      onCategoriesChange(['tutte']);
      return;
    }

    const categoriesWithoutAll = categories.filter(c => c !== 'tutte');
    const newCategories = categoriesWithoutAll.includes(category)
      ? categoriesWithoutAll.filter(c => c !== category)
      : [...categoriesWithoutAll, category];

    onCategoriesChange(newCategories.length === 0 ? ['tutte'] : newCategories);
  }, [categories, onCategoriesChange]);

  const isAllSelected = categories.includes('tutte');

  return (
    <FilterSection title="Categorie" description="Seleziona le tue categorie di interesse">
      <div className="flex flex-wrap gap-3">
        <FilterChip
          label="Tutte"
          isSelected={isAllSelected}
          onClick={() => handleCategoryToggle('Tutte')}
          variant="category"
          size="md"
        />
        {allCategories.map((category) => (
          <FilterChip
            key={category}
            label={category}
            isSelected={categories.includes(category)}
            onClick={() => handleCategoryToggle(category)}
            variant="category"
            size="md"
          />
        ))}
      </div>
    </FilterSection>
  );
});

CategoryFilters.displayName = 'CategoryFilters';

export default CategoryFilters;
