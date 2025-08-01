import React from 'react';
import MobileCarouselContainer from '@/components/dashboard/mobile/carousel/MobileCarouselContainer';
import MobileContainer from '@/components/ui/MobileContainer';
import { UtensilsCrossed, Calendar, Mountain, PartyPopper, MapPin } from 'lucide-react';

/**
 * Homepage Carousels - Refactored for Mobile-First Architecture
 * 
 * Architettura dei Componenti:
 * 
 * HomepageCarousels (Presentation)
 * └── MobileCarouselContainer (Smart Container) x5
 *     ├── MobileCarouselView (Mobile Presentation)
 *     └── DesktopCarouselView (Desktop Presentation)
 * 
 * Principi Applicati:
 * ✅ Container pattern per gestione logica carousel
 * ✅ Componenti specializzati per mobile/desktop
 * ✅ Consistent component interfaces
 * ✅ Performance optimization con lazy loading
 * ✅ Single responsibility per ogni carousel
 */

const HomepageCarousels: React.FC = () => {
  return (
    <MobileContainer variant="default" className="space-y-8 md:space-y-16">
      {/* Gusto & Sapori */}
      <MobileCarouselContainer
        section="Gusto & Sapori"
        icon={UtensilsCrossed}
        title="Gusto & Sapori"
        subtitle="Scopri la tradizione culinaria della Romagna"
        withChildren={false}
      />

      {/* Eventi & Spettacoli */}
      <MobileCarouselContainer
        section="Eventi"
        icon={Calendar}
        title="Eventi & Spettacoli"
        subtitle="Gli eventi imperdibili del territorio"
        withChildren={false}
      />

      {/* Natura & Avventura */}
      <MobileCarouselContainer
        section="Natura & Avventura"
        icon={Mountain}
        title="Natura & Avventura"
        subtitle="Esplora i paesaggi e le attività all'aria aperta"
        withChildren={false}
      />

      {/* Divertimento & Famiglia */}
      <MobileCarouselContainer
        section="Divertimento & Famiglia"
        icon={PartyPopper}
        title="Divertimento & Famiglia"
        subtitle="Attività e esperienze per tutta la famiglia"
        withChildren={true}
      />

      {/* Cultura & Territorio */}
      <MobileCarouselContainer
        section="Cultura & Territorio"
        icon={MapPin}
        title="Cultura & Territorio"
        subtitle="Immergiti nella storia e nelle tradizioni locali"
        withChildren={false}
      />
    </MobileContainer>
  );
};

export default HomepageCarousels;