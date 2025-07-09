import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Upload, Image, Loader2 } from 'lucide-react';
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
  const [imageInputs, setImageInputs] = useState<string[]>(images.length > 0 ? images : ['']);
  const { uploadImage, isUploading } = useImageUpload();

  const handleImageUrlChange = (index: number, url: string) => {
    const newInputs = [...imageInputs];
    newInputs[index] = url;
    setImageInputs(newInputs);
    
    const validUrls = newInputs.filter(url => url.trim() !== '');
    onImagesChange(validUrls);
  };

  const handleFileUpload = async (file: File, index: number) => {
    const uploadedUrl = await uploadImage(file);
    if (uploadedUrl) {
      handleImageUrlChange(index, uploadedUrl);
    }
  };

  const addImageInput = () => {
    if (imageInputs.length >= 4) {
      toast.error('Massimo 4 immagini');
      return;
    }
    setImageInputs([...imageInputs, '']);
  };

  const removeImageInput = (index: number) => {
    const newInputs = imageInputs.filter((_, i) => i !== index);
    setImageInputs(newInputs.length > 0 ? newInputs : ['']);
    
    const validUrls = newInputs.filter(url => url.trim() !== '');
    onImagesChange(validUrls);
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
        💡 La prima immagine sarà la copertina
      </div>

      {imageInputs.map((url, index) => (
        <div key={index} className={`p-3 border rounded-lg ${
          index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-xs font-medium ${
              index === 0 ? 'text-blue-700' : 'text-gray-700'
            }`}>
              {index === 0 ? '🌟 Copertina' : `Img ${index + 1}`}
            </span>
            {imageInputs.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeImageInput(index)}
                className="h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {/* File Upload */}
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileUpload(file, index);
                  }
                }}
                disabled={isUploading}
                className="text-xs"
              />
              {isUploading && <Loader2 className="h-3 w-3 animate-spin" />}
            </div>

            {/* URL Input */}
            <Input
              value={url}
              onChange={(e) => handleImageUrlChange(index, e.target.value)}
              placeholder="https://esempio.com/immagine.jpg"
              type="url"
              className="text-xs"
            />
          </div>

          {/* Compact Preview */}
          {url && (
            <div className="mt-2 flex items-center gap-2">
              <img 
                src={url} 
                alt={`Preview ${index + 1}`}
                className={`object-cover rounded border ${
                  index === 0 ? 'w-16 h-16 border-2 border-blue-300' : 'w-12 h-12'
                }`}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              {index === 0 && (
                <span className="text-xs text-blue-600">✨ Copertina</span>
              )}
            </div>
          )}
        </div>
      ))}
      
      {imageInputs.length < 4 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImageInput}
          className="w-full h-8 text-xs"
          disabled={isUploading}
        >
          <Upload className="h-3 w-3 mr-1" />
          Aggiungi ({imageInputs.length}/4)
        </Button>
      )}

      {/* Compact Summary */}
      {images.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded p-2">
          <div className="text-xs text-green-800">
            ✅ {images.length} immagine{images.length > 1 ? 'i' : ''} caricata{images.length > 1 ? 'e' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactMediaUploader;