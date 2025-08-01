import React, { memo } from 'react';
import { useSectionCarousel, SectionType } from '@/hooks/useSectionCarousel';
import MobileCarouselView from './MobileCarouselView';
import DesktopCarouselView from './DesktopCarouselView';
import { useIsMobile } from '@/hooks/use-mobile';
import { LucideIcon } from 'lucide-react';

/**
 * Container Component (Smart) - Mobile/Desktop Carousel Container
 * 
 * Responsabilità:
 * - Fetching dati carousel
 * - Gestione stato loading/error
 * - Selezione view appropriata (mobile/desktop)
 * - Coordinamento logica carousel
 */

interface MobileCarouselContainerProps {
  section: SectionType;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  withChildren?: boolean;
}

const MobileCarouselContainer: React.FC<MobileCarouselContainerProps> = memo(({ 
  section,
  icon,
  title,
  subtitle,
  withChildren = false
}) => {
  const isMobile = useIsMobile();
  const { data, isLoading, error, retry, isEmpty, metrics, categories } = useSectionCarousel(section, {
    withChildren,
    limit: isMobile ? 6 : 8 // Limite adattivo per device
  });

  const carouselData = {
    data,
    isLoading,
    error,
    retry,
    isEmpty,
    metrics,
    categories,
    section,
    icon,
    title,
    subtitle
  };

  // Render appropriate view based on device
  return isMobile ? (
    <MobileCarouselView {...carouselData} />
  ) : (
    <DesktopCarouselView {...carouselData} />
  );
});

MobileCarouselContainer.displayName = 'MobileCarouselContainer';

export default MobileCarouselContainer;