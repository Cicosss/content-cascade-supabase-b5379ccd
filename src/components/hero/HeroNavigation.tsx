
import React from 'react';
import { HeroCategory } from './heroCategories';

interface HeroNavigationProps {
  categories: HeroCategory[];
  onCategoryHover: () => void;
  onCategoryClick: (route: string) => void;
}

const HeroNavigation = ({ categories, onCategoryHover, onCategoryClick }: HeroNavigationProps) => {
  return (
    <div className="pb-8 px-2">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4">
          {categories.map((category) => (
            <div
              key={category.id}
              className="group cursor-pointer transition-all duration-300 transform hover:scale-105"
              onMouseEnter={onCategoryHover}
              onClick={() => onCategoryClick(category.route)}
            >
              <div className="text-center">
                <div className="mb-2 px-2 py-2 lg:px-3 lg:py-2 rounded-lg transition-all duration-300 bg-white/10 border-2 border-white/20 group-hover:bg-white/20 group-hover:border-white/40">
                  <h2 className="text-sm lg:text-base xl:text-lg text-white font-bold mb-1 leading-tight">
                    {category.title}
                  </h2>
                  <p className="text-xs lg:text-sm text-slate-200 font-medium leading-tight">
                    {category.subtitle}
                  </p>
                </div>
                
                {/* Hover Indicator */}
                <div className="mx-auto w-2 h-2 rounded-full transition-all duration-300 bg-white/40 group-hover:bg-white/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroNavigation;
