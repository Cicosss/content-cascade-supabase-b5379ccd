
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ProposalCard from './ProposalCard';

interface POISubmission {
  id: string;
  name: string;
  description: string;
  macro_area: string;
  category: string;
  status: string;
  created_at: string;
  submitter_email: string;
  images?: string[];
  admin_notes?: string;
}

interface ImprovedSubmissionsListProps {
  submissions: POISubmission[];
}

const ImprovedSubmissionsList: React.FC<ImprovedSubmissionsListProps> = ({ submissions }) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'approved'>('all');

  const filterSubmissions = (submissions: POISubmission[]) => {
    switch (activeFilter) {
      case 'pending':
        return submissions.filter(sub => sub.status === 'pending' || sub.status === 'rejected');
      case 'approved':
        return submissions.filter(sub => sub.status === 'approved' || sub.status === 'edited');
      default:
        return submissions;
    }
  };

  const filteredSubmissions = filterSubmissions(submissions);

  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case 'pending':
        return 'In Revisione';
      case 'approved':
        return 'Pubblicate';
      default:
        return 'Tutte';
    }
  };

  const getFilterCount = (filter: string) => {
    return filterSubmissions(submissions).length;
  };

  if (submissions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Lo Stato delle Tue Proposte</CardTitle>
        
        {/* Filtri Semplici */}
        <div className="flex gap-2 mt-4">
          {(['all', 'pending', 'approved'] as const).map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveFilter(filter)}
              className="relative"
            >
              {getFilterLabel(filter)}
              {filter !== 'all' && (
                <span className="ml-2 bg-white/20 text-xs px-2 py-0.5 rounded-full">
                  {getFilterCount(filter)}
                </span>
              )}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nessuna proposta trovata per questo filtro.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSubmissions.map((submission) => (
              <ProposalCard key={submission.id} submission={submission} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImprovedSubmissionsList;
