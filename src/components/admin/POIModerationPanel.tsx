import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import POISubmissionCard from './POISubmissionCard';
import ModerationModal from './ModerationModal';
import ExperienceUploadForm from './ExperienceUploadForm';
import ModerationFilters from './ModerationFilters';
import ApprovedExperiencesPanel from './ApprovedExperiencesPanel';

interface POISubmission {
  id: string;
  submitter_email: string;
  name: string;
  description: string;
  macro_area: string;
  category: string;
  tags: string[];
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
    macroArea: 'tutti',
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
        status: item.status as 'pending' | 'approved' | 'rejected' | 'edited',
        tags: item.tags || []
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

    if (filters.status !== 'tutti') {
      filtered = filtered.filter(sub => sub.status === filters.status);
    }

    if (filters.category !== 'tutti') {
      filtered = filtered.filter(sub => sub.category === filters.category);
    }

    if (filters.macroArea !== 'tutti') {
      filtered = filtered.filter(sub => sub.macro_area === filters.macroArea);
    }

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

  const copyToMainTable = async (submission: POISubmission) => {
    console.log('🔄 Copying submission to points_of_interest:', submission.name);
    
    // Prepare data for points_of_interest table
    const poiData = {
      id: submission.id, // Keep the same ID to avoid duplicates
      name: submission.name,
      description: submission.description,
      poi_type: submission.poi_type || 'place',
      category: submission.category,
      macro_area: submission.macro_area,
      address: submission.address,
      latitude: submission.latitude,
      longitude: submission.longitude,
      price_info: submission.price_info,
      duration_info: submission.duration_info,
      target_audience: submission.target_audience,
      website_url: submission.website_url,
      phone: submission.phone,
      email: submission.email,
      start_datetime: submission.start_datetime,
      end_datetime: submission.end_datetime,
      location_name: submission.location_name,
      organizer_info: submission.organizer_info,
      images: submission.images,
      tags: submission.tags,
      status: 'approved'
    };

    console.log('🔄 POI data to insert:', poiData);

    // Use upsert to handle both insert and update cases
    const { error: insertError } = await supabase
      .from('points_of_interest')
      .upsert(poiData, {
        onConflict: 'id'
      });

    if (insertError) {
      console.error('❌ Error copying to points_of_interest:', insertError);
      throw new Error(`Errore nel copiare il POI nella tabella principale: ${insertError.message}`);
    }

    console.log('✅ Successfully copied to points_of_interest:', submission.name);
  };

  const updateSubmissionStatus = async (submissionId: string, status: string, notes: string) => {
    setUpdating(true);
    try {
      console.log('🔄 Updating submission status:', { submissionId, status, notes });
      
      // If approving, first copy to main table
      if (status === 'approved' && selectedSubmission) {
        await copyToMainTable(selectedSubmission);
      }

      // Update the submission status
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

      if (status === 'approved') {
        toast.success('POI approvato e pubblicato con successo!');
      } else {
        toast.success('Status aggiornato con successo');
      }
      
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
    fetchSubmissions();
    toast.success('Vista aggiornata!');
  };

  const getFilterSummary = () => {
    const activeFilters = [];
    if (filters.status !== 'tutti') activeFilters.push(`Status: ${filters.status}`);
    if (filters.category !== 'tutti') activeFilters.push(`Categoria: ${filters.category}`);
    if (filters.macroArea !== 'tutti') activeFilters.push(`Macro-Area: ${filters.macroArea}`);
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
      
      <Tabs defaultValue="submissions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submissions">Proposte da Moderare</TabsTrigger>
          <TabsTrigger value="approved">Esperienze Approvate</TabsTrigger>
          <TabsTrigger value="upload">Aggiungi Nuova</TabsTrigger>
        </TabsList>
        
        <TabsContent value="submissions" className="space-y-6">
          <ModerationFilters filters={filters} setFilters={setFilters} />
          
          <Card className="p-4 bg-blue-50 border-blue-200">
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
        </TabsContent>
        
        <TabsContent value="approved">
          <ApprovedExperiencesPanel />
        </TabsContent>
        
        <TabsContent value="upload">
          <ExperienceUploadForm onExperienceAdded={handleExperienceAdded} />
        </TabsContent>
      </Tabs>

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
