
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, Image, FileImage, Loader2, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useImageUpload } from '@/hooks/useImageUpload';

interface TerritoryMediaUploaderProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

const TerritoryMediaUploader: React.FC<TerritoryMediaUploaderProps> = ({
  images,
  onImagesChange
}) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>(images);
  const { uploadImage, isUploading } = useImageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onImagesChange(newImages);
  };

  return (
    <div className="space-y-6">
      {/* Banner informativo */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">📸 Immagine di Copertina Automatica</h4>
              <p className="text-sm text-blue-700 mb-2">
                <strong>La prima immagine che carichi verrà automaticamente usata come immagine di copertina</strong> e sarà visualizzata più grande rispetto alle altre.
              </p>
              <p className="text-xs text-blue-600">
                💡 Assicurati che la prima immagine sia quella più rappresentativa e attraente del tuo POI!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

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

      {/* Upload Immagini */}
      <div className="space-y-4">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Image className="h-5 w-5" />
          Galleria Immagini (max 4) - OBBLIGATORIO
        </Label>
        <p className="text-sm text-gray-600">
          La prima immagine sarà automaticamente usata come copertina
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
                    className={`w-full object-cover rounded border ${
                      index === 0 ? 'h-32 border-2 border-blue-300' : 'h-24'
                    }`}
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
                  {index === 0 && (
                    <div className="absolute bottom-1 left-1 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      🌟 Copertina
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerritoryMediaUploader;
