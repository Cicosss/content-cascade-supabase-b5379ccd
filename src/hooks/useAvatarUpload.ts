
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAvatarUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadAvatar = async (file: File, userId: string): Promise<string | null> => {
    if (!file) return null;

    setUploading(true);
    try {
      // Create unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/avatar.${fileExt}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true // This will replace existing file
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast.error('Errore durante il caricamento dell\'immagine');
        return null;
      }

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast.error('Errore durante il caricamento dell\'immagine');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadAvatar,
    uploading
  };
};
