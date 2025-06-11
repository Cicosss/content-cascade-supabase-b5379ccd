
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import ModerationFilters from './ModerationFilters';
import EditExperienceModal from './EditExperienceModal';
import ApprovedExperiencesHeader from './ApprovedExperiencesHeader';
import ApprovedExperiencesSummary from './ApprovedExperiencesSummary';
import ApprovedExperiencesList from './ApprovedExperiencesList';
import { useApprovedExperiences } from '@/hooks/useApprovedExperiences';
import { useExperienceFilters } from '@/hooks/useExperienceFilters';

interface ApprovedExperience {
  id: string;
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
  images: string[];
  video_url: string;
  phone: string;
  email: string;
  start_datetime: string;
  end_datetime: string;
  location_name: string;
  organizer_info: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const ApprovedExperiencesPanel = () => {
  const [editingExperience, setEditingExperience] = useState<ApprovedExperience | null>(null);
  
  const {
    experiences,
    filteredExperiences,
    loading,
    applyFilters,
    deleteExperience,
    updateExperience
  } = useApprovedExperiences();

  const { filters, setFilters, getFilterSummary } = useExperienceFilters(applyFilters);

  const handleEdit = (experience: ApprovedExperience) => {
    setEditingExperience(experience);
  };

  const handleEditClose = () => {
    setEditingExperience(null);
  };

  const handleEditSave = (updatedExperience: ApprovedExperience) => {
    updateExperience(updatedExperience);
    setEditingExperience(null);
  };

  const handleDelete = (experience: ApprovedExperience) => {
    if (window.confirm(`Sei sicuro di voler eliminare l'esperienza "${experience.name}"? Questa azione non può essere annullata.`)) {
      deleteExperience(experience.id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Caricamento esperienze approvate...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ApprovedExperiencesHeader />
      
      <ModerationFilters filters={filters} setFilters={setFilters} />
      
      <ApprovedExperiencesSummary
        filteredCount={filteredExperiences.length}
        totalCount={experiences.length}
        activeFilters={getFilterSummary()}
      />
      
      <ApprovedExperiencesList
        experiences={filteredExperiences}
        totalCount={experiences.length}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <EditExperienceModal
        experience={editingExperience}
        isOpen={!!editingExperience}
        onClose={handleEditClose}
        onSave={handleEditSave}
      />
    </div>
  );
};

export default ApprovedExperiencesPanel;
