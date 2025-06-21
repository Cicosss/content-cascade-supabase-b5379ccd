
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Play } from 'lucide-react';

interface POIImageGalleryProps {
  images: string[];
  videoUrl?: string;
  name: string;
}

const POIImageGallery: React.FC<POIImageGalleryProps> = ({ 
  images, 
  videoUrl, 
  name 
}) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const hasImages = images && images.length > 0;
  const hasMultipleImages = hasImages && images.length > 1;

  if (!hasImages && !videoUrl) {
    return (
      <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
        <span className="text-6xl opacity-50">📍</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image/Video Display */}
      <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-100">
        {hasImages ? (
          <img
            src={images[selectedImage]}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
            <span className="text-6xl opacity-50">📍</span>
          </div>
        )}
        
        {/* Video Play Button Overlay */}
        {videoUrl && (
          <button
            onClick={() => setIsVideoOpen(true)}
            className="absolute inset-0 bg-black/30 flex items-center justify-center group hover:bg-black/40 transition-colors"
          >
            <div className="bg-white/90 rounded-full p-4 group-hover:bg-white transition-colors">
              <Play className="h-8 w-8 text-gray-900 ml-1" />
            </div>
          </button>
        )}
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? 'border-blue-600'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image}
                alt={`${name} - Immagine ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Video Modal */}
      {videoUrl && isVideoOpen && (
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
                src={videoUrl}
                title={`Video di ${name}`}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default POIImageGallery;
