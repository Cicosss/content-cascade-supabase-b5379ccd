import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavigation = () => {
  const navigate = useNavigate();

  const handleNavigation = useCallback((url: string) => {
    navigate(url);
  }, [navigate]);

  const handleLogoClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    handleNavigation,
    handleLogoClick
  };
};