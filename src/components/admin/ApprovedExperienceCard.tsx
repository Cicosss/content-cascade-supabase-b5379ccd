
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, MapPin, Calendar, Phone } from 'lucide-react';

interface ApprovedExperience {
  id: string;
  name: string;
  description: string;
  macro_area: string;
  category: string;
  address: string;
  latitude: number;
  longitude: number;
  price_info: string;
  duration_info: string;
  target_audience: string;
  images: string[];
  video_url: string;
  phone: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  status: string;
  created_at: string;
  updated_at: string;
  tags: string[];
}

interface ApprovedExperienceCardProps {
  experience: ApprovedExperience;
  onEdit: (experience: ApprovedExperience) => void;
  onDelete: (experience: ApprovedExperience) => void;
}

const ApprovedExperienceCard: React.FC<ApprovedExperienceCardProps> = ({
  experience,
  onEdit,
  onDelete
}) => {
  const hasUpdates = experience.updated_at !== experience.created_at;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{experience.name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              ID: {experience.id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="bg-green-100 text-green-800">
              {experience.status || 'Approvata'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(experience)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(experience)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p><strong>Macro-Area:</strong> {experience.macro_area}</p>
            <p><strong>Categoria:</strong> {experience.category}</p>
            <p><strong>Target:</strong> {experience.target_audience}</p>
            {experience.address && (
              <p className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {experience.address}
              </p>
            )}
          </div>
          
          <div>
            {experience.price_info && <p><strong>Prezzo:</strong> {experience.price_info}</p>}
            {experience.duration_info && <p><strong>Durata:</strong> {experience.duration_info}</p>}
            {experience.phone && (
              <p className="flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {experience.phone}
              </p>
            )}
          </div>
        </div>

        {experience.description && (
          <div className="mb-4">
            <strong>Descrizione:</strong>
            <p className="text-sm text-muted-foreground mt-1">{experience.description}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2 items-center mb-4">
          <Badge variant="outline" className="text-xs">
            <Calendar className="h-3 w-3 mr-1" />
            Creata: {new Date(experience.created_at).toLocaleDateString('it-IT')}
          </Badge>
          
          {hasUpdates && (
            <Badge variant="outline" className="text-xs">
              <Edit className="h-3 w-3 mr-1" />
              Aggiornata: {new Date(experience.updated_at).toLocaleDateString('it-IT')}
            </Badge>
          )}
        </div>

        {experience.tags && experience.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {experience.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApprovedExperienceCard;
