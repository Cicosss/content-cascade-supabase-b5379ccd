
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getAllCategories } from '@/config/categoryMapping';

interface CategoryFiltersProps {
  categories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const CategoryFilters: React.FC<CategoryFiltersProps> = ({ categories, onCategoriesChange }) => {
  const allCategories = getAllCategories();

  const toggleCategory = (category: string) => {
    if (category === 'Tutte') {
      onCategoriesChange(['tutte']);
      return;
    }

    const categoriesWithoutAll = categories.filter(c => c !== 'tutte');
    const newCategories = categoriesWithoutAll.includes(category)
      ? categoriesWithoutAll.filter(c => c !== category)
      : [...categoriesWithoutAll, category];

    onCategoriesChange(newCategories.length === 0 ? ['tutte'] : newCategories);
  };

  const isAllSelected = categories.includes('tutte');

  // Standardized button styling
  const getButtonClassName = (category: string, isSelected: boolean) => {
    const baseClasses = "rounded-full px-6 py-2 font-medium transition-all duration-200 border-2";
    if (isSelected) {
      return `${baseClasses} bg-blue-900 border-blue-900 text-white hover:bg-blue-800 hover:border-blue-800 shadow-md`;
    } else {
      return `${baseClasses} bg-white border-blue-900 text-blue-900 hover:bg-blue-50 hover:border-blue-800`;
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-xl font-bold text-slate-900">Categorie</Label>
      <div className="flex flex-wrap gap-3">
        <Button
          size="sm"
          onClick={() => toggleCategory('Tutte')}
          className={getButtonClassName('Tutte', isAllSelected)}
        >
          Tutte
        </Button>
        {allCategories.map((category) => (
          <Button
            key={category}
            size="sm"
            onClick={() => toggleCategory(category)}
            className={getButtonClassName(category, categories.includes(category))}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;
