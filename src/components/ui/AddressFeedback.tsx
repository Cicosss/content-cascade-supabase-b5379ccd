
import React from 'react';
import { Loader2, MapPin, CheckCircle } from 'lucide-react';

interface AddressFeedbackProps {
  isLoading: boolean;
  isConfirmed: boolean;
  isApiLoaded: boolean;
}

const AddressFeedback: React.FC<AddressFeedbackProps> = ({
  isLoading,
  isConfirmed,
  isApiLoaded
}) => {
  return (
    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
      {!isApiLoaded ? (
        <div className="text-xs text-gray-400">Caricamento...</div>
      ) : isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
      ) : isConfirmed ? (
        <CheckCircle className="h-4 w-4 text-green-500" />
      ) : (
        <MapPin className="h-4 w-4 text-gray-400" />
      )}
    </div>
  );
};

export default AddressFeedback;
