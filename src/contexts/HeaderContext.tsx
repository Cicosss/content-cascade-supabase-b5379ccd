
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';

interface NavigationItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: NavigationItem[];
}

interface HeaderContextType {
  // Navigation state
  isMobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  
  // Navigation actions
  handleNavigation: (url: string) => void;
  handleLogoClick: () => void;
  
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
  const { open: sidebarOpen } = useSidebar();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavigation = useCallback((url: string) => {
    navigate(url);
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const value: HeaderContextType = {
    isMobileMenuOpen,
    setMobileMenuOpen,
    handleNavigation,
    handleLogoClick,
    sidebarOpen: sidebarOpen || false,
  };

  return (
    <HeaderContext.Provider value={value}>
      {children}
    </HeaderContext.Provider>
  );
};
