
import React from 'react';
import { Eye } from 'lucide-react';

const ApprovedExperiencesHeader: React.FC = () => {
  return (
    <div className="flex items-center mb-4">
      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-xl flex items-center justify-center mr-3">
        <Eye className="h-5 w-5 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900">
        Esperienze Approvate nel Database
      </h2>
    </div>
  );
};

export default ApprovedExperiencesHeader;
