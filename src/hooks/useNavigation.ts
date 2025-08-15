import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeader } from '@/contexts/HeaderContext';

export const useNavigation = () => {
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useHeader();

  const handleNavigation = useCallback((url: string, closeMobileMenu: boolean = true) => {
    navigate(url);
    if (closeMobileMenu) {
      setMobileMenuOpen(false);
    }
  }, [navigate, setMobileMenuOpen]);

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    handleNavigation,
    handleLogoClick
  };
};