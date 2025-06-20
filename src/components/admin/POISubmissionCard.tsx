
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MapPin, Calendar, Globe, Phone, Trash2 } from 'lucide-react';

interface POISubmission {
  id: string;
  submitter_email: string;
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
  website_url: string;
  phone: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  video_url: string;
  images: string[];
  status: 'pending' | 'approved' | 'rejected' | 'edited';
  admin_notes: string;
  created_at: string;
  updated_at: string;
  moderated_at: string;
  moderated_by: string;
  tags: string[];
}

interface POISubmissionCardProps {
  submission: POISubmission;
  onModerate: (submission: POISubmission) => void;
  onDelete: (submissionId: string) => void;
}

const STATUS_CONFIG = {
  pending: { variant: 'outline' as const, label: 'In Attesa' },
  approved: { variant: 'default' as const, label: 'Approvata' },
  rejected: { variant: 'destructive' as const, label: 'Rifiutata' },
  edited: { variant: 'secondary' as const, label: 'Modificata' }
};

const POISubmissionCard = ({ submission, onModerate, onDelete }: POISubmissionCardProps) => {
  const statusConfig = STATUS_CONFIG[submission.status] || STATUS_CONFIG.pending;

  const handleDelete = () => {
    if (window.confirm(`Sei sicuro di voler eliminare la proposta "${submission.name}"? Questa azione non può essere annullata.`)) {
      onDelete(submission.id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{submission.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Proposta da: {submission.submitter_email}
            </p>
            <p className="text-xs text-muted-foreground">
              ID: {submission.id}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={statusConfig.variant} className="rounded-xl">
              {statusConfig.label}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div>
            <p><strong>Macro-Area:</strong> {submission.macro_area}</p>
            <p><strong>Categoria:</strong> {submission.category}</p>
            <p><strong>Target:</strong> {submission.target_audience}</p>
            {submission.address && (
              <p className="flex items-center gap-1">
                <MapPin className="h-4 w-4" strokeWidth={1.5} />
                {submission.address}
              </p>
            )}
          </div>
          
          <div>
            {submission.price_info && <p><strong>Prezzo:</strong> {submission.price_info}</p>}
            {submission.duration_info && <p><strong>Durata:</strong> {submission.duration_info}</p>}
            {submission.phone && (
              <p className="flex items-center gap-1">
                <Phone className="h-4 w-4" strokeWidth={1.5} />
                {submission.phone}
              </p>
            )}
            {submission.website_url && (
              <p className="flex items-center gap-1">
                <Globe className="h-4 w-4" strokeWidth={1.5} />
                <a href={submission.website_url} target="_blank" rel="noopener noreferrer" 
                   className="text-blue-600 hover:underline truncate">
                  {submission.website_url}
                </a>
              </p>
            )}
          </div>
        </div>

        {submission.description && (
          <div className="mb-4">
            <strong>Descrizione:</strong>
            <p className="text-sm text-muted-foreground mt-1">{submission.description}</p>
          </div>
        )}

        {submission.admin_notes && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <strong>Note Admin:</strong>
            <p className="text-sm mt-1">{submission.admin_notes}</p>
          </div>
        )}

        {submission.tags && submission.tags.length > 0 && (
          <div className="mb-4">
            <strong>Tags:</strong>
            <div className="flex flex-wrap gap-1 mt-1">
              {submission.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 items-center">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onModerate(submission)}
            className="rounded-xl"
          >
            <Eye className="h-4 w-4 mr-1" strokeWidth={1.5} />
            Modera
          </Button>
          
          <Badge variant="outline" className="text-xs rounded-xl">
            <Calendar className="h-3 w-3 mr-1" strokeWidth={1.5} />
            {new Date(submission.created_at).toLocaleDateString('it-IT')}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default POISubmissionCard;
