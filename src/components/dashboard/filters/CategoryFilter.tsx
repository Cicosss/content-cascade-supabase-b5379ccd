
import React from 'react';
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
  const allCategories = getAllCategories();

  const toggleCategory = (category: string) => {
    if (category === 'tutte') {
      onCategoriesChange(['tutte']);
    } else {
      let newCategories = selectedCategories.filter(c => c !== 'tutte');
      if (newCategories.includes(category)) {
        newCategories = newCategories.filter(c => c !== category);
      } else {
        newCategories.push(category);
      }
      if (newCategories.length === 0) {
        newCategories = ['tutte'];
      }
      onCategoriesChange(newCategories);
    }
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
          variant={selectedCategories.includes('tutte') ? "default" : "outline"}
          onClick={() => toggleCategory('tutte')}
          className={`text-xs ${
            selectedCategories.includes('tutte')
              ? 'bg-purple-500 hover:bg-purple-600' 
              : 'hover:bg-purple-50 hover:border-purple-300'
          }`}
        >
          Tutte
        </Button>
        {allCategories.map((category) => (
          <Button
            key={category}
            size="sm"
            variant={selectedCategories.includes(category) ? "default" : "outline"}
            onClick={() => toggleCategory(category)}
            className={`text-xs ${
              selectedCategories.includes(category)
                ? 'bg-purple-500 hover:bg-purple-600' 
                : 'hover:bg-purple-50 hover:border-purple-300'
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
