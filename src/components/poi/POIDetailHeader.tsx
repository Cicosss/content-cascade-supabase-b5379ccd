
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const POIDetailHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Mobile overlay back button */}
      <div className="sm:hidden">
        <button
          onClick={() => navigate(-1)}
          aria-label="Torna indietro"
          className="fixed top-3 left-3 z-[5000] flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 shadow-md hover:bg-black/60 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Desktop header bar */}
      <div className="hidden sm:block bg-white border-b">
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
    </div>
  );
};

export default POIDetailHeader;
