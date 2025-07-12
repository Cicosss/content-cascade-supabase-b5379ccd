import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Image, Loader2, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useImageUpload } from '@/hooks/useImageUpload';

interface CompactMediaUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const CompactMediaUploader: React.FC<CompactMediaUploaderProps> = ({
  images,
  onImagesChange
}) => {
  const { uploadImage, isUploading } = useImageUpload();
  
  // Funzione per eliminare un'immagine
  const removeImage = (indexToRemove: number) => {
    const newImages = images.filter((_, index) => index !== indexToRemove);
    onImagesChange(newImages);
    toast.success('Immagine eliminata');
  };

  // Funzione per sostituire un'immagine
  const replaceImage = async (file: File, indexToReplace: number) => {
    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) {
      const newImages = [...images];
      newImages[indexToReplace] = uploadedUrl;
      onImagesChange(newImages);
      toast.success('Immagine sostituita');
    }
  };

  // Triggerare il file picker per sostituire un'immagine
  const triggerFileReplace = (indexToReplace: number) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        replaceImage(file, indexToReplace);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-3">
        <Image className="h-4 w-4 text-blue-600" />
        <Label className="text-sm font-medium text-blue-800">
          Galleria Immagini ({images.length}/4)
        </Label>
        {images.length === 0 && (
          <span className="text-xs text-red-600 font-medium">OBBLIGATORIO</span>
        )}
      </div>

      <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded border">
        💡 Passa il mouse sopra le immagini per modificarle o eliminarle
      </div>

      {/* Gallery Preview */}
      {images.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Image className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">
              Anteprima Galleria ({images.length}/4)
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative group">
                <img
                  src={img}
                  alt={`Preview ${idx + 1}`}
                  className={`w-full object-cover rounded border ${
                    idx === 0 
                      ? 'h-20 border-2 border-blue-300 ring-2 ring-blue-100' 
                      : 'h-16 border-gray-200'
                  }`}
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                
                {/* Overlay Buttons */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => triggerFileReplace(idx)}
                    disabled={isUploading}
                    className="h-6 w-6 p-0 bg-blue-600 hover:bg-blue-700 text-white"
                    title="Sostituisci immagine"
                  >
                    <RefreshCw className="h-3 w-3" />
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(idx)}
                    className="h-6 w-6 p-0"
                    title="Elimina immagine"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                
                {idx === 0 && (
                  <div className="absolute top-1 left-1 bg-blue-600 text-white text-xs px-1.5 py-0.5 rounded">
                    🌟 Copertina
                  </div>
                )}
                <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {idx + 1}
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-2 text-xs text-green-700">
            ✅ {images.length} immagine{images.length > 1 ? 'i' : ''} caricata{images.length > 1 ? 'e' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactMediaUploader;