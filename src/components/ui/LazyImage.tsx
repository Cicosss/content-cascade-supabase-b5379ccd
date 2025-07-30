import React from 'react';
import { cn } from '@/lib/utils';
import { useLazyImage } from '@/hooks/useLazyLoading';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: React.ReactNode;
  errorFallback?: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  placeholder,
  errorFallback,
  className,
  threshold = 0.1,
  rootMargin = '50px',
  ...imgProps
}) => {
  const {
    ref,
    src: lazySrc,
    isLoading,
    hasLoaded,
    error,
    placeholder: showPlaceholder
  } = useLazyImage(src, { threshold, rootMargin });

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      {/* Placeholder */}
      {showPlaceholder && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          {placeholder || (
            <div className="w-8 h-8 rounded-full bg-muted-foreground/20" />
          )}
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground">
          {errorFallback || (
            <div className="text-center p-4">
              <div className="w-8 h-8 mx-auto mb-2 opacity-50">❌</div>
              <p className="text-xs">Immagine non disponibile</p>
            </div>
          )}
        </div>
      )}

      {/* Actual image */}
      {lazySrc && !error && (
        <img
          src={lazySrc}
          alt={alt}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-300",
            hasLoaded ? "opacity-100" : "opacity-0"
          )}
          {...imgProps}
        />
      )}
    </div>
  );
};

export default LazyImage;