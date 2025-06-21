
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
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Indietro
        </button>
      </div>
    </div>
  );
};

export default POIDetailHeader;
