
import React from 'react';
import { Card } from '@/components/ui/card';

interface ApprovedExperiencesSummaryProps {
  filteredCount: number;
  totalCount: number;
  activeFilters: string;
}

const ApprovedExperiencesSummary: React.FC<ApprovedExperiencesSummaryProps> = ({
  filteredCount,
  totalCount,
  activeFilters
}) => {
  return (
    <Card className="p-4 bg-green-50 border-green-200">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-600">Filtri attivi: {activeFilters}</p>
          <p className="text-lg font-semibold text-green-800">
            Mostrando {filteredCount} di {totalCount} esperienze
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">
            Totale esperienze nel database: {totalCount}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default ApprovedExperiencesSummary;
