
import React, { useState } from 'react';
import { HeroCategory } from './heroCategories';

interface HeroBackgroundProps {
  categories: HeroCategory[];
  activeBackground: string;
}

const HeroBackground = ({ categories, activeBackground }: HeroBackgroundProps) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleImageLoad = (categoryId: string) => {
    console.log(`✅ Background image loaded: ${categoryId}`);
    setLoadedImages(prev => new Set([...prev, categoryId]));
  };

  const handleImageError = (categoryId: string, src: string) => {
    console.error(`❌ Background image failed to load: ${categoryId}`, src);
    setFailedImages(prev => new Set([...prev, categoryId]));
  };

  return (
    <div className="absolute inset-0">
      {categories.map((category) => {
        const isActive = activeBackground === category.id;
        const hasLoaded = loadedImages.has(category.id);
        const hasFailed = failedImages.has(category.id);
        
        if (isActive) {
          console.log(`🎯 Active background: ${category.id}`, {
            isActive,
            hasLoaded,
            hasFailed,
            src: category.backgroundSrc
          });
        }

        return (
          <div
            key={category.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
              isActive ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ willChange: 'opacity' }}
          >
            {!hasFailed ? (
              <div
                className="w-full h-full bg-cover bg-center bg-no-repeat"
                style={{
                  backgroundImage: `url(${category.backgroundSrc})`
                }}
                onLoad={() => handleImageLoad(category.id)}
                onError={() => handleImageError(category.id, category.backgroundSrc)}
              />
            ) : (
              // Fallback gradient per immagini che non si caricano
              <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />
            )}
          </div>
        );
      })}
      
      {/* Dark Overlay for Text Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-slate-900/70" />
    </div>
  );
};

export default HeroBackground;
