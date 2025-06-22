
import React from 'react';
import { Card } from '@/components/ui/card';

interface ModerationStatsProps {
  filteredCount: number;
  totalCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  filterSummary: string;
}

const ModerationStats = ({ 
  filteredCount, 
  totalCount, 
  pendingCount, 
  approvedCount, 
  rejectedCount, 
  filterSummary 
}: ModerationStatsProps) => {
  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Filtri attivi: {filterSummary}</p>
          <p className="text-lg font-semibold text-blue-800">
            Mostrando {filteredCount} di {totalCount} proposte
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            In attesa: {pendingCount} • 
            Approvate: {approvedCount} • 
            Rifiutate: {rejectedCount}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ModerationStats;
