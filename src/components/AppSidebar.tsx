
import React from 'react';
import { SidebarRoot } from './sidebar/core/SidebarRoot';

interface AppSidebarProps {
  enableDebug?: boolean;
  enableGlassmorphism?: boolean;
}

const AppSidebar: React.FC<AppSidebarProps> = ({ 
  enableDebug = false,
  enableGlassmorphism = true 
}) => {
  return (
    <SidebarRoot 
      enableDebug={enableDebug}
      enableGlassmorphism={enableGlassmorphism}
    />
  );
};

AppSidebar.displayName = 'AppSidebar';

export default AppSidebar;
