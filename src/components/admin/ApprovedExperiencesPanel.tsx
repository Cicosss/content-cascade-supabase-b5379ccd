
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import ModerationFilters from './ModerationFilters';
import EditExperienceModal from './EditExperienceModal';
import ApprovedExperiencesHeader from './ApprovedExperiencesHeader';
import ApprovedExperiencesSummary from './ApprovedExperiencesSummary';
import ApprovedExperiencesList from './ApprovedExperiencesList';
import { useApprovedExperiences, ApprovedExperience } from '@/hooks/useApprovedExperiences';
import { useExperienceFilters } from '@/hooks/useExperienceFilters';

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
    if (window.confirm(`Sei sicuro di voler eliminare "${experience.name}"? Questa azione non può essere annullata.`)) {
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

  // Calcola statistiche per tipo POI
  const placeCount = experiences.filter(exp => exp.poi_type === 'place').length;
  const eventCount = experiences.filter(exp => exp.poi_type === 'event').length;

  return (
    <div className="space-y-6">
      <ApprovedExperiencesHeader />
      
      {/* Statistiche per tipo POI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-xl">📍</span>
            <div>
              <p className="text-sm text-blue-600 font-medium">Luoghi</p>
              <p className="text-2xl font-bold text-blue-800">{placeCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <span className="text-green-600 text-xl">🗓️</span>
            <div>
              <p className="text-sm text-green-600 font-medium">Eventi</p>
              <p className="text-2xl font-bold text-green-800">{eventCount}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-xl">📊</span>
            <div>
              <p className="text-sm text-gray-600 font-medium">Totale</p>
              <p className="text-2xl font-bold text-gray-800">{experiences.length}</p>
            </div>
          </div>
        </div>
      </div>
      
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
