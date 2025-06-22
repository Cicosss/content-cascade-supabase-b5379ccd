
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Edit, Eye, Loader2 } from 'lucide-react';
import { POISubmission } from './POISubmission';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface PendingSubmissionsTableProps {
  submissions: POISubmission[];
  loading: boolean;
  onApprove: (submission: POISubmission) => void;
  onReject: (submission: POISubmission) => void;
  onEdit: (submission: POISubmission) => void;
  onPreview: (submission: POISubmission) => void;
  updating: boolean;
}

const PendingSubmissionsTable: React.FC<PendingSubmissionsTableProps> = ({
  submissions,
  loading,
  onApprove,
  onReject,
  onEdit,
  onPreview,
  updating
}) => {
  const [actioningId, setActioningId] = useState<string | null>(null);

  const handleAction = async (action: () => void, submissionId: string) => {
    setActioningId(submissionId);
    await action();
    setActioningId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Caricamento proposte...</span>
      </div>
    );
  }

  const pendingSubmissions = submissions.filter(sub => sub.status === 'pending');

  if (pendingSubmissions.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <CheckCircle className="h-16 w-16 mx-auto mb-4 text-green-500" />
          <h3 className="text-lg font-medium mb-2">Nessuna proposta in attesa</h3>
          <p>Tutte le proposte sono state processate!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Proposte da Moderare ({pendingSubmissions.length})</h3>
        <Badge variant="secondary">{pendingSubmissions.length} in attesa</Badge>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Proposta</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Promotore</TableHead>
              <TableHead>Data Invio</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pendingSubmissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{submission.name}</div>
                    {submission.poi_type === 'event' && (
                      <Badge variant="outline" className="mt-1">
                        Evento
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm text-gray-600">{submission.macro_area}</div>
                    <div className="font-medium">{submission.category}</div>
                  </div>
                </TableCell>
                <TableCell>{submission.submitter_email}</TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(submission.created_at), {
                    addSuffix: true,
                    locale: it
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAction(() => onPreview(submission), submission.id)}
                      disabled={updating || actioningId === submission.id}
                      title="Visualizza Anteprima"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAction(() => onEdit(submission), submission.id)}
                      disabled={updating || actioningId === submission.id}
                      title="Modifica"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleAction(() => onReject(submission), submission.id)}
                      disabled={updating || actioningId === submission.id}
                      title="Rifiuta"
                    >
                      {actioningId === submission.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <XCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      onClick={() => handleAction(() => onApprove(submission), submission.id)}
                      disabled={updating || actioningId === submission.id}
                      title="Approva"
                    >
                      {actioningId === submission.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PendingSubmissionsTable;
