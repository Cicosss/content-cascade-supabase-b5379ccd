
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { X, Upload, Image, Video } from 'lucide-react';
import { toast } from 'sonner';

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

  const handleImageUrlChange = (index: number, url: string) => {
    const newInputs = [...imageInputs];
    newInputs[index] = url;
    setImageInputs(newInputs);
    
    // Filter out empty URLs and update parent
    const validUrls = newInputs.filter(url => url.trim() !== '');
    onImagesChange(validUrls);
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
      <div>
        <Label className="flex items-center gap-2 mb-2">
          <Image className="h-4 w-4" />
          Immagini (URL) - Max 4 immagini
        </Label>
        <div className="space-y-2">
          {imageInputs.map((url, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={url}
                onChange={(e) => handleImageUrlChange(index, e.target.value)}
                placeholder={`https://esempio.com/immagine${index + 1}.jpg`}
                type="url"
              />
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
          ))}
          {imageInputs.length < 4 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addImageInput}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Aggiungi Immagine ({imageInputs.length}/4)
            </Button>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="video_url" className="flex items-center gap-2">
          <Video className="h-4 w-4" />
          Video URL
        </Label>
        <Input
          id="video_url"
          value={videoUrl}
          onChange={(e) => onVideoUrlChange(e.target.value)}
          placeholder="https://youtube.com/watch?v=... o https://vimeo.com/..."
          type="url"
        />
      </div>

      {(images.length > 0 || videoUrl) && (
        <Card>
          <CardContent className="pt-4">
            <h4 className="font-medium mb-2">Anteprima Media</h4>
            {images.length > 0 && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Immagini ({images.length}):
                </p>
                <ul className="text-xs space-y-1">
                  {images.map((img, idx) => (
                    <li key={idx} className="truncate text-blue-600">
                      {img}
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
