import React from 'react';
import { ChevronLeft, ChevronRight, LucideProps } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExperienceCard from './ExperienceCard';

interface ContentCarouselProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  icon?: React.ComponentType<LucideProps>;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, subtitle, children, icon: Icon }) => {

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {Icon && (
            <Icon className="h-6 w-6 text-blue-800" strokeWidth={1.5} />
          )}
          <div>
            <h2 className="text-2xl font-bold text-blue-800">{title}</h2>
            {subtitle && (
              <p className="text-slate-600 text-sm mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {children}
      </div>
    </section>
  );
};

export default ContentCarousel;
