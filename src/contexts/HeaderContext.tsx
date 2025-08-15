
import React, { createContext, useContext, useState } from 'react';
import { useSidebar } from '@/components/ui/sidebar';

interface HeaderContextType {
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  sidebarOpen: boolean;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    // Safe fallback to prevent runtime crashes when provider is missing
    return {
      isMobileMenuOpen: false,
      setMobileMenuOpen: () => {},
      sidebarOpen: false,
    } as HeaderContextType;
  }
  return context;
};

interface HeaderProviderProps {
  children: React.ReactNode;
}

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Get sidebar state with safe fallback
  const getSidebarState = () => {
    try {
      const sidebar = useSidebar();
      return sidebar.state === 'expanded';
    } catch {
      return false;
    }
  };
  
  const sidebarOpen = getSidebarState();

  const value: HeaderContextType = {
    isMobileMenuOpen,
    setMobileMenuOpen,
    sidebarOpen,
  };

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  );
};
