
import React, { useState, useEffect, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OFFICIAL_CATEGORIES } from '@/config/categoryMapping';

interface BasicInfoFieldsProps {
  formData: {
    poi_type: string;
    name: string;
    category: string;
    description: string;
    opening_hours: string;
  };
  onInputChange: (field: string, value: string) => void;
}

const BasicInfoFields: React.FC<BasicInfoFieldsProps> = ({ formData, onInputChange }) => {
  // Ora usiamo direttamente tutte le 17 categorie ufficiali
  const availableCategories = OFFICIAL_CATEGORIES;
  const isEvent = formData.poi_type === 'event';
  const isPlace = formData.poi_type === 'place';

  return (
    <>
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
          <Label htmlFor="category">Categoria *</Label>
          <Select 
            value={formData.category} 
            onValueChange={(value) => onInputChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleziona la categoria" />
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

      <div>
        <Label htmlFor="description">Descrizione</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => onInputChange('description', e.target.value)}
          rows={3}
        />
      </div>

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
    </>
  );
};

export default BasicInfoFields;
