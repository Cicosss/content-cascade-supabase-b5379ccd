
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';


interface HeaderContextType {
  // Navigation state
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Navigation actions (moved to useNavigation hook)
  
  // Sidebar state
  
  // Sidebar state
  sidebarOpen: boolean;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within HeaderProvider');
  }
  return context;
};

interface HeaderProviderProps {
  children: React.ReactNode;
}

export const HeaderProvider: React.FC<HeaderProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  
  // Try to get sidebar state, fallback to false if not available
  let sidebarOpen = false;
  try {
    const sidebar = useSidebar();
    sidebarOpen = sidebar.state === 'expanded';
  } catch {
    // Not within SidebarProvider, use default value
    sidebarOpen = false;
  }
  
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

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
