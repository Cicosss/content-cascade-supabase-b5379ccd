
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGoogleMapsAPI } from '@/hooks/useGoogleMapsAPI';
import { useAddressAutocomplete } from '@/hooks/useAddressAutocomplete';
import AddressFeedback from './AddressFeedback';

interface AddressData {
  address: string;
  latitude: number;
  longitude: number;
  city?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

interface AddressAutocompleteProps {
  label?: string;
  placeholder?: string;
  value: string;
  onAddressSelect: (addressData: AddressData) => void;
  className?: string;
  required?: boolean;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  label = "Indirizzo",
  placeholder = "Inizia a digitare l'indirizzo...",
  value,
  onAddressSelect,
  className = "",
  required = false
}) => {
  const { isApiLoaded } = useGoogleMapsAPI();
  
  const { inputRef, isLoading, isConfirmed, resetConfirmation } = useAddressAutocomplete({ 
    isApiLoaded, 
    onAddressSelect: (addressData) => {
      onAddressSelect(addressData);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Se l'utente digita manualmente, resetta la conferma
    if (isConfirmed && e.target.value !== value) {
      resetConfirmation();
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <Label htmlFor="address-autocomplete">
          {label} {required && '*'}
        </Label>
      )}
      <div className="relative">
        <Input
          id="address-autocomplete"
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          defaultValue={value}
          onChange={handleInputChange}
          className={`pr-10 ${isConfirmed ? 'border-green-300 bg-green-50' : ''}`}
          disabled={!isApiLoaded}
          required={required}
        />
        <AddressFeedback 
          isLoading={isLoading}
          isConfirmed={isConfirmed}
          isApiLoaded={isApiLoaded}
        />
      </div>
    </div>
  );
};

export default AddressAutocomplete;
