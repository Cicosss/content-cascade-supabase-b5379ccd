
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTrustedVideoUrl } from '@/utils/url';

interface POIImageGallerySectionProps {
  images: string[];
  videoUrl?: string;
  name: string;
}

const POIImageGallerySection: React.FC<POIImageGallerySectionProps> = ({ 
  images, 
  videoUrl, 
  name 
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const hasImages = images && images.length > 0;
  const safeVideoUrl = videoUrl ? getTrustedVideoUrl(videoUrl) : null;

  if (!hasImages && !safeVideoUrl) {
    return null;
  }

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Galleria Immagini</h2>
          <p className="text-gray-600">Scopri {name} attraverso le nostre foto</p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.slice(0, 7).map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                setIsLightboxOpen(true);
              }}
              className="relative aspect-square rounded-lg overflow-hidden group hover:shadow-lg transition-all duration-300"
            >
              <img
                src={image}
                alt={`${name} - Immagine ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
            </button>
          ))}

          {/* Show more button if there are more than 7 images */}
          {images.length > 7 && (
            <button
              onClick={() => setIsLightboxOpen(true)}
              className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-center group"
            >
              <div className="text-center">
                <span className="text-2xl font-bold text-gray-600 group-hover:text-gray-800">
                  +{images.length - 7}
                </span>
                <p className="text-sm text-gray-500 group-hover:text-gray-700">altre foto</p>
              </div>
            </button>
          )}

          {/* Video thumbnail if present */}
          {safeVideoUrl && (
            <button
              onClick={() => setIsVideoOpen(true)}
              className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center group hover:shadow-lg transition-all duration-300"
            >
              <div className="text-center text-white">
                <Play className="h-8 w-8 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium">Video</p>
              </div>
            </button>
          )}
        </div>

        {/* Lightbox for Images */}
        {isLightboxOpen && hasImages && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl max-h-full">
              {/* Close Button */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 right-0 bg-white/90 hover:bg-white z-10"
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Navigation Buttons */}
              {images.length > 1 && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white z-10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white z-10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Main Image */}
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <img
                  src={images[selectedImage]}
                  alt={`${name} - Immagine ${selectedImage + 1}`}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Image Counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {selectedImage + 1} / {images.length}
              </div>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {safeVideoUrl && isVideoOpen && (
          <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsVideoOpen(false)}
                className="absolute -top-12 right-0 bg-white/90 hover:bg-white"
              >
                <X className="h-4 w-4" />
              </Button>
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={safeVideoUrl}
                  title={`Video di ${name}`}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default POIImageGallerySection;
