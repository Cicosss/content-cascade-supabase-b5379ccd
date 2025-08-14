import React from 'react';
import { Card } from '@/components/ui/card';

interface FiltersDebugPanelProps {
  filters: {
    categories: string[];
    period: any;
    withChildren: string;
  };
}

const FiltersDebugPanel: React.FC<FiltersDebugPanelProps> = ({ filters }) => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="p-4 bg-slate-100 border-2 border-dashed border-slate-300">
      <h3 className="text-sm font-semibold text-slate-700 mb-2">🔧 Debug: Active Filters</h3>
      <div className="space-y-1 text-xs text-slate-600">
        <div>
          <strong>Categories:</strong> [{filters.categories.join(', ')}]
        </div>
        <div>
          <strong>With Children:</strong> {filters.withChildren}
        </div>
        <div>
          <strong>Period:</strong> {filters.period ? 'Set' : 'None'}
        </div>
        <div className="mt-2 p-2 bg-white rounded border">
          <strong>Active Filter Count:</strong> {
            (filters.categories.length > 0 && !filters.categories.includes('tutte') ? 1 : 0) +
            (filters.period ? 1 : 0)
          }
        </div>
      </div>
    </Card>
  );
};

export default FiltersDebugPanel;