
import React from 'react';
import { AvatarUpload } from '@/components/AvatarUpload';

interface ProfileAvatarSectionProps {
  avatarUrl: string | null;
  onAvatarChange: (newAvatarUrl: string | null) => void;
}

export const ProfileAvatarSection: React.FC<ProfileAvatarSectionProps> = ({
  avatarUrl,
  onAvatarChange
}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-2xl">
      <AvatarUpload 
        selectedAvatar={avatarUrl} 
        onAvatarChange={onAvatarChange}
      />
    </div>
  );
};
