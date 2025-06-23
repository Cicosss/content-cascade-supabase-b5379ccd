
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const POIDetailHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 group"
          aria-label="Torna indietro"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default POIDetailHeader;
