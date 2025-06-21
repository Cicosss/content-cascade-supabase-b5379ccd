
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';

interface POIDetailErrorProps {
  error: string;
}

const POIDetailError: React.FC<POIDetailErrorProps> = ({ error }) => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">POI non trovato</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Torna alla Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default POIDetailError;
