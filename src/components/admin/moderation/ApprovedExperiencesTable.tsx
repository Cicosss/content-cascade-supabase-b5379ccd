
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Edit, Trash2, Loader2 } from 'lucide-react';
import { ApprovedExperience } from '@/hooks/useApprovedExperiences';
import { formatDistanceToNow } from 'date-fns';
import { it } from 'date-fns/locale';

interface ApprovedExperiencesTableProps {
  experiences: ApprovedExperience[];
  loading: boolean;
  onRevert: (experience: ApprovedExperience) => void;
  onEdit: (experience: ApprovedExperience) => void;
  onDelete: (experience: ApprovedExperience) => void;
  updating: boolean;
}

const ApprovedExperiencesTable: React.FC<ApprovedExperiencesTableProps> = ({
  experiences,
  loading,
  onRevert,
  onEdit,
  onDelete,
  updating
}) => {
  const [actioningId, setActioningId] = useState<string | null>(null);

  const handleAction = async (action: () => void, experienceId: string) => {
    setActioningId(experienceId);
    await action();
    setActioningId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Caricamento esperienze...</span>
      </div>
    );
  }

  if (experiences.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">
          <Edit className="h-16 w-16 mx-auto mb-4 text-blue-500" />
          <h3 className="text-lg font-medium mb-2">Nessuna esperienza approvata</h3>
          <p>Le esperienze approvate appariranno qui.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Esperienze Approvate ({experiences.length})</h3>
        <Badge variant="secondary">{experiences.length} pubblicate</Badge>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome Esperienza</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data Pubblicazione</TableHead>
              <TableHead className="text-right">Azioni</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {experiences.map((experience) => (
              <TableRow key={experience.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{experience.name}</div>
                    {experience.poi_type === 'event' && (
                      <Badge variant="outline" className="mt-1">
                        Evento
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="text-sm text-gray-600">{experience.macro_area}</div>
                    <div className="font-medium">{experience.category}</div>
                  </div>
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(experience.created_at), {
                    addSuffix: true,
                    locale: it
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleAction(() => onDelete(experience), experience.id)}
                      disabled={updating || actioningId === experience.id}
                      title="Elimina Definitivamente"
                    >
                      {actioningId === experience.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleAction(() => onEdit(experience), experience.id)}
                      disabled={updating || actioningId === experience.id}
                      title="Modifica Contenuto Live"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                      onClick={() => handleAction(() => onRevert(experience), experience.id)}
                      disabled={updating || actioningId === experience.id}
                      title="Rimanda in Moderazione"
                    >
                      {actioningId === experience.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <RotateCcw className="h-4 w-4" />
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

export default ApprovedExperiencesTable;
