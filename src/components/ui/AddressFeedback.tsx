
import React from 'react';
import { Loader2, MapPin, CheckCircle } from 'lucide-react';

interface AddressFeedbackProps {
  isLoading: boolean;
  isAddressConfirmed: boolean;
  isApiLoaded: boolean;
}

const AddressFeedback: React.FC<AddressFeedbackProps> = ({
  isLoading,
  isAddressConfirmed,
  isApiLoaded
}) => {
  return (
    <>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
        ) : isAddressConfirmed ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <MapPin className="h-4 w-4 text-gray-400" />
        )}
      </div>
      {!isApiLoaded && (
        <p className="text-xs text-gray-500">Caricamento servizio indirizzi...</p>
      )}
    </>
  );
};

export default AddressFeedback;
