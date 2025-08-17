import React from 'react';
import HomepageSectionCarousel from '@/components/homepage/HomepageSectionCarousel';
import MobileContainer from '@/components/ui/MobileContainer';
import { Mountain } from 'lucide-react';

/**
 * Terza Sezione Caroselli - Natura & Avventura
 * Posizionata dopo la Top Section (Weather + Guest Card)
 */
const ThirdCarouselSection: React.FC = () => {
  return (
    <MobileContainer variant="default" className="space-y-8">
      {/* Natura & Avventura */}
      <HomepageSectionCarousel
        section="Natura & Avventura"
        icon={Mountain}
        title="Natura & Avventura"
        subtitle="Esplora i paesaggi e le attività all'aria aperta"
        withChildren={false}
      />
    </MobileContainer>
  );
};

export default ThirdCarouselSection;