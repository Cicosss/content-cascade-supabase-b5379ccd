
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check, MapPin } from 'lucide-react';
import { useUserVisits } from '@/hooks/useUserVisits';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface VisitButtonProps {
  poiId: string;
  poiName: string;
}

const VisitButton: React.FC<VisitButtonProps> = ({ poiId, poiName }) => {
  const { user } = useAuth();
  const { addVisit, hasVisited, loading } = useUserVisits();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const visited = hasVisited(poiId);

  const handleVisit = async () => {
    if (!user) {
      toast.error('Devi essere autenticato per registrare una visita');
      return;
    }

    if (visited) return;

    setIsSubmitting(true);
    const success = await addVisit(poiId);
    
    if (success) {
      toast.success(`✅ Hai visitato ${poiName}!`, {
        description: 'La tua visita è stata registrata nel tuo passaporto'
      });
    } else {
      toast.error('Errore nel registrare la visita');
    }
    
    setIsSubmitting(false);
  };

  if (!user) return null;

  return (
    <Button
      onClick={handleVisit}
      disabled={visited || isSubmitting || loading}
      className={`w-full transition-all duration-300 ${
        visited 
          ? 'bg-green-500 hover:bg-green-600 text-white' 
          : 'bg-blue-600 hover:bg-blue-700 text-white'
      }`}
    >
      {visited ? (
        <>
          <Check className="h-5 w-5 mr-2" />
          Visitato!
        </>
      ) : (
        <>
          <MapPin className="h-5 w-5 mr-2" />
          {isSubmitting ? 'Registrando...' : 'Ci sono stato!'}
        </>
      )}
    </Button>
  );
};

export default VisitButton;
