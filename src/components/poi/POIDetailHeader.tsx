
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const POIDetailHeader: React.FC = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Desktop back button overlay, matching mobile style and position */}
      <button
        onClick={() => navigate(-1)}
        aria-label="Torna indietro"
        className="hidden sm:flex absolute top-4 left-4 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white shadow-md hover:bg-black/60 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
      </button>
    </>
  );
};

export default POIDetailHeader;
