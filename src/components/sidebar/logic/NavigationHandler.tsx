
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const useNavigationHandler = () => {
  const navigate = useNavigate();

  const handleNavigation = React.useCallback((url: string) => {
    navigate(url);
  }, [navigate]);

  const handleProfileNavigation = React.useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  return {
    handleNavigation,
    handleProfileNavigation,
  };
};
