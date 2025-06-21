
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
  const buttonClass = "rounded-full px-6 py-2 font-medium transition-all";
  const selectedClass = "bg-blue-900 hover:bg-blue-800 text-white shadow-lg";
  const unselectedClass = "bg-transparent text-blue-900 border border-blue-900 hover:bg-blue-50";

  return (
    <div className="space-y-4">
      <Label className="text-xl font-bold text-slate-900">Categorie</Label>
      <div className="flex flex-wrap gap-3">
        <Button
          size="sm"
          variant={isAllSelected ? "default" : "outline"}
          onClick={() => toggleCategory('Tutte')}
          className={`${buttonClass} ${isAllSelected ? selectedClass : unselectedClass}`}
        >
          Tutte
        </Button>
        {allCategories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={categories.includes(category) ? "default" : "outline"}
            onClick={() => toggleCategory(category)}
            className={`${buttonClass} ${
              categories.includes(category) ? selectedClass : unselectedClass
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilters;
