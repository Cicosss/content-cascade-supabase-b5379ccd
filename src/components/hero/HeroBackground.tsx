
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
    console.log(`✅ Background image loaded successfully: ${categoryId}`);
    setLoadedImages(prev => new Set([...prev, categoryId]));
  };

  const handleImageError = (categoryId: string, src: string) => {
    console.error(`❌ Background image failed to load: ${categoryId}`, src);
    setFailedImages(prev => new Set([...prev, categoryId]));
  };

  // Fallback gradient based on category
  const getFallbackGradient = (categoryId: string) => {
    switch (categoryId) {
      case 'gusto-sapori':
        return 'bg-gradient-to-br from-orange-600 via-red-600 to-pink-600';
      case 'cultura-territorio':
        return 'bg-gradient-to-br from-amber-600 via-yellow-600 to-orange-600';
      case 'eventi-spettacoli':
        return 'bg-gradient-to-br from-purple-600 via-pink-600 to-red-600';
      case 'divertimento-famiglia':
        return 'bg-gradient-to-br from-green-600 via-blue-600 to-purple-600';
      default:
        return 'bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600';
    }
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
              // Fallback gradient specifico per categoria
              <div className={`w-full h-full ${getFallbackGradient(category.id)}`} />
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
