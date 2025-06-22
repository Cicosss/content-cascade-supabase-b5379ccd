
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ModerationModal from './ModerationModal';
import ExperienceUploadForm from './ExperienceUploadForm';
import ModerationFilters from './ModerationFilters';
import ApprovedExperiencesPanel from './ApprovedExperiencesPanel';
import ModerationStats from './moderation/ModerationStats';
import SubmissionsList from './moderation/SubmissionsList';
import { usePOISubmissions } from './moderation/usePOISubmissions';
import { useSubmissionFilters } from './moderation/useSubmissionFilters';
import { useModerationActions } from './moderation/useModerationActions';
import { POISubmission } from './moderation/POISubmission';

const POIModerationPanel = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<POISubmission | null>(null);
  
  const { submissions, loading, fetchSubmissions, updateSubmissionStatus: updateSubmissionInList, deleteSubmission } = usePOISubmissions();
  const { filteredSubmissions, filters, setFilters, getFilterSummary } = useSubmissionFilters(submissions);
  const { updating, updateSubmissionStatus } = useModerationActions();

  const handleModerationClose = () => {
    setSelectedSubmission(null);
  };

  const handleModerationClick = (submission: POISubmission) => {
    setSelectedSubmission(submission);
  };

  const handleExperienceAdded = () => {
    fetchSubmissions();
    toast.success('Vista aggiornata!');
  };

  const handleUpdateSubmissionStatus = async (submissionId: string, status: string, notes: string) => {
    await updateSubmissionStatus(submissionId, status, notes, selectedSubmission, updateSubmissionInList);
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
      
      <Tabs defaultValue="submissions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="submissions">Proposte da Moderare</TabsTrigger>
          <TabsTrigger value="approved">Esperienze Approvate</TabsTrigger>
          <TabsTrigger value="upload">Aggiungi Nuova</TabsTrigger>
        </TabsList>
        
        <TabsContent value="submissions" className="space-y-6">
          <ModerationFilters filters={filters} setFilters={setFilters} />
          
          <ModerationStats
            filteredCount={filteredSubmissions.length}
            totalCount={submissions.length}
            pendingCount={submissions.filter(s => s.status === 'pending').length}
            approvedCount={submissions.filter(s => s.status === 'approved').length}
            rejectedCount={submissions.filter(s => s.status === 'rejected').length}
            filterSummary={getFilterSummary()}
          />
          
          <SubmissionsList
            submissions={filteredSubmissions}
            onModerate={handleModerationClick}
            onDelete={deleteSubmission}
          />
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
        onSave={handleUpdateSubmissionStatus}
        updating={updating}
      />
    </div>
  );
};

export default POIModerationPanel;
