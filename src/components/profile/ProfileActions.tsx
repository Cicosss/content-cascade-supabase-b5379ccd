
import React from 'react';
import { Button } from '@/components/ui/button';

interface ProfileActionsProps {
  loading: boolean;
  onSave: () => void;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  loading,
  onSave
}) => {
  return (
    <Button 
      onClick={onSave} 
      disabled={loading}
      className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
    >
      {loading ? 'Salvando...' : 'Salva Profilo'}
    </Button>
  );
};
