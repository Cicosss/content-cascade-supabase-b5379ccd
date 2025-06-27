
import React, { useEffect } from 'react';
import { HeroCategory } from './heroCategories';

interface HeroImagePreloaderProps {
  categories: HeroCategory[];
}

const HeroImagePreloader = ({ categories }: HeroImagePreloaderProps) => {
  useEffect(() => {
    console.log('🖼️ Preloading hero images...');
    
    categories.forEach((category) => {
      const img = new Image();
      img.onload = () => {
        console.log(`✅ Image loaded successfully: ${category.id}`, category.backgroundSrc);
      };
      img.onerror = (error) => {
        console.error(`❌ Failed to load image: ${category.id}`, category.backgroundSrc, error);
      };
      img.src = category.backgroundSrc;
    });
  }, [categories]);

  return null;
};

export default HeroImagePreloader;
