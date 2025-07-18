import React from 'react';

interface ContentCarouselProps {
  children?: React.ReactNode;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ children }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {children}
    </div>
  );
};

export default ContentCarousel;
