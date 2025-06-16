
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import TerritoryMediaUploader from '../TerritoryMediaUploader';

interface Step3ScheduleMediaProps {
  formData: {
    start_datetime: string;
    end_datetime: string;
    price_info: string;
    duration_info: string;
    website_url: string;
    email: string;
    phone: string;
    video_url: string;
    organizer_info: string;
    images: string[];
    cover_image: string;
  };
  onInputChange: (field: string, value: string | string[]) => void;
}

const Step3ScheduleMedia: React.FC<Step3ScheduleMediaProps> = ({ 
  formData, 
  onInputChange 
}) => {
  const handleImagesChange = (images: string[]) => {
    onInputChange('images', images);
  };

  const handleVideoUrlChange = (url: string) => {
    onInputChange('video_url', url);
  };

  const handleCoverImageChange = (url: string) => {
    onInputChange('cover_image', url);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">Orari e Media</h3>
        <p className="text-slate-600">Completa con orari, contatti e contenuti multimediali</p>
      </div>

      <div className="space-y-4">
        {/* Date e Orari */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="start_datetime">Data/Ora Inizio</Label>
            <Input
              id="start_datetime"
              type="datetime-local"
              value={formData.start_datetime}
              onChange={(e) => onInputChange('start_datetime', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_datetime">Data/Ora Fine</Label>
            <Input
              id="end_datetime"
              type="datetime-local"
              value={formData.end_datetime}
              onChange={(e) => onInputChange('end_datetime', e.target.value)}
            />
          </div>
        </div>

        {/* Prezzo e Durata */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price_info">Informazioni Prezzo</Label>
            <Input
              id="price_info"
              value={formData.price_info}
              onChange={(e) => onInputChange('price_info', e.target.value)}
              placeholder="Es. Gratuito, €15 a persona"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration_info">Durata</Label>
            <Input
              id="duration_info"
              value={formData.duration_info}
              onChange={(e) => onInputChange('duration_info', e.target.value)}
              placeholder="Es. 2 ore, Tutto il giorno"
            />
          </div>
        </div>

        {/* Contatti */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="website_url">Sito Web</Label>
            <Input
              id="website_url"
              type="url"
              value={formData.website_url}
              onChange={(e) => onInputChange('website_url', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email di Contatto</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange('email', e.target.value)}
              placeholder="info@esempio.it"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefono</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            placeholder="Numero di telefono"
          />
        </div>

        {/* Media Uploader */}
        <TerritoryMediaUploader
          images={formData.images || []}
          videoUrl={formData.video_url}
          coverImage={formData.cover_image || ''}
          onImagesChange={handleImagesChange}
          onVideoUrlChange={handleVideoUrlChange}
          onCoverImageChange={handleCoverImageChange}
        />

        {/* Note organizzatore */}
        <div className="space-y-2">
          <Label htmlFor="organizer_info">Informazioni Organizzatore</Label>
          <Textarea
            id="organizer_info"
            value={formData.organizer_info}
            onChange={(e) => onInputChange('organizer_info', e.target.value)}
            placeholder="Chi organizza questo evento/gestisce questo POI"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
};

export default Step3ScheduleMedia;
