
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TerritoryMediaUploader from '../TerritoryMediaUploader';

interface Step3ScheduleMediaProps {
  formData: any;
  onInputChange: (field: string, value: string | string[]) => void;
}

const Step3ScheduleMedia: React.FC<Step3ScheduleMediaProps> = ({ formData, onInputChange }) => {
  const isEvent = formData.poi_type === 'event';
  const isPlace = formData.poi_type === 'place';

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          {isEvent ? 'Orari e Media dell\'Evento' : 'Orari e Media del Luogo'}
        </h3>
        <p className="text-gray-600">
          {isEvent 
            ? 'Aggiungi le date dell\'evento e contenuti multimediali'
            : 'Specifica gli orari di apertura e aggiungi contenuti multimediali'
          }
        </p>
      </div>

      {/* Campi condizionali per eventi */}
      {isEvent && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_datetime">Data e Ora Inizio *</Label>
              <Input
                id="start_datetime"
                type="datetime-local"
                value={formData.start_datetime || ''}
                onChange={(e) => onInputChange('start_datetime', e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="end_datetime">Data e Ora Fine</Label>
              <Input
                id="end_datetime"
                type="datetime-local"
                value={formData.end_datetime || ''}
                onChange={(e) => onInputChange('end_datetime', e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Campo orari per luoghi */}
      {isPlace && (
        <div>
          <Label htmlFor="opening_hours">Orari di Apertura</Label>
          <Textarea
            id="opening_hours"
            value={formData.opening_hours || ''}
            onChange={(e) => onInputChange('opening_hours', e.target.value)}
            placeholder="es. Lun-Ven: 9:00-18:00, Sab: 9:00-13:00, Dom: Chiuso"
            rows={3}
          />
          <p className="text-sm text-gray-500 mt-1">
            Inserisci gli orari di apertura del luogo
          </p>
        </div>
      )}

      {/* Sezione Media */}
      <div>
        <Label className="text-base font-semibold">Contenuti Multimediali</Label>
        <p className="text-sm text-gray-600 mb-4">
          Aggiungi immagini per rendere {isEvent ? 'l\'evento' : 'il luogo'} più attraente
        </p>
        
        <TerritoryMediaUploader
          images={formData.images || []}
          onImagesChange={(images) => onInputChange('images', images)}
        />
      </div>

      {/* URL Sito Web */}
      <div>
        <Label htmlFor="website_url">Sito Web</Label>
        <Input
          id="website_url"
          type="url"
          value={formData.website_url || ''}
          onChange={(e) => onInputChange('website_url', e.target.value)}
          placeholder="https://esempio.com"
        />
      </div>
    </div>
  );
};

export default Step3ScheduleMedia;
