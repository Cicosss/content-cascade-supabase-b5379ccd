
import { useState } from 'react';
import { toast } from 'sonner';

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string | null>;
  isUploading: boolean;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string | null> => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato file non supportato. Usa JPG, PNG, GIF o WebP.');
      return null;
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast.error('Il file è troppo grande. Dimensione massima: 5MB.');
      return null;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', '0631e6c971b0f2c10153dcfa6164c375');

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Immagine caricata con successo!');
        return data.data.url;
      } else {
        toast.error('Errore nel caricamento dell\'immagine');
        return null;
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Errore di connessione durante il caricamento');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadImage, isUploading };
};
