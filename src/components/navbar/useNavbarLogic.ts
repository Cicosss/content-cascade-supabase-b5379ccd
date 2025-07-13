import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSidebar } from '@/components/ui/sidebar';

interface Logo {
  url: string;
  src?: string;
  alt: string;
  title: string;
}

export const useNavbarLogic = (logo: Logo) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  
  // Safe sidebar state check
  let sidebarState = null;
  try {
    sidebarState = useSidebar();
  } catch {
    // Not inside a SidebarProvider
  }

  const handleLogoClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    navigate(logo.url);
  }, [navigate, logo.url]);

  const handleNavigation = useCallback((url: string) => {
    navigate(url);
    setIsMobileOpen(false);
  }, [navigate]);

  const handleMobileMenuChange = useCallback((open: boolean) => {
    setIsMobileOpen(open);
  }, []);

  return {
    isMobileOpen,
    sidebarState,
    handleLogoClick,
    handleNavigation,
    handleMobileMenuChange
  };
};