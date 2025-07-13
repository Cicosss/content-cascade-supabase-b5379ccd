
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { POISubmission } from './POISubmission';

export const useModerationActions = () => {
  const [updating, setUpdating] = useState(false);

  const copyToMainTable = async (submission: POISubmission) => {
    console.log('🔄 Copying submission to points_of_interest:', submission.name);
    
    // 🔍 DEBUG: Controllo dettagliato coordinate
    console.log('🔍 Controllo coordinate:', {
      latitude: submission.latitude,
      longitude: submission.longitude,
      latType: typeof submission.latitude,
      lngType: typeof submission.longitude
    });
    
    // ✅ VALIDAZIONE: Coordinate obbligatorie
    if (!submission.latitude || !submission.longitude) {
      console.error('❌ Coordinate mancanti:', { 
        latitude: submission.latitude, 
        longitude: submission.longitude 
      });
      throw new Error(`Impossibile approvare: mancano le coordinate geografiche nella proposta "${submission.name}"`);
    }

    // 🔄 CONVERSIONE: Assicurati che siano numeri
    const latitude = typeof submission.latitude === 'string' 
      ? parseFloat(submission.latitude) 
      : submission.latitude;
    const longitude = typeof submission.longitude === 'string' 
      ? parseFloat(submission.longitude) 
      : submission.longitude;

    // ✅ VALIDAZIONE: Numeri validi
    if (isNaN(latitude) || isNaN(longitude)) {
      console.error('❌ Coordinate non valide:', { 
        original_lat: submission.latitude,
        original_lng: submission.longitude,
        parsed_lat: latitude,
        parsed_lng: longitude
      });
      throw new Error(`Coordinate non valide per "${submission.name}": lat=${latitude}, lng=${longitude}`);
    }
    
    const poiData = {
      id: submission.id,
      name: submission.name,
      description: submission.description,
      poi_type: submission.poi_type || 'place',
      category: submission.category,
      address: submission.address,
      latitude: latitude, // 🔧 Usa i valori validati e convertiti
      longitude: longitude, // 🔧 Usa i valori validati e convertiti
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
      opening_hours: submission.opening_hours,
      status: 'approved'
    };

    console.log('🔄 POI data to insert (VALIDATED):', {
      ...poiData,
      coordinates_validated: true,
      lat_type: typeof poiData.latitude,
      lng_type: typeof poiData.longitude
    });

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

  const updateSubmissionStatus = async (
    submissionId: string, 
    status: string, 
    notes: string,
    submission: POISubmission | null,
    onStatusUpdate: (submissionId: string, status: string, notes: string) => void
  ) => {
    setUpdating(true);
    try {
      console.log('🔄 Updating submission status:', { submissionId, status, notes });
      
      if (status === 'approved' && submission) {
        await copyToMainTable(submission);
      }

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

      onStatusUpdate(submissionId, status, notes);

      if (status === 'approved') {
        toast.success('POI approvato e pubblicato con successo!');
      } else {
        toast.success('Status aggiornato con successo');
      }

      if (status !== 'pending' && submission) {
        await sendModerationNotification(submission, status, notes);
      }
    } catch (error) {
      console.error('🚨 ERRORE COMPLETO durante aggiornamento status:', error);
      
      // 🔧 Gestione errori specifici per coordinate mancanti
      if (error instanceof Error && error.message.includes('coordinate geografiche')) {
        toast.error(`❌ ${error.message}`);
      } else if (error instanceof Error && error.message.includes('Coordinate non valide')) {
        toast.error(`❌ ${error.message}`);
      } else {
        toast.error('Errore nell\'aggiornamento dello status');
      }
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

  return {
    updating,
    updateSubmissionStatus
  };
};
