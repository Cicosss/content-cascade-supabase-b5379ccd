
import React from 'react';
import { ProfileAvatarView } from './ProfileAvatarView';
import { useNavigationHandler } from '../logic/NavigationHandler';
import { useSidebar } from '@/components/ui/sidebar';

interface UserProfileViewProps {
  profile: any;
  onSignOut: () => void;
}

const UserProfileView = React.memo<UserProfileViewProps>(({ profile, onSignOut }) => {
  const { handleProfileNavigation } = useNavigationHandler();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  const buttonProps = {
    onClick: handleProfileNavigation,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleProfileNavigation();
      }
    },
    tabIndex: 0,
    role: "button" as const,
    "aria-label": "Vai al profilo utente"
  };

  if (isCollapsed) {
    return (
      <div className="flex justify-center p-1 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        {...buttonProps}
      >
        <ProfileAvatarView size="sm" profile={profile} />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      {...buttonProps}
    >
      <ProfileAvatarView size="md" profile={profile} />
      <div className="flex-1 min-w-0">
        <p className="typography-small font-bold text-slate-900 truncate">
          {profile?.first_name || 'giulia'}
        </p>
        <p className="typography-caption text-slate-500 truncate">
          Promotore Bronzo
        </p>
      </div>
    </div>
  );
});

UserProfileView.displayName = 'UserProfileView';

export { UserProfileView };
