import React from 'react';
import HomepageSectionCarousel from './HomepageSectionCarousel';
import MobileContainer from '@/components/ui/MobileContainer';
import { UtensilsCrossed, Calendar, Mountain, PartyPopper, MapPin } from 'lucide-react';

const HomepageCarousels: React.FC = () => {
  return (
    <MobileContainer variant="default" className="space-y-8 md:space-y-16">
      {/* Gusto & Sapori */}
      <HomepageSectionCarousel
        section="Gusto & Sapori"
        icon={UtensilsCrossed}
        title="Gusto & Sapori"
        subtitle="Scopri la tradizione culinaria della Romagna"
        withChildren={false}
      />

      {/* Eventi & Spettacoli */}
      <HomepageSectionCarousel
        section="Eventi"
        icon={Calendar}
        title="Eventi & Spettacoli"
        subtitle="Gli eventi imperdibili del territorio"
        withChildren={false}
      />

      {/* Natura & Avventura */}
      <HomepageSectionCarousel
        section="Natura & Avventura"
        icon={Mountain}
        title="Natura & Avventura"
        subtitle="Esplora i paesaggi e le attività all'aria aperta"
        withChildren={false}
      />

      {/* Divertimento & Famiglia */}
      <HomepageSectionCarousel
        section="Divertimento & Famiglia"
        icon={PartyPopper}
        title="Divertimento & Famiglia"
        subtitle="Attività e esperienze per tutta la famiglia"
        withChildren={true}
      />

      {/* Cultura & Territorio */}
      <HomepageSectionCarousel
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