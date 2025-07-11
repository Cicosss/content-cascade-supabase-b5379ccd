
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Eye, Calendar, AlertCircle } from 'lucide-react';

interface POISubmission {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  submitter_email: string;
  images?: string[];
  admin_notes?: string;
}

interface ProposalCardProps {
  submission: POISubmission;
}

const ProposalCard: React.FC<ProposalCardProps> = ({ submission }) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'approved':
        return {
          color: 'bg-green-100 text-green-800',
          label: 'Pubblicata!',
          message: 'Congratulazioni! La tua proposta è ora visibile a tutti.',
          icon: '🎉'
        };
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800',
          label: 'Azione Richiesta',
          message: 'Manca un piccolo dettaglio. Clicca qui per vedere le note del nostro team e aggiornare la proposta.',
          icon: '🔄'
        };
      case 'edited':
        return {
          color: 'bg-blue-100 text-blue-800',
          label: 'Modificata',
          message: 'La proposta è stata aggiornata dal nostro team.',
          icon: '✏️'
        };
      default:
        return {
          color: 'bg-yellow-100 text-yellow-800',
          label: 'In Revisione',
          message: 'Il nostro team la sta valutando. Grazie per la pazienza!',
          icon: '⏳'
        };
    }
  };

  const statusInfo = getStatusInfo(submission.status);
  const hasImage = submission.images && submission.images.length > 0;
  const thumbnailImage = hasImage ? submission.images[0] : null;
  
  // Mock visualizations for approved submissions
  const mockViews = submission.status === 'approved' ? Math.floor(Math.random() * 2000) + 100 : null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const CardContent = () => (
    <div className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        <div className="flex gap-4">
          {/* Thumbnail a sinistra */}
          <div className="flex-shrink-0">
            {thumbnailImage ? (
              <img
                src={thumbnailImage}
                alt={submission.name}
                className="w-16 h-16 object-cover rounded-lg border"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded-lg border flex items-center justify-center">
                <span className="text-gray-400 text-2xl">📍</span>
              </div>
            )}
          </div>

          {/* Contenuto a destra */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-900 truncate">{submission.name}</h3>
              <Badge className={`${statusInfo.color} ml-2 flex-shrink-0`}>
                <span className="mr-1">{statusInfo.icon}</span>
                {statusInfo.label}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
              <Calendar className="h-4 w-4" />
              <span>Inviata il {formatDate(submission.created_at)}</span>
            </div>

            <p className="text-sm text-gray-700 mb-3">
              {statusInfo.message}
            </p>

            {mockViews && submission.status === 'approved' && (
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Eye className="h-4 w-4" />
                <span className="font-medium">Visualizzazioni: {mockViews.toLocaleString()}</span>
              </div>
            )}

            <div className="mt-3 text-xs text-gray-500">
              {submission.category}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Se lo stato è "rejected" e ci sono note admin, mostra il dialog
  if (submission.status === 'rejected' && submission.admin_notes) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <div className="cursor-pointer">
            <CardContent />
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Note del Team di Revisione
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{submission.admin_notes}</p>
            </div>
            <p className="text-sm text-gray-600">
              Puoi aggiornare la tua proposta tenendo conto di questi suggerimenti e inviarla nuovamente.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return <CardContent />;
};

export default ProposalCard;
