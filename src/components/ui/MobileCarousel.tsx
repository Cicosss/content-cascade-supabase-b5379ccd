import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useMobileOptimization } from '@/hooks/useMobileOptimization';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";

interface MobileCarouselProps {
  children: React.ReactNode;
  className?: string;
  showIndicators?: boolean;
  enableSwipe?: boolean;
  itemsPerView?: number;
  spacing?: string;
}

const MobileCarousel: React.FC<MobileCarouselProps> = ({
  children,
  className,
  showIndicators = true,
  enableSwipe = true,
  itemsPerView,
  spacing
}) => {
  const { isMobile, getCarouselConfig } = useMobileOptimization();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const carouselConfig = getCarouselConfig();
  const finalItemsPerView = itemsPerView || carouselConfig.itemsPerView;
  const finalSpacing = spacing || carouselConfig.spacing;

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Convert children to array and wrap in CarouselItem
  const childrenArray = React.Children.toArray(children);

  return (
    <div className={cn("relative", className)}>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: false,
          dragFree: enableSwipe,
          slidesToScroll: isMobile ? 1 : 2,
        }}
        className="w-full"
      >
        <CarouselContent 
          className={cn(
            isMobile ? "-ml-2" : "-ml-4",
            finalSpacing && `gap-[${finalSpacing}]`
          )}
        >
          {childrenArray.map((child, index) => (
            <CarouselItem 
              key={index} 
              className={cn(
                isMobile ? "pl-2" : "pl-4",
                typeof finalItemsPerView === 'number' 
                  ? isMobile 
                    ? `basis-[${Math.floor(100 / finalItemsPerView)}%]`
                    : `basis-[${100 / finalItemsPerView}%]`
                  : isMobile 
                    ? "basis-[75%]" 
                    : "basis-1/4"
              )}
            >
              {child}
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Desktop navigation arrows */}
        {!isMobile && (
          <>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </>
        )}
      </Carousel>

      {/* Mobile scroll indicators */}
      {isMobile && showIndicators && count > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: count }, (_, index) => (
            <button
              key={index}
              className={cn(
                "h-2 w-2 rounded-full transition-all duration-200",
                index === current - 1 
                  ? "bg-primary w-6" 
                  : "bg-muted-foreground/30"
              )}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Mobile progress indicator */}
      {isMobile && !showIndicators && count > 1 && (
        <div className="mt-3 bg-muted rounded-full h-1 overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300 ease-out"
            style={{ width: `${(current / count) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default MobileCarousel;