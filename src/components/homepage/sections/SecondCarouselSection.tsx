import React from 'react';
import HomepageSectionCarousel from '@/components/homepage/HomepageSectionCarousel';
import MobileContainer from '@/components/ui/MobileContainer';
import SeaBulletinWidget from '@/components/homepage/SeaBulletinWidget';
import { Calendar } from 'lucide-react';

/**
 * Seconda Sezione Caroselli - Eventi + Bollettino del Mare
 * Posizionata dopo la App Features Section
 */
const SecondCarouselSection: React.FC = () => {
  return (
    <MobileContainer variant="default" className="space-y-8 md:space-y-12">
      {/* Bollettino del Mare */}
      <SeaBulletinWidget />

      {/* Eventi */}
      <HomepageSectionCarousel
        section="Eventi"
        icon={Calendar}
        title="Eventi"
        subtitle="Gli eventi imperdibili del territorio"
        withChildren={false}
      />
    </MobileContainer>
  );
};

export default SecondCarouselSection;