
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image, Video, FileImage, Loader2, AlertTriangle, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useImageUpload } from '@/hooks/useImageUpload';

interface TerritoryMediaUploaderProps {
  images: string[];
  videoUrl: string;
  coverImage: string;
  onImagesChange: (images: string[]) => void;
  onVideoUrlChange: (url: string) => void;
  onCoverImageChange: (url: string) => void;
}

const TerritoryMediaUploader: React.FC<TerritoryMediaUploaderProps> = ({
  images,
  videoUrl,
  coverImage,
  onImagesChange,
  onVideoUrlChange,
  onCoverImageChange
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>(images);
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    const maxImages = 4;
    const currentImageCount = uploadedImages.length;
    const availableSlots = maxImages - currentImageCount;

    if (files.length > availableSlots) {
      toast.error(`Puoi aggiungere solo ${availableSlots} immagini in più (max ${maxImages} totali)`);
      return;
    }

    const uploadPromises = Array.from(files).map(file => uploadImage(file));
    const uploadedUrls = await Promise.all(uploadPromises);
    
    const validUrls = uploadedUrls.filter(url => url !== null) as string[];
    const newImages = [...uploadedImages, ...validUrls];
    
    setUploadedImages(newImages);
    onImagesChange(newImages);
  };

  const handleCoverImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const uploadedUrl = await uploadImage(file);
    
    if (uploadedUrl) {
      onCoverImageChange(uploadedUrl);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleCoverButtonClick = () => {
    coverFileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Alert sull'importanza delle immagini */}
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-800 mb-1">🖼️ Immagini FONDAMENTALI!</h4>
              <p className="text-sm text-red-700">
                Un POI senza immagini è inutile! Le immagini sono essenziali per attirare i visitatori. 
                Carica foto di alta qualità che mostrino al meglio la tua proposta.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Immagine di Copertina - OBBLIGATORIA */}
      <div className="space-y-4">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Immagine di Copertina (OBBLIGATORIA)
        </Label>
        
        <div className="border-2 border-dashed border-yellow-300 bg-yellow-50 rounded-lg p-6 text-center hover:border-yellow-400 transition-colors">
          <Star className="h-12 w-12 text-yellow-500 mx-auto mb-3" />
          <div className="text-lg font-medium text-yellow-800 mb-1">
            Carica l'immagine principale del tuo POI
          </div>
          <div className="text-sm text-yellow-700 mb-3">
            Questa sarà la prima immagine che vedranno i visitatori
          </div>
          <Button 
            type="button" 
            variant="outline" 
            className="mt-3 border-yellow-500 text-yellow-700 hover:bg-yellow-100"
            disabled={isUploading}
            onClick={handleCoverButtonClick}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Caricamento...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                {coverImage ? 'Cambia Copertina' : 'Seleziona Copertina'}
              </>
            )}
          </Button>
          <Input
            ref={coverFileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleCoverImageUpload(e.target.files)}
            disabled={isUploading}
            className="hidden"
          />
        </div>

        {/* Anteprima immagine di copertina */}
        {coverImage && (
          <div className="space-y-3">
            <h4 className="font-medium text-green-700">✓ Immagine di Copertina Caricata</h4>
            <div className="relative">
              <img
                src={coverImage}
                alt="Immagine di copertina"
                className="w-full h-48 object-cover rounded border-2 border-green-200"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0"
                onClick={() => onCoverImageChange('')}
              >
                ×
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Upload Immagini Galleria */}
      <div className="space-y-4">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Image className="h-5 w-5" />
          Galleria Immagini (max 4)
        </Label>
        <p className="text-sm text-gray-600">
          Queste immagini faranno parte della galleria fotografica del POI
        </p>

        {/* Area di upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
          <FileImage className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <div className="text-lg font-medium text-gray-700 mb-1">
            Trascina le immagini qui o clicca per selezionare
          </div>
          <div className="text-sm text-gray-500 mb-3">
            JPG, PNG, GIF, WebP - Max 5MB per immagine
          </div>
          <Button 
            type="button" 
            variant="outline" 
            className="mt-3"
            disabled={isUploading || uploadedImages.length >= 4}
            onClick={handleButtonClick}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Caricamento...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Seleziona Immagini ({uploadedImages.length}/4)
              </>
            )}
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileUpload(e.target.files)}
            disabled={isUploading || uploadedImages.length >= 4}
            className="hidden"
          />
        </div>

        {/* Anteprima immagini caricate */}
        {uploadedImages.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium">Galleria Immagini ({uploadedImages.length}/4)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {uploadedImages.map((url, index) => (
                <div key={index} className="relative group">
                  <img
                    src={url}
                    alt={`Immagine ${index + 1}`}
                    className="w-full h-24 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Video URL */}
      <div className="space-y-2">
        <Label htmlFor="video_url" className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          Video URL (opzionale)
        </Label>
        <Input
          id="video_url"
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
          type="url"
        />
        {videoUrl && (
          <p className="text-xs text-green-600">✓ Video collegato</p>
        )}
      </div>
    </div>
  );
};

export default TerritoryMediaUploader;
