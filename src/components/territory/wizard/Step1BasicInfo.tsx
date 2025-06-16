
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MACRO_AREAS, getCategoriesForMacroArea } from '@/config/categoryMapping';

interface Step1BasicInfoProps {
  formData: {
    name: string;
    macro_area: string;
    category: string;
    description: string;
    submitter_email: string;
  };
  onInputChange: (field: string, value: string) => void;
  availableCategories: string[];
}

const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({ 
  formData, 
  onInputChange, 
  availableCategories 
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Informazioni Principali</h3>
        <p className="text-slate-600">Inserisci le informazioni base del POI/Evento</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="submitter_email">Email del Promotore *</Label>
          <Input
            id="submitter_email"
            type="email"
            value={formData.submitter_email}
            onChange={(e) => onInputChange('submitter_email', e.target.value)}
            placeholder="La tua email"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nome POI/Evento *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            placeholder="Nome dell'attrazione o evento"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="macro_area">Macro-Area *</Label>
            <Select 
              value={formData.macro_area} 
              onValueChange={(value) => onInputChange('macro_area', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona la macro-area" />
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
          
          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => onInputChange('category', value)}
              disabled={!formData.macro_area}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleziona prima una macro-area" />
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

        <div className="space-y-2">
          <Label htmlFor="description">Descrizione *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => onInputChange('description', e.target.value)}
            placeholder="Descrizione dettagliata del POI o evento"
            rows={4}
            required
          />
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;
