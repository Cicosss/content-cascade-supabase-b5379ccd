
import React from 'react';
import { HeroCategory } from './heroCategories';

interface HeroBackgroundProps {
  categories: HeroCategory[];
  activeBackground: string;
}

const HeroBackground = ({ categories, activeBackground }: HeroBackgroundProps) => {
  return (
    <div className="absolute inset-0">
      {categories.map((category) => (
        <div
          key={category.id}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            activeBackground === category.id ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'opacity' }}
        >
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(${category.backgroundSrc})`
            }}
          />
        </div>
      ))}
      
      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/70" />
    </div>
  );
};

export default HeroBackground;
