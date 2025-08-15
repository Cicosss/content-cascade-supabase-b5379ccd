import React, { createContext, useContext, useState, useCallback } from 'react';

interface HomepageNavContextType {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

const HomepageNavContext = createContext<HomepageNavContextType | undefined>(undefined);

export const useHomepageNav = () => {
  const context = useContext(HomepageNavContext);
  if (!context) {
    throw new Error('useHomepageNav must be used within a HomepageNavProvider');
  }
  return context;
};

interface HomepageNavProviderProps {
  children: React.ReactNode;
}

export const HomepageNavProvider: React.FC<HomepageNavProviderProps> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);

  const value: HomepageNavContextType = {
    isMobileMenuOpen,
    toggleMobileMenu,
    closeMobileMenu,
  };

  return (
    <HomepageNavContext.Provider value={value}>
      {children}
    </HomepageNavContext.Provider>
  );
};