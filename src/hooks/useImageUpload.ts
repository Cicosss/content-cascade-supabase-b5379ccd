
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface UseImageUploadReturn {
  uploadImage: (file: File) => Promise<string | null>;
  isUploading: boolean;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split('base64,')[1] || '';
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

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
      const image_base64 = await fileToBase64(file);

      const { data, error } = await supabase.functions.invoke('upload-image', {
        body: {
          image_base64,
          filename: file.name,
          contentType: file.type,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        toast.success('Immagine caricata con successo!');
        return data.url as string;
      }

      toast.error('Risposta non valida dal server di upload');
      return null;
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
