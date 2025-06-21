
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContactInfoFieldsProps {
  formData: {
    price_info: string;
    duration_info: string;
    target_audience: string;
    phone: string;
    email: string;
    website_url: string;
    poi_type: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const TARGET_AUDIENCES = [
  { value: 'everyone', label: 'Tutti' },
  { value: 'families', label: 'Famiglie' },
  { value: 'couples', label: 'Coppie' },
  { value: 'young', label: 'Giovani' },
  { value: 'adults', label: 'Adulti' },
  { value: 'seniors', label: 'Senior' }
] as const;

const ContactInfoFields: React.FC<ContactInfoFieldsProps> = ({ formData, onInputChange }) => {
  const isEvent = formData.poi_type === 'event';

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price_info">Informazioni Prezzo</Label>
          <Input
            id="price_info"
            value={formData.price_info}
            onChange={(e) => onInputChange('price_info', e.target.value)}
            placeholder="es. €25 a persona"
          />
        </div>
        
        <div>
          <Label htmlFor="duration_info">
            {isEvent ? 'Durata Evento' : 'Tempo di Visita Consigliato'}
          </Label>
          <Input
            id="duration_info"
            value={formData.duration_info}
            onChange={(e) => onInputChange('duration_info', e.target.value)}
            placeholder={
              isEvent 
                ? 'es. 3 ore, Tutta la giornata' 
                : 'es. 1-2 ore, 30 minuti'
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="target_audience">Pubblico di Riferimento</Label>
          <Select value={formData.target_audience} onValueChange={(value) => onInputChange('target_audience', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TARGET_AUDIENCES.map((audience) => (
                <SelectItem key={audience.value} value={audience.value}>
                  {audience.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="phone">Telefono</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="website_url">Sito Web</Label>
        <Input
          id="website_url"
          type="url"
          value={formData.website_url}
          onChange={(e) => onInputChange('website_url', e.target.value)}
        />
      </div>
    </>
  );
};

export default ContactInfoFields;
