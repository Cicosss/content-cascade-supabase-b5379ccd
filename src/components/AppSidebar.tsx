
import React from 'react';
import { SidebarContainer } from './sidebar/containers/SidebarContainer';

const AppSidebar = React.memo(() => {
  return <SidebarContainer />;
});

AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;
