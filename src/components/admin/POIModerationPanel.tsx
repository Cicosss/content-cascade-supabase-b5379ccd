import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import POISubmissionCard from './POISubmissionCard';
import ModerationModal from './ModerationModal';
import ExperienceUploadForm from './ExperienceUploadForm';
import ModerationFilters from './ModerationFilters';

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
  const [filteredSubmissions, setFilteredSubmissions] = useState<POISubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<POISubmission | null>(null);
  const [updating, setUpdating] = useState(false);
  
  const [filters, setFilters] = useState({
    status: 'tutti',
    category: 'tutti',
    poiType: 'tutti',
    searchTerm: ''
  });

  useEffect(() => {
    fetchSubmissions();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [submissions, filters]);

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

  const applyFilters = () => {
    let filtered = [...submissions];

    // Filtro per status
    if (filters.status !== 'tutti') {
      filtered = filtered.filter(sub => sub.status === filters.status);
    }

    // Filtro per categoria
    if (filters.category !== 'tutti') {
      filtered = filtered.filter(sub => sub.category === filters.category);
    }

    // Filtro per tipo POI
    if (filters.poiType !== 'tutti') {
      filtered = filtered.filter(sub => sub.poi_type === filters.poiType);
    }

    // Filtro per ricerca testuale
    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(sub => 
        sub.name.toLowerCase().includes(searchLower) ||
        (sub.description && sub.description.toLowerCase().includes(searchLower)) ||
        sub.submitter_email.toLowerCase().includes(searchLower) ||
        (sub.address && sub.address.toLowerCase().includes(searchLower))
      );
    }

    setFilteredSubmissions(filtered);
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

  const deleteSubmission = async (submissionId: string) => {
    try {
      const { error } = await supabase
        .from('poi_submissions')
        .delete()
        .eq('id', submissionId);

      if (error) {
        console.error('Error deleting submission:', error);
        toast.error('Errore nell\'eliminazione della proposta');
        return;
      }

      setSubmissions(prev => prev.filter(sub => sub.id !== submissionId));
      toast.success('Proposta eliminata con successo');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'eliminazione della proposta');
    }
  };

  const handleModerationClose = () => {
    setSelectedSubmission(null);
  };

  const handleExperienceAdded = () => {
    // Ricarica le submissions per aggiornare la vista
    // (anche se le esperienze vanno direttamente in points_of_interest)
    fetchSubmissions();
    toast.success('Vista aggiornata!');
  };

  const getFilterSummary = () => {
    const activeFilters = [];
    if (filters.status !== 'tutti') activeFilters.push(`Status: ${filters.status}`);
    if (filters.category !== 'tutti') activeFilters.push(`Categoria: ${filters.category}`);
    if (filters.poiType !== 'tutti') activeFilters.push(`Tipo: ${filters.poiType}`);
    if (filters.searchTerm) activeFilters.push(`Ricerca: "${filters.searchTerm}"`);
    
    return activeFilters.length > 0 ? activeFilters.join(' • ') : 'Nessun filtro attivo';
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
      
      {/* Nuovo form per aggiungere esperienze */}
      <ExperienceUploadForm onExperienceAdded={handleExperienceAdded} />
      
      {/* Filtri di moderazione */}
      <ModerationFilters filters={filters} setFilters={setFilters} />
      
      {/* Riepilogo filtri e contatori */}
      <Card className="mb-6 p-4 bg-blue-50 border-blue-200">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600">Filtri attivi: {getFilterSummary()}</p>
            <p className="text-lg font-semibold text-blue-800">
              Mostrando {filteredSubmissions.length} di {submissions.length} proposte
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              In attesa: {submissions.filter(s => s.status === 'pending').length} • 
              Approvate: {submissions.filter(s => s.status === 'approved').length} • 
              Rifiutate: {submissions.filter(s => s.status === 'rejected').length}
            </p>
          </div>
        </div>
      </Card>
      
      <div className="grid gap-6">
        {filteredSubmissions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {submissions.length === 0 
                  ? 'Nessuna proposta POI trovata' 
                  : 'Nessuna proposta corrisponde ai filtri selezionati'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSubmissions.map((submission) => (
            <POISubmissionCard
              key={submission.id}
              submission={submission}
              onModerate={setSelectedSubmission}
              onDelete={deleteSubmission}
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
