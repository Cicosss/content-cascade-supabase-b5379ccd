import React from 'react';
import CarouselHeader from '@/components/ui/CarouselHeader';
import UnifiedPOICard from '@/components/UnifiedPOICard';
import EventCard from '@/components/EventCard';
import CarouselErrorBoundary from '@/components/carousel/CarouselErrorBoundary';
import CarouselLoadingState from '@/components/carousel/CarouselLoadingState';
import { LucideIcon } from 'lucide-react';
import { useSectionCarousel, SectionType } from '@/hooks/useSectionCarousel';
import { useGuestRedirect } from '@/hooks/useGuestRedirect';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface HomepageSectionCarouselProps {
  section: SectionType;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  withChildren?: boolean;
}

const HomepageSectionCarousel: React.FC<HomepageSectionCarouselProps> = ({ 
  section,
  icon,
  title,
  subtitle,
  withChildren = false
}) => {
  const { data, isLoading, error, retry, isEmpty, metrics, categories } = useSectionCarousel(section, {
    withChildren,
    limit: 8
  });

  const { isGuest, handleGuestClick } = useGuestRedirect();

  // Show loading state
  if (isLoading) {
    return <CarouselLoadingState carouselType={section.toLowerCase()} />;
  }

  // Show error state with recovery options
  if (error) {
    return (
      <div className="space-y-4">
        <CarouselHeader icon={icon} title={title} subtitle={subtitle} />
        <CarouselErrorBoundary 
          error={error} 
          onRetry={retry}
          showDetails={true}
        />
      </div>
    );
  }

  // Show empty state
  if (isEmpty) {
    return (
      <div className="space-y-4">
        <CarouselHeader icon={icon} title={title} subtitle={subtitle} />
        <div className="text-center py-8 text-gray-500">
          {React.createElement(icon, { className: "h-12 w-12 mx-auto mb-4 opacity-50" })}
          <p>Nessun contenuto trovato per {title.toLowerCase()}.</p>
          <p className="text-xs mt-2">Categorie: {categories.join(', ')}</p>
        </div>
      </div>
    );
  }

  const handleItemClick = () => {
    if (isGuest) {
      handleGuestClick();
    }
    // Se l'utente è loggato, il comportamento di default della card gestirà la navigazione
  };

  return (
    <section className="space-y-4">
      <CarouselHeader icon={icon} title={title} subtitle={subtitle} />
      
      {isGuest && (
        <div className="text-sm text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
          🌟 Registrati per accedere a tutti i dettagli e funzionalità!
        </div>
      )}

      <Carousel
        opts={{
          align: "start",
          loop: false,
          dragFree: true,
          containScroll: "trimSnaps",
        }}
        className="w-full touch-pan-x"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {data.map((item: any, index: number) => (
            <CarouselItem key={item.id || index} className="pl-3 md:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              {section === 'Eventi' ? (
                <div onClick={handleItemClick}>
                  <EventCard 
                    id={item.id}
                    title={item.name}
                    date={new Date(item.start_datetime || '').toLocaleDateString('it-IT')}
                    time={new Date(item.start_datetime || '').toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                    location_name={item.location_name || item.address || ''}
                    category={item.category}
                    image={item.images?.[0] || ''}
                  />
                </div>
              ) : (
                <UnifiedPOICard 
                  id={item.id}
                  name={item.name}
                  category={item.category}
                  description={item.description}
                  images={item.images}
                  avg_rating={item.avg_rating}
                  price_info={item.price_info}
                  duration_info={item.duration_info}
                  target_audience={item.target_audience}
                  address={item.address}
                  location_name={item.location_name}
                  startDatetime={item.start_datetime}
                  endDatetime={item.end_datetime}
                  poiType={item.poi_type as 'place' | 'event' | 'experience'}
                  isLoading={false}
                  onClick={isGuest ? handleItemClick : undefined}
                />
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex" />
        <CarouselNext className="hidden md:flex" />
      </Carousel>
      
      <div className="text-xs text-gray-400 text-right">
        {data.length} elementi • Scopri di più registrandoti!
      </div>
    </section>
  );
};

export default HomepageSectionCarousel;