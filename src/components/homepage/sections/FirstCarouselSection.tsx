import React from 'react';
import HomepageSectionCarousel from '@/components/homepage/HomepageSectionCarousel';
import MobileContainer from '@/components/ui/MobileContainer';
import { UtensilsCrossed } from 'lucide-react';

/**
 * Prima Sezione Caroselli - Gusto & Sapori
 * Posizionata dopo la Value Proposition Section
 */
const FirstCarouselSection: React.FC = () => {
  return (
    <MobileContainer variant="default" className="space-y-8">
      {/* Gusto & Sapori */}
      <HomepageSectionCarousel
        section="Gusto & Sapori"
        icon={UtensilsCrossed}
        title="Gusto & Sapori"
        subtitle="Scopri la tradizione culinaria della Romagna"
        withChildren={false}
      />
    </MobileContainer>
  );
};

export default FirstCarouselSection;