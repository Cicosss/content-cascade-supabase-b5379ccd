
import React from 'react';
import ContentCarousel from '@/components/ContentCarousel';
import EventCard from '@/components/EventCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface EventsSectionProps {
  events: any[];
  isLoading?: boolean;
  hasRealData?: boolean;
}

const EventsSection: React.FC<EventsSectionProps> = ({ 
  events, 
  isLoading = false,
  hasRealData = false 
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-80" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="min-w-80 p-4">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-6 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <ContentCarousel 
        title="Eventi Speciali e Manifestazioni" 
        subtitle={hasRealData 
          ? "Gli eventi più recenti e interessanti della Romagna" 
          : "Non perdere gli appuntamenti più esclusivi del territorio"
        }
      >
        {events.map((event, index) => (
          <EventCard key={index} {...event} />
        ))}
      </ContentCarousel>
      {hasRealData && (
        <p className="text-sm text-green-600 mt-2 text-center">
          ✅ Dati caricati dal database Supabase
        </p>
      )}
    </div>
  );
};

export default EventsSection;
