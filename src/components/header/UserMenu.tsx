
import React from 'react';
import ProfileMenu from '@/components/ProfileMenu';

const UserMenu = React.memo(() => {
  return <ProfileMenu />;
});

UserMenu.displayName = 'UserMenu';

export default UserMenu;
