
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ApprovedExperience {
  id: string;
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
  images: string[];
  website_url: string;
  phone: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  status: string;
  created_at: string;
  updated_at: string;
  tags: string[];
  poi_type: string;
  opening_hours: string;
}

interface Filters {
  status: string;
  category: string;
  macroArea: string;
  searchTerm: string;
  poiType: string;
}

export const useApprovedExperiences = () => {
  const [experiences, setExperiences] = useState<ApprovedExperience[]>([]);
  const [filteredExperiences, setFilteredExperiences] = useState<ApprovedExperience[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovedExperiences = async () => {
    try {
      const { data, error } = await supabase
        .from('points_of_interest')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching approved experiences:', error);
        toast.error('Errore nel caricamento delle esperienze approvate');
        return;
      }

      // Transform the data to match our interface
      const transformedData = (data || []).map(item => ({
        ...item,
        website_url: item.website_url || '',
        poi_type: item.poi_type || 'place',
        opening_hours: item.opening_hours || ''
      }));

      setExperiences(transformedData);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nel caricamento delle esperienze approvate');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (filters: Filters) => {
    let filtered = [...experiences];

    if (filters.status !== 'tutti') {
      filtered = filtered.filter(exp => exp.status === filters.status);
    }

    if (filters.category !== 'tutti') {
      filtered = filtered.filter(exp => exp.category === filters.category);
    }

    if (filters.macroArea !== 'tutti') {
      filtered = filtered.filter(exp => exp.macro_area === filters.macroArea);
    }

    // Nuovo filtro per tipo POI
    if (filters.poiType !== 'tutti') {
      filtered = filtered.filter(exp => exp.poi_type === filters.poiType);
    }

    if (filters.searchTerm.trim()) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(exp => 
        exp.name.toLowerCase().includes(searchLower) ||
        (exp.description && exp.description.toLowerCase().includes(searchLower)) ||
        (exp.address && exp.address.toLowerCase().includes(searchLower))
      );
    }

    console.log('🔍 Filtri applicati:', filters);
    console.log('📊 Risultati filtrati:', filtered.length, 'su', experiences.length);

    setFilteredExperiences(filtered);
  };

  const deleteExperience = async (experienceId: string) => {
    try {
      const { error } = await supabase
        .from('points_of_interest')
        .delete()
        .eq('id', experienceId);

      if (error) {
        console.error('Error deleting experience:', error);
        toast.error('Errore nell\'eliminazione dell\'esperienza');
        return;
      }

      setExperiences(prev => prev.filter(exp => exp.id !== experienceId));
      toast.success('Esperienza eliminata con successo');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Errore nell\'eliminazione dell\'esperienza');
    }
  };

  const deApproveExperience = async (experience: ApprovedExperience) => {
    try {
      console.log('🔄 Starting de-approval process for:', experience.name);

      // Step 1: Check if POI submission record exists
      console.log('🔍 Checking if poi_submissions record exists...');
      const { data: existingSubmission, error: checkError } = await supabase
        .from('poi_submissions')
        .select('id')
        .eq('id', experience.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('❌ Error checking poi_submissions:', checkError);
        throw new Error(`Errore nel controllo della proposta: ${checkError.message}`);
      }

      // Step 2: If record doesn't exist, create it with POI data
      if (!existingSubmission) {
        console.log('📝 Creating new poi_submissions record...');
        const submissionData = {
          id: experience.id,
          submitter_email: experience.email || 'admin@miaromagna.it',
          name: experience.name,
          description: experience.description,
          macro_area: experience.macro_area,
          category: experience.category,
          address: experience.address,
          latitude: experience.latitude,
          longitude: experience.longitude,
          price_info: experience.price_info,
          duration_info: experience.duration_info,
          target_audience: experience.target_audience,
          website_url: experience.website_url,
          phone: experience.phone,
          email: experience.email,
          start_datetime: experience.start_datetime,
          end_datetime: experience.end_datetime,
          location_name: experience.location_name,
          organizer_info: experience.organizer_info,
          images: experience.images,
          tags: experience.tags,
          poi_type: experience.poi_type,
          opening_hours: experience.opening_hours,
          status: 'pending',
          admin_notes: 'Rimandato in moderazione dall\'amministratore',
          created_at: experience.created_at,
          updated_at: new Date().toISOString(),
          moderated_at: new Date().toISOString(),
          moderated_by: 'admin'
        };

        const { error: insertError } = await supabase
          .from('poi_submissions')
          .insert(submissionData);

        if (insertError) {
          console.error('❌ Error creating poi_submissions record:', insertError);
          throw new Error(`Errore nella creazione della proposta: ${insertError.message}`);
        }

        console.log('✅ Successfully created poi_submissions record');
      } else {
        // Step 3: Update existing record status to pending
        console.log('🔄 Updating existing poi_submissions record...');
        const { error: updateError } = await supabase
          .from('poi_submissions')
          .update({
            status: 'pending',
            admin_notes: 'Rimandato in moderazione dall\'amministratore',
            moderated_at: new Date().toISOString(),
            moderated_by: 'admin',
            updated_at: new Date().toISOString()
          })
          .eq('id', experience.id);

        if (updateError) {
          console.error('❌ Error updating poi_submissions:', updateError);
          throw new Error(`Errore nell'aggiornamento della proposta: ${updateError.message}`);
        }

        console.log('✅ Successfully updated poi_submissions record');
      }

      // Step 4: Remove from points_of_interest (make it invisible to public)
      console.log('🔄 Removing from points_of_interest...');
      const { error: deleteError } = await supabase
        .from('points_of_interest')
        .delete()
        .eq('id', experience.id);

      if (deleteError) {
        console.error('❌ Error removing from points_of_interest:', deleteError);
        
        // Rollback: reset poi_submissions status if it was updated
        console.log('🔄 Rolling back poi_submissions status...');
        await supabase
          .from('poi_submissions')
          .update({
            status: 'approved',
            admin_notes: 'Rollback automatico dopo errore',
            moderated_at: new Date().toISOString(),
            moderated_by: 'admin'
          })
          .eq('id', experience.id);
        
        throw new Error(`Errore nella rimozione dal pubblico: ${deleteError.message}`);
      }

      // Step 5: Update local state
      setExperiences(prev => prev.filter(exp => exp.id !== experience.id));
      
      console.log('✅ Successfully completed de-approval process for:', experience.name);
      toast.success(`"${experience.name}" è stato spostato in "Proposte da Moderare"`);

    } catch (error) {
      console.error('❌ Complete de-approval process failed:', error);
      toast.error(`Errore nel rimandare "${experience.name}" in moderazione: ${error.message}`);
    }
  };

  const updateExperience = (updatedExperience: ApprovedExperience) => {
    setExperiences(prev => 
      prev.map(exp => 
        exp.id === updatedExperience.id ? updatedExperience : exp
      )
    );
  };

  useEffect(() => {
    fetchApprovedExperiences();
  }, []);

  return {
    experiences,
    filteredExperiences,
    loading,
    applyFilters,
    deleteExperience,
    deApproveExperience,
    updateExperience
  };
};
