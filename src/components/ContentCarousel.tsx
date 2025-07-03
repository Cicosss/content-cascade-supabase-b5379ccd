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
  const experiences = [
    {
      id: 'tour-centro-storico-rimini',
      name: "Tour guidato del centro storico di Rimini",
      title: "Tour guidato del centro storico di Rimini",
      image: "🏛️ Centro Storico",
      rating: 4.8,
      duration: "2h",
      groupSize: "Max 15",
      price: "€25",
      category: "Arte e Cultura"
    },
    {
      id: 'degustazione-piadina-romagnola',
      name: "Degustazione di piadina romagnola autentica",
      title: "Degustazione di piadina romagnola autentica",
      image: "🥟 Piadina Tour",
      rating: 4.9,
      duration: "1.5h",
      groupSize: "Max 12",
      price: "€18",
      category: "Tradizione Culinaria"
    },
    {
      id: 'escursione-bicicletta-costa',
      name: "Escursione in bicicletta lungo la costa",
      title: "Escursione in bicicletta lungo la costa",
      image: "🚴‍♀️ Bike Tour",
      rating: 4.7,
      duration: "3h",
      groupSize: "Max 10",
      price: "€35",
      category: "Outdoor"
    },
    {
      id: 'esperienza-terme-riccione',
      name: "Esperienza alle Terme di Riccione",
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
        {children || experiences.map((exp, index) => (
          <ExperienceCard key={index} {...exp} />
        ))}
      </div>
    </section>
  );
};

export default ContentCarousel;
