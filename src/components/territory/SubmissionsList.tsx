
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface POISubmission {
  id: string;
  name: string;
  description: string;
  category: string;
  status: string;
  created_at: string;
  submitter_email: string;
}

interface SubmissionsListProps {
  submissions: POISubmission[];
}

const SubmissionsList: React.FC<SubmissionsListProps> = ({ submissions }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'edited':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approvata';
      case 'rejected':
        return 'Rifiutata';
      case 'edited':
        return 'Modificata';
      default:
        return 'In Revisione';
    }
  };

  if (submissions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Le Tue Proposte</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {submissions.map((submission) => (
            <div key={submission.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{submission.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(submission.status)}`}>
                  {getStatusText(submission.status)}
                </span>
              </div>
              <p className="text-slate-600 text-sm line-clamp-2">{submission.description}</p>
              <div className="flex justify-between items-center text-xs text-slate-500">
                <span>{submission.category}</span>
                <span>{new Date(submission.created_at).toLocaleDateString('it-IT')}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubmissionsList;
