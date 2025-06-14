import React from 'react';
import { Filter } from 'lucide-react';

const FilterHeader: React.FC = () => {
  return (
    <div className="flex items-center mb-8">
      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
        <Filter className="h-6 w-6 text-white" strokeWidth={0} fill="currentColor" />
      </div>
      <div>
        <h2 className="text-3xl font-bold text-slate-900">
          Personalizza la tua Esperienza
        </h2>
        <p className="text-slate-600 mt-1">
          Filtra e scopri la Romagna su misura per te
        </p>
      </div>
    </div>
  );
};

export default FilterHeader;
