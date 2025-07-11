
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OFFICIAL_CATEGORIES } from '@/config/categoryMapping';
import { FormData } from '@/hooks/usePOIFormData';
import RichTextEditor from '@/components/ui/rich-text-editor';

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

  const getDescriptionPlaceholder = () => {
    switch (formData.poi_type) {
      case 'place':
        return 'Descrivi il luogo, i servizi offerti, l\'atmosfera...';
      case 'event':
        return 'Descrivi l\'evento, il programma, cosa aspettarsi...';
      default:
        return 'Descrivi questa esperienza...';
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
          <RichTextEditor
            value={formData.description}
            onChange={(value) => onInputChange('description', value)}
            placeholder={getDescriptionPlaceholder()}
          />
        </div>

        <div>
          <Label htmlFor="category">Categoria *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => onInputChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona categoria" />
            </SelectTrigger>
            <SelectContent>
              {OFFICIAL_CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default Step1BasicInfo;
