
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

interface POISubmission {
  id: string;
  submitter_email: string;
  name: string;
  description: string;
  poi_type: string;
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
}

interface ModerationModalProps {
  submission: POISubmission | null;
  onClose: () => void;
  onSave: (submissionId: string, status: string, notes: string) => Promise<void>;
  updating: boolean;
}

const ModerationModal = ({ submission, onClose, onSave, updating }: ModerationModalProps) => {
  const [newStatus, setNewStatus] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    if (submission) {
      setNewStatus(submission.status);
      setAdminNotes(submission.admin_notes || '');
    }
  }, [submission]);

  if (!submission) return null;

  const handleSave = async () => {
    await onSave(submission.id, newStatus, adminNotes);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle>Modera: {submission.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Status</label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Seleziona status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">In Attesa</SelectItem>
                <SelectItem value="approved">Approvata</SelectItem>
                <SelectItem value="rejected">Rifiutata</SelectItem>
                <SelectItem value="edited">Modificata</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Note Admin</label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Aggiungi note per il promotore..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Annulla
            </Button>
            <Button 
              onClick={handleSave}
              disabled={!newStatus || updating}
            >
              {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" strokeWidth={1.5} />}
              Salva Moderazione
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModerationModal;
