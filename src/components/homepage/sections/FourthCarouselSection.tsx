import React from 'react';
import HomepageSectionCarousel from '@/components/homepage/HomepageSectionCarousel';
import MobileContainer from '@/components/ui/MobileContainer';
import { PartyPopper, MapPin } from 'lucide-react';

/**
 * Quarta Sezione Caroselli - Divertimento & Famiglia + Cultura & Territorio
 * Posizionata dopo l'Help Banner e prima della Family Section
 */
const FourthCarouselSection: React.FC = () => {
  return (
    <MobileContainer variant="default" className="space-y-8 md:space-y-12">
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

export default FourthCarouselSection;