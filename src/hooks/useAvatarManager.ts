
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAvatarManager = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!file || !user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Errore",
          description: "Errore durante il caricamento dell'immagine",
          variant: "destructive"
        });
        return null;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Errore",
        description: "Errore durante il caricamento dell'immagine",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleAvatarChange = async (
    newAvatarUrl: string | null, 
    setAvatarUrl: (url: string | null) => void
  ) => {
    if (!user) return;

    // If it's a file (blob URL), upload it
    if (newAvatarUrl && newAvatarUrl.startsWith('blob:')) {
      const pendingFile = (window as any).pendingAvatarFile;
      if (pendingFile) {
        const uploadedUrl = await uploadAvatar(pendingFile);
        if (uploadedUrl) {
          setAvatarUrl(uploadedUrl);
          // Update profile in database
          await supabase
            .from('user_profiles')
            .update({ avatar_url: uploadedUrl })
            .eq('id', user.id);
          
          toast({
            title: "Successo",
            description: "Immagine del profilo aggiornata"
          });
        }
        // Clean up
        (window as any).pendingAvatarFile = null;
      }
    } else {
      // It's a predefined avatar URL
      setAvatarUrl(newAvatarUrl);
      // Update profile in database
      await supabase
        .from('user_profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', user.id);
      
      toast({
        title: "Successo",
        description: "Immagine del profilo aggiornata"
      });
    }
  };

  return {
    handleAvatarChange
  };
};
