
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Image, Video, Loader2, AlertTriangle, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useImageUpload } from '@/hooks/useImageUpload';

interface MediaUploaderProps {
  images: string[];
  videoUrl: string;
  onImagesChange: (images: string[]) => void;
  onVideoUrlChange: (url: string) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  images,
  videoUrl,
  onImagesChange,
  onVideoUrlChange
}) => {
  const [imageInputs, setImageInputs] = useState<string[]>(images.length > 0 ? images : ['']);
  const { uploadImage, isUploading } = useImageUpload();

  const handleImageUrlChange = (index: number, url: string) => {
    const newInputs = [...imageInputs];
    newInputs[index] = url;
    setImageInputs(newInputs);
    
    // Filter out empty URLs and update parent
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
      toast.error('Puoi aggiungere massimo 4 immagini');
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
    <div className="space-y-4">
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

      {/* Galleria Immagini */}
      <div>
        <Label className="flex items-center gap-2 mb-2">
          <Image className="h-4 w-4" />
          Galleria Immagini - Max 4 immagini (OBBLIGATORIO)
        </Label>
        <div className="space-y-3">
          {imageInputs.map((url, index) => (
            <div key={index} className={`space-y-2 p-3 border rounded-lg ${
              index === 0 ? 'bg-blue-50 border-blue-200' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-sm font-medium ${
                  index === 0 ? 'text-blue-700' : 'text-gray-700'
                }`}>
                  {index === 0 ? '🌟 Immagine 1 (COPERTINA)' : `Immagine ${index + 1}`}
                </span>
                {imageInputs.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImageInput(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Carica da dispositivo:</Label>
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
                    className="flex-1"
                  />
                  {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <Label className="text-xs text-gray-600">Oppure inserisci URL:</Label>
                <Input
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder={`https://esempio.com/immagine${index + 1}.jpg`}
                  type="url"
                />
              </div>

              {/* Preview */}
              {url && (
                <div className="mt-2">
                  <img 
                    src={url} 
                    alt={`Preview ${index + 1}`}
                    className={`object-cover rounded border ${
                      index === 0 ? 'w-32 h-32 border-2 border-blue-300' : 'w-24 h-24'
                    }`}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                  {index === 0 && (
                    <p className="text-xs text-blue-600 mt-1">✨ Questa sarà l'immagine di copertina</p>
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
              className="w-full"
              disabled={isUploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              Aggiungi Immagine ({imageInputs.length}/4)
            </Button>
          )}
        </div>
      </div>

      {/* Video URL */}
      <div>
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
      </div>

      {/* Anteprima Media */}
      {(images.length > 0 || videoUrl) && (
        <Card>
          <CardContent className="pt-4">
            <h4 className="font-medium mb-2">Anteprima Media</h4>
            {images.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Immagini ({images.length}) - Copertina: {images[0] ? '✅' : '❌'}
                </p>
                <ul className="text-xs space-y-1">
                  {images.map((img, idx) => (
                    <li key={idx} className={`truncate ${idx === 0 ? 'text-blue-600 font-medium' : 'text-gray-600'}`}>
                      {idx === 0 ? '🌟 ' : '📷 '}{img}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {videoUrl && (
              <div className="mt-2">
                <p className="text-sm text-muted-foreground">Video:</p>
                <p className="text-xs text-blue-600 truncate">{videoUrl}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MediaUploader;
