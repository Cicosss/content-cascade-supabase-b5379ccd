
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
  const getButtonClasses = useMemo(() => (category: string) => {
    const baseClasses = "px-8 py-3 rounded-lg font-medium transition-all duration-200 border-2 hover:animate-pulse";
    const isSelected = selectedCategory === category;
    const selectedClasses = "bg-slate-900 text-white border-slate-900 shadow-lg hover:bg-slate-800";
    const unselectedClasses = "text-slate-700 bg-white/80 border-slate-400 hover:bg-white hover:border-slate-500 hover:text-slate-900";
    
    return `${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`;
  }, [selectedCategory]);

  return (
    <div className="flex justify-center mb-8">
      <div className="flex flex-wrap gap-2 bg-white/60 backdrop-blur-sm p-3 rounded-xl border border-slate-300/70 shadow-sm">
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
