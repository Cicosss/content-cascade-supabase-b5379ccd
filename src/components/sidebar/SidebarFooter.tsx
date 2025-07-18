
import React from 'react';
import { SidebarFooter as BaseSidebarFooter } from '@/components/ui/sidebar';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const ProfileAvatar = React.memo<{ size: 'sm' | 'md' }>(({ size }) => {
  const { profile } = useUserProfile();
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

ProfileAvatar.displayName = 'ProfileAvatar';

const UserProfileSection = React.memo(() => {
  const { profile } = useUserProfile();
  const navigate = useNavigate();

  const handleProfileClick = React.useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  const buttonProps = {
    onClick: handleProfileClick,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleProfileClick();
      }
    },
    tabIndex: 0,
    role: "button" as const,
    "aria-label": "Vai al profilo utente"
  };

  return (
    <>
      {/* Profile section - solo quando aperta */}
      <div className="group-data-[collapsible=icon]:hidden">
        <div 
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          {...buttonProps}
        >
          <ProfileAvatar size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">
              {profile?.first_name || 'giulia'}
            </p>
            <p className="text-xs text-slate-500 truncate">
              Promotore Bronzo
            </p>
          </div>
        </div>
      </div>

      {/* Avatar solo quando compressa */}
      <div className="group-data-[collapsible=icon]:block hidden">
        <div 
          className="flex justify-center p-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          {...buttonProps}
        >
          <ProfileAvatar size="sm" />
        </div>
      </div>
    </>
  );
});

UserProfileSection.displayName = 'UserProfileSection';

export const SidebarFooter = React.memo(() => {
  const { signOut } = useAuth();

  const handleLogout = React.useCallback(() => {
    signOut();
  }, [signOut]);

  return (
    <BaseSidebarFooter className="border-t border-slate-200 p-2 bg-[#F8F9FA]">
      <UserProfileSection />
    </BaseSidebarFooter>
  );
});

SidebarFooter.displayName = 'SidebarFooter';
