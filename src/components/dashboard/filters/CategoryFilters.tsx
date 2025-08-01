
import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAllCategories } from '@/config/categoryMapping';
import FilterSection from '@/components/filters/FilterSection';
import FilterChip from '@/components/filters/FilterChip';
import { useIsMobile } from '@/hooks/use-mobile';

interface CategoryFiltersProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const CategoryFilters = React.memo<CategoryFiltersProps>(({ categories, onCategoriesChange }) => {
  const allCategories = getAllCategories();
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

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
  const selectedCount = categories.filter(c => c !== 'tutte').length;
  const hasSelection = selectedCount > 0;

  // Mobile toggle version
  if (isMobile) {
    return (
      <div className="space-y-3">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-4 h-auto"
        >
          <div className="flex items-center gap-2">
            <span className="font-medium">Categorie</span>
            {hasSelection && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {selectedCount}
              </span>
            )}
          </div>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        
        {isExpanded && (
          <div className="space-y-3 p-3 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-2 gap-2">
              <FilterChip
                label="Tutte"
                isSelected={isAllSelected}
                onClick={() => handleCategoryToggle('Tutte')}
                variant="category"
                size="sm"
              />
              {allCategories.map((category) => (
                <FilterChip
                  key={category}
                  label={category}
                  isSelected={categories.includes(category)}
                  onClick={() => handleCategoryToggle(category)}
                  variant="category"
                  size="sm"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Desktop version (unchanged)
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
