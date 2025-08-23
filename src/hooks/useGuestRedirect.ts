import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

export const useGuestRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGuestClick = () => {
    if (!user) {
      toast({
        title: "Accesso richiesto",
        description: "Registrati per scoprire tutti i contenuti della Romagna!",
        duration: 3000,
      });
      navigate('/auth');
      return true; // Indica che è stato fatto un redirect
    }
    return false; // L'utente è loggato, non serve redirect
  };

  return {
    isGuest: !user,
    handleGuestClick
  };
};