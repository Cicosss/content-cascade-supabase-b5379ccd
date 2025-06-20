
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FormData } from '@/hooks/usePOIFormData';
import TerritoryMediaUploader from '../TerritoryMediaUploader';

interface Step3ScheduleMediaProps {
  formData: FormData;
  onInputChange: (field: string, value: string | string[]) => void;
}

const Step3ScheduleMedia: React.FC<Step3ScheduleMediaProps> = ({ formData, onInputChange }) => {
  const isEvent = formData.poi_type === 'event';
  const isPlace = formData.poi_type === 'place';

  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold">
            {isEvent ? '🗓️ Orari dell\'Evento e Media' : '📍 Orari di Apertura e Media'}
          </h3>
        </div>

        {/* Campi condizionali basati sul tipo */}
        {isEvent && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_datetime">Data e Ora Inizio *</Label>
              <Input
                id="start_datetime"
                type="datetime-local"
                value={formData.start_datetime}
                onChange={(e) => onInputChange('start_datetime', e.target.value)}
                required
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

        {isPlace && (
          <div>
            <Label htmlFor="opening_hours">Orari di Apertura</Label>
            <Textarea
              id="opening_hours"
              value={formData.opening_hours}
              onChange={(e) => onInputChange('opening_hours', e.target.value)}
              placeholder="es. Lun-Ven: 9:00-18:00, Sab: 9:00-13:00, Dom: Chiuso"
              rows={3}
            />
            <p className="text-xs text-gray-500 mt-1">
              Inserisci gli orari di apertura settimanali del luogo
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="organizer_info">
              {isEvent ? 'Organizzatore' : 'Gestore/Proprietario'}
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

        <div>
          <Label htmlFor="video_url">Video YouTube (opzionale)</Label>
          <Input
            id="video_url"
            type="url"
            value={formData.video_url}
            onChange={(e) => onInputChange('video_url', e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <TerritoryMediaUploader
          images={formData.images}
          onImagesChange={(images) => onInputChange('images', images)}
          coverImage={formData.cover_image}
          onCoverImageChange={(coverImage) => onInputChange('cover_image', coverImage)}
        />
      </CardContent>
    </Card>
  );
};

export default Step3ScheduleMedia;
