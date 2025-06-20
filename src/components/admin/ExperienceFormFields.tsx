import React, { useEffect, useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MACRO_AREAS, getCategoriesForMacroArea, AVAILABLE_TAGS } from '@/config/categoryMapping';

interface ExperienceFormFieldsProps {
  formData: any;
  onInputChange: (field: string, value: string | string[]) => void;
}

const TARGET_AUDIENCES = [
  { value: 'everyone', label: 'Tutti' },
  { value: 'families', label: 'Famiglie' },
  { value: 'couples', label: 'Coppie' },
  { value: 'young', label: 'Giovani' },
  { value: 'adults', label: 'Adulti' },
  { value: 'seniors', label: 'Senior' }
] as const;

const ExperienceFormFields: React.FC<ExperienceFormFieldsProps> = ({ formData, onInputChange }) => {
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  
  const macroAreaKeys = useMemo(() => Object.keys(MACRO_AREAS), []);

  useEffect(() => {
    if (formData.macro_area) {
      const categories = getCategoriesForMacroArea(formData.macro_area);
      setAvailableCategories(categories);
      
      if (formData.category && !categories.includes(formData.category)) {
        onInputChange('category', '');
      }
    }
  }, [formData.macro_area, formData.category, onInputChange]);

  const handleTagChange = (tag: string, checked: boolean) => {
    const currentTags = formData.tags || [];
    const newTags = checked 
      ? [...currentTags, tag]
      : currentTags.filter((t: string) => t !== tag);
    
    onInputChange('tags', newTags);
  };

  const isEvent = formData.poi_type === 'event';
  const isPlace = formData.poi_type === 'place';

  return (
    <>
      {/* Selezione tipo POI */}
      <div>
        <Label>Tipo di POI *</Label>
        <RadioGroup
          value={formData.poi_type || 'place'}
          onValueChange={(value) => onInputChange('poi_type', value)}
          className="flex flex-row gap-6 mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="place" id="place" />
            <Label htmlFor="place">📍 Luogo Permanente</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="event" id="event" />
            <Label htmlFor="event">🗓️ Evento Temporaneo</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">
            {isEvent ? 'Nome dell\'Evento *' : 'Nome del Luogo *'}
          </Label>
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
              {macroAreaKeys.map((macroArea) => (
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

      <div>
        <Label htmlFor="description">Descrizione</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={3}
        />
      </div>

      {/* Campi condizionali per eventi */}
      {isEvent && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="start_datetime">Data e Ora Inizio *</Label>
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
      )}

      {/* Campo orari per luoghi */}
      {isPlace && (
        <div>
          <Label htmlFor="opening_hours">Orari di Apertura</Label>
          <Textarea
            id="opening_hours"
            value={formData.opening_hours}
            onChange={(e) => onInputChange('opening_hours', e.target.value)}
            placeholder="es. Lun-Ven: 9:00-18:00, Sab: 9:00-13:00, Dom: Chiuso"
            rows={2}
          />
        </div>
      )}

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
          <Label htmlFor="organizer_info">
            {isEvent ? 'Informazioni Organizzatore' : 'Gestore/Proprietario'}
          </Label>
          <Input
            id="organizer_info"
            value={formData.organizer_info}
            onChange={(e) => onInputChange('organizer_info', e.target.value)}
            placeholder={
              isEvent 
                ? 'es. Associazione Culturale XYZ' 
                : 'es. Famiglia Rossi, Comune di...'
            }
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
              <label 
                htmlFor={`tag-${tag}`} 
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
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
