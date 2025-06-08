
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Upload, User, Camera } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AvatarUploadProps {
  selectedAvatar: string | null;
  onAvatarChange: (avatarUrl: string | null) => void;
}

const DEFAULT_AVATARS = [
  'https://images.unsplash.com/photo-1494790108755-2616b612b412?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
];

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ selectedAvatar, onAvatarChange }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Seleziona un file immagine valido');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Il file è troppo grande. Massimo 5MB');
      return;
    }

    setUploading(true);
    try {
      // Create a temporary URL for preview
      const previewUrl = URL.createObjectURL(file);
      onAvatarChange(previewUrl);
      
      // Store the file reference for later upload after registration
      (window as any).pendingAvatarFile = file;
      
      toast.success('Immagine selezionata con successo');
    } catch (error) {
      console.error('Error handling file:', error);
      toast.error('Errore nel caricamento dell\'immagine');
    } finally {
      setUploading(false);
    }
  };

  const selectDefaultAvatar = (avatarUrl: string) => {
    onAvatarChange(avatarUrl);
    // Clear any pending file
    (window as any).pendingAvatarFile = null;
  };

  return (
    <div className="space-y-4">
      <Label className="text-sm font-medium text-slate-700">Immagine Profilo</Label>
      
      {/* Current Avatar Preview */}
      <div className="flex justify-center">
        <Avatar className="w-20 h-20 border-2 border-slate-200">
          <AvatarImage src={selectedAvatar || undefined} alt="Avatar preview" />
          <AvatarFallback className="bg-gradient-to-br from-red-500 via-orange-400 to-yellow-300">
            <User className="h-8 w-8 text-white" />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Upload Custom Image */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-full flex items-center space-x-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-slate-600"></div>
              <span>Caricamento...</span>
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              <span>Carica dalla Galleria</span>
            </>
          )}
        </Button>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Default Avatars */}
      <div className="space-y-2">
        <Label className="text-xs text-slate-500">Oppure scegli un avatar predefinito:</Label>
        <div className="grid grid-cols-5 gap-2">
          {DEFAULT_AVATARS.map((avatarUrl, index) => (
            <button
              key={index}
              type="button"
              onClick={() => selectDefaultAvatar(avatarUrl)}
              className={`relative rounded-full overflow-hidden border-2 transition-all ${
                selectedAvatar === avatarUrl 
                  ? 'border-orange-500 ring-2 ring-orange-200' 
                  : 'border-slate-200 hover:border-orange-300'
              }`}
            >
              <Avatar className="w-12 h-12">
                <AvatarImage src={avatarUrl} alt={`Avatar ${index + 1}`} />
                <AvatarFallback>
                  <User className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
