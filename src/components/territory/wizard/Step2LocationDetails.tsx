
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { AVAILABLE_TAGS } from '@/config/categoryMapping';
import AddressAutocomplete from '@/components/ui/AddressAutocomplete';

interface Step2LocationDetailsProps {
  formData: {
    address: string;
    location_name: string;
    latitude: string;
    longitude: string;
    tags: string[];
    target_audience: string;
  };
  onInputChange: (field: string, value: string | string[]) => void;
  onTagChange: (tag: string, checked: boolean) => void;
}

const Step2LocationDetails: React.FC<Step2LocationDetailsProps> = ({ 
  formData, 
  onInputChange, 
  onTagChange 
}) => {
  const handleAddressSelect = (addressData: any) => {
    onInputChange('address', addressData.address);
    onInputChange('latitude', addressData.latitude.toString());
    onInputChange('longitude', addressData.longitude.toString());
    
    // Aggiorna anche il nome della location se non è già impostato
    if (!formData.location_name && addressData.city) {
      onInputChange('location_name', addressData.city);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Dettagli e Luogo</h3>
        <p className="text-slate-600">Specifica la posizione e le caratteristiche</p>
      </div>

      <div className="space-y-4">
        {/* Indirizzo con autocompletamento */}
        <AddressAutocomplete
          label="Indirizzo *"
          placeholder="Via, Città, Provincia (es. Via Roma 1, Rimini, RN)"
          value={formData.address || ''}
          onAddressSelect={handleAddressSelect}
          required
        />

        <div className="space-y-2">
          <Label htmlFor="location_name">Nome Località</Label>
          <Input
            id="location_name"
            value={formData.location_name}
            onChange={(e) => onInputChange('location_name', e.target.value)}
            placeholder="Es. Centro Storico, Marina"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_audience">Target Audience</Label>
          <Select 
            value={formData.target_audience} 
            onValueChange={(value) => onInputChange('target_audience', value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="everyone">Tutti</SelectItem>
              <SelectItem value="families">Famiglie</SelectItem>
              <SelectItem value="young">Giovani</SelectItem>
              <SelectItem value="adults">Adulti</SelectItem>
              <SelectItem value="senior">Senior</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Tag (opzionali)</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {AVAILABLE_TAGS.map((tag) => (
              <div key={tag} className="flex items-center space-x-2">
                <Checkbox
                  id={`tag-${tag}`}
                  checked={formData.tags?.includes(tag) || false}
                  onCheckedChange={(checked) => onTagChange(tag, checked as boolean)}
                />
                <label htmlFor={`tag-${tag}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {tag}
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2LocationDetails;
