
import React from 'react';
import { Filter } from 'lucide-react';

const FilterHeader: React.FC = () => {
  return (
    <div className="flex items-center mb-6">
      <Filter className="h-8 w-8 text-blue-600 mr-4" strokeWidth={1.5} />
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Filtra le Esperienze
        </h2>
        <p className="text-slate-600 mt-1">
          Scopri la Romagna su misura per te
        </p>
      </div>
    </div>
  );
};

export default FilterHeader;
