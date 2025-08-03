
import React from 'react';
import { MenuContainer } from '../containers/MenuContainer';
import { UserProfileContainer } from '../containers/UserProfileContainer';
import { SidebarFooter as BaseSidebarFooter } from '@/components/ui/sidebar';

const SidebarView = React.memo(() => {
  return (
    <>
      <MenuContainer />
      <BaseSidebarFooter className="border-t border-slate-200 p-2 bg-[#F8F9FA]">
        <UserProfileContainer />
      </BaseSidebarFooter>
    </>
  );
});

SidebarView.displayName = 'SidebarView';

export { SidebarView };
