
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PasswordAuth from '@/components/territory/PasswordAuth';
import POISubmissionForm from '@/components/territory/POISubmissionForm';
import SubmissionsList from '@/components/territory/SubmissionsList';
import { useSubmissions } from '@/hooks/useSubmissions';

const TerritoryPromoter: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { submissions, fetchSubmissions } = useSubmissions();

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    fetchSubmissions();
  };

  const handleSubmissionSuccess = () => {
    fetchSubmissions();
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <PasswordAuth onAuthenticated={handleAuthenticated} />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-800">
              🏛️ Promotore del Territorio
            </h1>
            <p className="text-xl text-slate-600">
              Inserisci nuove attrazioni e eventi per Mia Romagna
            </p>
          </div>

          {/* Form */}
          <POISubmissionForm onSubmissionSuccess={handleSubmissionSuccess} />

          {/* Le mie submissions */}
          <SubmissionsList submissions={submissions} />
        </div>
      </div>
    </Layout>
  );
};

export default TerritoryPromoter;
