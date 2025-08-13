import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHeader } from '@/contexts/HeaderContext';

export const useNavigation = () => {
  const navigate = useNavigate();
  const { setMobileMenuOpen } = useHeader();

  const handleNavigation = useCallback((url: string) => {
    navigate(url);
    setMobileMenuOpen(false);
  }, [navigate, setMobileMenuOpen]);

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleAuthNavigation = useCallback((path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  }, [navigate, setMobileMenuOpen]);

  return {
    handleNavigation,
    handleLogoClick,
    handleAuthNavigation
  };
};