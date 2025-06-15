
import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MACRO_AREAS, getCategoriesForMacroArea, AVAILABLE_TAGS } from '@/config/categoryMapping';

interface ExperienceFormFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string | string[]) => void;
}

const targetAudiences = [
  { value: 'everyone', label: 'Tutti' },
  { value: 'families', label: 'Famiglie' },
  { value: 'couples', label: 'Coppie' },
  { value: 'young', label: 'Giovani' },
  { value: 'adults', label: 'Adulti' },
  { value: 'seniors', label: 'Senior' }
];

const ExperienceFormFields: React.FC<ExperienceFormFieldsProps> = ({ formData, onInputChange }) => {
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    if (formData.macro_area) {
      const categories = getCategoriesForMacroArea(formData.macro_area);
      setAvailableCategories(categories);
      
      // Reset category if it's not valid for the new macro area
      if (formData.category && !categories.includes(formData.category)) {
        onInputChange('category', '');
      }
    }
  }, [formData.macro_area]);

  const handleTagChange = (tag: string, checked: boolean) => {
    const currentTags = formData.tags || [];
    let newTags;
    
    if (checked) {
      newTags = [...currentTags, tag];
    } else {
      newTags = currentTags.filter((t: string) => t !== tag);
    }
    
    onInputChange('tags', newTags);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nome Esperienza *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            required
          />
        </div>
        
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
      </div>

      <div>
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

      <div>
        <Label htmlFor="description">Descrizione</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start_datetime">Data e Ora Inizio</Label>
          <Input
            id="start_datetime"
            type="datetime-local"
            value={formData.start_datetime}
            onChange={(e) => onInputChange('start_datetime', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="end_datetime">Data e Ora Fine</Label>
          <Input
            id="end_datetime"
            type="datetime-local"
            value={formData.end_datetime}
            onChange={(e) => onInputChange('end_datetime', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="location_name">Nome Location</Label>
          <Input
            id="location_name"
            value={formData.location_name}
            onChange={(e) => onInputChange('location_name', e.target.value)}
            placeholder="es. Teatro Comunale"
          />
        </div>
        
        <div>
          <Label htmlFor="organizer_info">Informazioni Organizzatore</Label>
          <Input
            id="organizer_info"
            value={formData.organizer_info}
            onChange={(e) => onInputChange('organizer_info', e.target.value)}
            placeholder="es. Associazione Culturale XYZ"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="address">Indirizzo</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => onInputChange('address', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="latitude">Latitudine</Label>
          <Input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude}
            onChange={(e) => onInputChange('latitude', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="longitude">Longitudine</Label>
          <Input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude}
            onChange={(e) => onInputChange('longitude', e.target.value)}
          />
        </div>
      </div>

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
          <Label htmlFor="duration_info">Durata</Label>
          <Input
            id="duration_info"
            value={formData.duration_info}
            onChange={(e) => onInputChange('duration_info', e.target.value)}
            placeholder="es. 2 ore"
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
              {targetAudiences.map((audience) => (
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

      <div>
        <Label>Tag (opzionali)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
          {AVAILABLE_TAGS.map((tag) => (
            <div key={tag} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag}`}
                checked={formData.tags?.includes(tag) || false}
                onCheckedChange={(checked) => handleTagChange(tag, checked as boolean)}
              />
              <label htmlFor={`tag-${tag}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {tag}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ExperienceFormFields;
