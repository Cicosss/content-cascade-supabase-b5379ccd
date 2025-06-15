
import React, { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getAllCategories } from '@/config/categoryMapping';

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoriesChange: (categories: string[]) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  selectedCategories, 
  onCategoriesChange 
}) => {
  const allCategories = useMemo(() => getAllCategories(), []);
  const isAllSelected = selectedCategories.includes('tutte');

  const toggleCategory = (category: string) => {
    if (category === 'tutte') {
      onCategoriesChange(['tutte']);
      return;
    }

    const categoriesWithoutAll = selectedCategories.filter(c => c !== 'tutte');
    const newCategories = categoriesWithoutAll.includes(category)
      ? categoriesWithoutAll.filter(c => c !== category)
      : [...categoriesWithoutAll, category];

    onCategoriesChange(newCategories.length === 0 ? ['tutte'] : newCategories);
  };

  const getButtonClassName = (category: string) => {
    const isSelected = selectedCategories.includes(category);
    return `text-xs ${
      isSelected
        ? 'bg-purple-500 hover:bg-purple-600' 
        : 'hover:bg-purple-50 hover:border-purple-300'
    }`;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-purple-500">🎯</span>
        <Label className="font-semibold text-gray-700">Categorie</Label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={isAllSelected ? "default" : "outline"}
          onClick={() => toggleCategory('tutte')}
          className={getButtonClassName('tutte')}
        >
          Tutte
        </Button>
        {allCategories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            onClick={() => toggleCategory(category)}
            className={getButtonClassName(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
