
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Eye, MapPin, Calendar, User, Globe, Phone, Mail } from 'lucide-react';

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

const POIModerationPanel = () => {
  const [submissions, setSubmissions] = useState<POISubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<POISubmission | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from('poi_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching submissions:', error);
        toast.error('Errore nel caricamento delle proposte');
        return;
      }

      setSubmissions(data || []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nel caricamento delle proposte');
    } finally {
      setLoading(false);
    }
  };

  const updateSubmissionStatus = async (submissionId: string, status: string, notes: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase
        .from('poi_submissions')
        .update({
          status,
          admin_notes: notes,
          moderated_at: new Date().toISOString(),
          moderated_by: 'admin' // Puoi sostituire con l'ID dell'admin loggato
        })
        .eq('id', submissionId);

      if (error) {
        console.error('Error updating submission:', error);
        toast.error('Errore nell\'aggiornamento dello status');
        return;
      }

      // Aggiorna la lista locale
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, status: status as any, admin_notes: notes }
            : sub
        )
      );

      toast.success('Status aggiornato con successo');
      setSelectedSubmission(null);
      setNewStatus('');
      setAdminNotes('');

      // Invia email di notifica al promotore se necessario
      if (status !== 'pending') {
        await sendModerationNotification(selectedSubmission!, status, notes);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'aggiornamento dello status');
    } finally {
      setUpdating(false);
    }
  };

  const sendModerationNotification = async (submission: POISubmission, decision: string, notes: string) => {
    try {
      const { error } = await supabase.functions.invoke('send-poi-notification', {
        body: {
          submission,
          type: 'moderation_result',
          decision,
          admin_notes: notes
        }
      });

      if (error) {
        console.error('Error sending notification:', error);
        toast.error('Errore nell\'invio della notifica email');
      } else {
        toast.success('Email di notifica inviata al promotore');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'invio della notifica email');
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'rejected': return 'destructive';
      case 'edited': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'In Attesa';
      case 'approved': return 'Approvata';
      case 'rejected': return 'Rifiutata';
      case 'edited': return 'Modificata';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Caricamento proposte POI...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">🏛️ Panel di Moderazione POI</h1>
      
      <div className="grid gap-6">
        {submissions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">Nessuna proposta POI trovata</p>
            </CardContent>
          </Card>
        ) : (
          submissions.map((submission) => (
            <Card key={submission.id} className="w-full">
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
                  <Badge variant={getStatusBadgeVariant(submission.status)}>
                    {getStatusLabel(submission.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p><strong>Categoria:</strong> {submission.category}</p>
                    <p><strong>Tipo:</strong> {submission.poi_type}</p>
                    <p><strong>Target:</strong> {submission.target_audience}</p>
                    {submission.address && (
                      <p className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {submission.address}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    {submission.price_info && <p><strong>Prezzo:</strong> {submission.price_info}</p>}
                    {submission.duration_info && <p><strong>Durata:</strong> {submission.duration_info}</p>}
                    {submission.phone && (
                      <p className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {submission.phone}
                      </p>
                    )}
                    {submission.website_url && (
                      <p className="flex items-center gap-1">
                        <Globe className="h-4 w-4" />
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

                <div className="flex flex-wrap gap-2 items-center">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedSubmission(submission);
                      setNewStatus(submission.status);
                      setAdminNotes(submission.admin_notes || '');
                    }}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    Modera
                  </Button>
                  
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(submission.created_at).toLocaleDateString('it-IT')}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Modal di Moderazione */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Modera: {selectedSubmission.name}</CardTitle>
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
                  onClick={() => {
                    setSelectedSubmission(null);
                    setNewStatus('');
                    setAdminNotes('');
                  }}
                >
                  Annulla
                </Button>
                <Button 
                  onClick={() => updateSubmissionStatus(selectedSubmission.id, newStatus, adminNotes)}
                  disabled={!newStatus || updating}
                >
                  {updating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Salva Moderazione
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default POIModerationPanel;
