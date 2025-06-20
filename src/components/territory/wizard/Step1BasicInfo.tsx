
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MACRO_AREAS } from '@/config/categoryMapping';
import { FormData } from '@/hooks/usePOIFormData';

interface Step1BasicInfoProps {
  formData: FormData;
  onInputChange: (field: string, value: string) => void;
  availableCategories: string[];
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({ 
  formData, 
  onInputChange, 
  availableCategories 
}) => {
  const getNameLabel = () => {
    switch (formData.poi_type) {
      case 'place':
        return 'Nome del Luogo *';
      case 'event':
        return 'Nome dell\'Evento *';
      default:
        return 'Nome *';
    }
  };

  const getNamePlaceholder = () => {
    switch (formData.poi_type) {
      case 'place':
        return 'es. Ristorante Da Mario, Museo della Città...';
      case 'event':
        return 'es. Concerto Estate 2024, Sagra del Pesce...';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">
            {formData.poi_type === 'place' ? '📍 Informazioni del Luogo' : '🗓️ Informazioni dell\'Evento'}
          </h3>
        </div>

        <div>
          <Label htmlFor="submitter_email">La tua Email *</Label>
          <Input
            id="submitter_email"
            type="email"
            value={formData.submitter_email}
            onChange={(e) => onInputChange('submitter_email', e.target.value)}
            placeholder="La tua email per ricevere aggiornamenti"
            required
          />
        </div>

        <div>
          <Label htmlFor="name">{getNameLabel()}</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder={getNamePlaceholder()}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Descrizione</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder={
              formData.poi_type === 'place' 
                ? 'Descrivi il luogo, i servizi offerti, l\'atmosfera...'
                : 'Descrivi l\'evento, il programma, cosa aspettarsi...'
            }
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="macro_area">Macro-Area *</Label>
            <Select value={formData.macro_area} onValueChange={(value) => onInputChange('macro_area', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona macro-area" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(MACRO_AREAS).map((macroArea) => (
                  <SelectItem key={macroArea} value={macroArea}>
                    {macroArea}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="category">Categoria *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => onInputChange('category', value)}
              disabled={!formData.macro_area}
            >
              <SelectTrigger>
                <SelectValue placeholder={formData.macro_area ? "Seleziona categoria" : "Seleziona prima una macro-area"} />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1BasicInfo;
