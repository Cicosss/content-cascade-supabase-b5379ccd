
import React, { useMemo } from 'react';

interface WebcamFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const WebcamFilters: React.FC<WebcamFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  // Standardized button styling following the design system
  const getButtonClasses = useMemo(() => (category: string) => {
    const baseClasses = "px-8 py-3 rounded-lg font-medium transition-all duration-200 border-2";
    const isSelected = selectedCategory === category;
    
    if (isSelected) {
      return `${baseClasses} bg-blue-900 border-blue-900 text-white hover:bg-blue-800 hover:border-blue-800 shadow-md`;
    } else {
      return `${baseClasses} bg-white border-blue-900 text-blue-900 hover:bg-blue-50 hover:border-blue-800`;
    }
  }, [selectedCategory]);

  return (
    <div className="flex justify-center mb-8">
      <div className="flex flex-wrap gap-2 bg-white/90 backdrop-blur-sm p-3 rounded-xl border border-gray-200 shadow-sm">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={getButtonClasses(category)}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WebcamFilters;
