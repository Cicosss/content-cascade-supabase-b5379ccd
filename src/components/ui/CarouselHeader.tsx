import React from 'react';
import { LucideProps } from 'lucide-react';

interface CarouselHeaderProps {
  icon: React.ComponentType<LucideProps>;
  title: string;
  subtitle: string;
}

const CarouselHeader: React.FC<CarouselHeaderProps> = ({ icon: Icon, title, subtitle }) => {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-6 w-6 text-blue-800" strokeWidth={1.5} />
      <div>
        <h2 className="typography-h3 text-2xl text-blue-800">{title}</h2>
        <p className="typography-small text-slate-600">{subtitle}</p>
      </div>
    </div>
  );
};

export default CarouselHeader;