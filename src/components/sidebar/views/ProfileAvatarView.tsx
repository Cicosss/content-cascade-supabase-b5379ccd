
import React from 'react';
import { User } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface ProfileAvatarViewProps {
  size: 'sm' | 'md';
  profile: any;
}

const ProfileAvatarView = React.memo<ProfileAvatarViewProps>(({ size, profile }) => {
  const iconSize = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
  const avatarSize = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';

  return (
    <Avatar className={avatarSize}>
      <AvatarImage src={profile?.avatar_url || undefined} alt="Avatar utente" />
      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500">
        <User className={`${iconSize} text-white`} />
      </AvatarFallback>
    </Avatar>
  );
});

ProfileAvatarView.displayName = 'ProfileAvatarView';

export { ProfileAvatarView };
