
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import POISubmissionCard from './POISubmissionCard';
import ModerationModal from './ModerationModal';

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

      const typedData = (data || []).map(item => ({
        ...item,
        status: item.status as 'pending' | 'approved' | 'rejected' | 'edited'
      }));

      setSubmissions(typedData);
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
          moderated_by: 'admin'
        })
        .eq('id', submissionId);

      if (error) {
        console.error('Error updating submission:', error);
        toast.error('Errore nell\'aggiornamento dello status');
        return;
      }

      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, status: status as 'pending' | 'approved' | 'rejected' | 'edited', admin_notes: notes }
            : sub
        )
      );

      toast.success('Status aggiornato con successo');
      setSelectedSubmission(null);

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

  const handleModerationClose = () => {
    setSelectedSubmission(null);
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
            <POISubmissionCard
              key={submission.id}
              submission={submission}
              onModerate={setSelectedSubmission}
            />
          ))
        )}
      </div>

      <ModerationModal
        submission={selectedSubmission}
        onClose={handleModerationClose}
        onSave={updateSubmissionStatus}
        updating={updating}
      />
    </div>
  );
};

export default POIModerationPanel;
