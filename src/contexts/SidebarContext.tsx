
import React, { createContext, useContext, useState, useCallback } from 'react';
import { useSidebar } from '@/components/ui/sidebar';

interface SidebarContextType {
  // State
  isCollapsed: boolean;
  
  // UI State
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  
  // Helpers
  getCollapseClasses: (expandedClass: string, collapsedClass: string) => string;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebarState = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebarState must be used within SidebarStateProvider');
  }
  return context;
};

interface SidebarStateProviderProps {
  children: React.ReactNode;
}

export const SidebarStateProvider: React.FC<SidebarStateProviderProps> = ({ children }) => {
  const sidebar = useSidebar();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  
  const isCollapsed = sidebar.state === 'collapsed';
  
  const getCollapseClasses = useCallback((expandedClass: string, collapsedClass: string) => {
    return isCollapsed ? collapsedClass : expandedClass;
  }, [isCollapsed]);

  const value: SidebarContextType = {
    isCollapsed,
    activeSection,
    setActiveSection,
    getCollapseClasses,
  };

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  );
};
