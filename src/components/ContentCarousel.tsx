
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ExperienceCard from './ExperienceCard';

interface ContentCarouselProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({ title, subtitle, children }) => {
  const experiences = [
    {
      title: "Tour guidato del centro storico di Rimini",
      image: "🏛️ Centro Storico",
      rating: 4.8,
      duration: "2h",
      groupSize: "Max 15",
      price: "€25",
      category: "Arte e Cultura"
    },
    {
      title: "Degustazione di piadina romagnola autentica",
      image: "🥟 Piadina Tour",
      rating: 4.9,
      duration: "1.5h",
      groupSize: "Max 12",
      price: "€18",
      category: "Tradizione Culinaria"
    },
    {
      title: "Escursione in bicicletta lungo la costa",
      image: "🚴‍♀️ Bike Tour",
      rating: 4.7,
      duration: "3h",
      groupSize: "Max 10",
      price: "€35",
      category: "Outdoor"
    },
    {
      title: "Esperienza alle Terme di Riccione",
      image: "💧 Terme Relax",
      rating: 4.6,
      duration: "4h",
      groupSize: "Max 20",
      price: "€45",
      category: "Benessere"
    }
  ];

  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="typography-h2 text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-gray-600 mt-1 typography-body">{subtitle}</p>
          )}
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full">
            <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {children || experiences.map((exp, index) => (
          <ExperienceCard key={index} {...exp} />
        ))}
      </div>
    </section>
  );
};

export default ContentCarousel;
