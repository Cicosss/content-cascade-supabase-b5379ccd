
import React, { useState } from 'react';
import PendingSubmissionsTable from './PendingSubmissionsTable';
import ApprovedExperiencesTable from './ApprovedExperiencesTable';
import RejectSubmissionModal from './RejectSubmissionModal';
import EditSubmissionModal from './EditSubmissionModal';
import EditApprovedModal from './EditApprovedModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import { usePOISubmissions } from './usePOISubmissions';
import { useApprovedExperiences } from '@/hooks/useApprovedExperiences';
import { useModerationActions } from './useModerationActions';
import { POISubmission } from './POISubmission';

interface ModerationTabsProps {
  activeTab: 'pending' | 'approved';
}

const ModerationTabs: React.FC<ModerationTabsProps> = ({ activeTab }) => {
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [editSubmissionModalOpen, setEditSubmissionModalOpen] = useState(false);
  const [editApprovedModalOpen, setEditApprovedModalOpen] = useState(false);
  const [deleteConfirmModalOpen, setDeleteConfirmModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<POISubmission | null>(null);
  const [selectedExperience, setSelectedExperience] = useState<any>(null);

  // Hooks for moderation data and actions
  const { submissions, loading: submissionsLoading, fetchSubmissions, updateSubmissionStatus } = usePOISubmissions();
  const { experiences, loading: experiencesLoading, deleteExperience, deApproveExperience, updateExperience } = useApprovedExperiences();
  const { updating, updateSubmissionStatus: moderateSubmission } = useModerationActions();

  // Moderation action handlers
  const handleApproveSubmission = async (submission: POISubmission) => {
    await moderateSubmission(submission.id, 'approved', 'Approvato dall\'amministratore', submission, updateSubmissionStatus);
    fetchSubmissions();
  };

  const handleRejectSubmission = (submission: POISubmission) => {
    setSelectedSubmission(submission);
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (submissionId: string, reason: string) => {
    await moderateSubmission(submissionId, 'rejected', reason, null, updateSubmissionStatus);
    fetchSubmissions();
  };

  const handleEditSubmission = (submission: POISubmission) => {
    setSelectedSubmission(submission);
    setEditSubmissionModalOpen(true);
  };

  const handlePreviewSubmission = (submission: POISubmission) => {
    const previewUrl = `/esperienze/${submission.id}?preview=true`;
    window.open(previewUrl, '_blank');
  };

  const handleRevertExperience = async (experience: any) => {
    await deApproveExperience(experience);
  };

  const handleEditApproved = (experience: any) => {
    setSelectedExperience(experience);
    setEditApprovedModalOpen(true);
  };

  const handleDeleteExperience = (experience: any) => {
    setSelectedExperience(experience);
    setDeleteConfirmModalOpen(true);
  };

  const handleConfirmDelete = async (experienceId: string) => {
    await deleteExperience(experienceId);
  };

  if (activeTab === 'pending') {
    return (
      <>
        <PendingSubmissionsTable
          submissions={submissions}
          loading={submissionsLoading}
          onApprove={handleApproveSubmission}
          onReject={handleRejectSubmission}
          onEdit={handleEditSubmission}
          onPreview={handlePreviewSubmission}
          updating={updating}
        />

        {/* Moderation Modals */}
        <RejectSubmissionModal
          submission={selectedSubmission}
          isOpen={rejectModalOpen}
          onClose={() => {
            setRejectModalOpen(false);
            setSelectedSubmission(null);
          }}
          onConfirm={handleConfirmReject}
        />

        <EditSubmissionModal
          submission={selectedSubmission}
          isOpen={editSubmissionModalOpen}
          onClose={() => {
            setEditSubmissionModalOpen(false);
            setSelectedSubmission(null);
          }}
          onSave={fetchSubmissions}
        />
      </>
    );
  }

  return (
    <>
      <ApprovedExperiencesTable
        experiences={experiences}
        loading={experiencesLoading}
        onRevert={handleRevertExperience}
        onEdit={handleEditApproved}
        onDelete={handleDeleteExperience}
        updating={updating}
      />

      {/* Approved Experience Modals */}
      <EditApprovedModal
        experience={selectedExperience}
        isOpen={editApprovedModalOpen}
        onClose={() => {
          setEditApprovedModalOpen(false);
          setSelectedExperience(null);
        }}
        onSave={updateExperience}
      />

      <DeleteConfirmModal
        experience={selectedExperience}
        isOpen={deleteConfirmModalOpen}
        onClose={() => {
          setDeleteConfirmModalOpen(false);
          setSelectedExperience(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
};

export default ModerationTabs;
