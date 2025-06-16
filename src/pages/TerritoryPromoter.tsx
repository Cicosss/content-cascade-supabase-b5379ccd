import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PasswordAuth from '@/components/territory/PasswordAuth';
import POISubmissionForm from '@/components/territory/POISubmissionForm';
import SubmissionsList from '@/components/territory/SubmissionsList';
import PromoterStats from '@/components/territory/PromoterStats';
import { useSubmissions } from '@/hooks/useSubmissions';
const TerritoryPromoter: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const {
    submissions,
    fetchSubmissions
  } = useSubmissions();
  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    fetchSubmissions();
  };
  const handleSubmissionSuccess = () => {
    fetchSubmissions();
  };
  if (!isAuthenticated) {
    return <Layout>
        <PasswordAuth onAuthenticated={handleAuthenticated} />
      </Layout>;
  }
  return <Layout>
      <div className="min-h-screen bg-slate-50 p-4">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-slate-800">Diventa la Voce del Tuo Territorio</h1>
            <p className="text-xl text-slate-600">
              Proponi un'attrazione, un evento o una gemma nascosta che ami. La revisioneremo e, se approvata, la condivideremo con migliaia di viaggiatori
            </p>
          </div>

          {/* Form */}
          <POISubmissionForm onSubmissionSuccess={handleSubmissionSuccess} />

          {/* Stats Section */}
          <PromoterStats submissions={submissions} />

          {/* Le mie submissions */}
          <SubmissionsList submissions={submissions} />
        </div>
      </div>
    </Layout>;
};
export default TerritoryPromoter;