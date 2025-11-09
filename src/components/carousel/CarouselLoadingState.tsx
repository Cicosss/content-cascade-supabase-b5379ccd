
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

interface CarouselLoadingStateProps {
  itemCount?: number;
  showHeader?: boolean;
  carouselType?: string;
}

const CarouselLoadingState: React.FC<CarouselLoadingStateProps> = ({
  itemCount = 3,
  showHeader = true,
  carouselType = 'contenuti'
}) => {
  return (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-center gap-3">
          <Skeleton className="h-6 w-6 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      )}
      
      <div className="flex space-x-4 overflow-hidden">
        {Array.from({ length: itemCount }).map((_, index) => (
          <Card key={index} className="flex-none w-64 overflow-hidden">
            <div className="space-y-3 p-0">
              <Skeleton className="h-40 w-full rounded-t-lg animate-pulse" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-full animate-pulse" />
                <Skeleton className="h-5 w-3/4 animate-pulse" />
                <Skeleton className="h-4 w-24 animate-pulse" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
          <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
          <span>Caricamento {carouselType}...</span>
        </div>
      </div>
    </div>
  );
};

export default CarouselLoadingState;
