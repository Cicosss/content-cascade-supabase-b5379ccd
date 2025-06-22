
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import PasswordAuth from '@/components/territory/PasswordAuth';
import POISubmissionForm from '@/components/territory/POISubmissionForm';
import ImprovedSubmissionsList from '@/components/territory/ImprovedSubmissionsList';
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
    return (
      <Layout>
        <PasswordAuth onAuthenticated={handleAuthenticated} />
      </Layout>
    );
  }

  const approvedCount = submissions.filter(sub => sub.status === 'approved').length;

  return (
    <Layout showSidebar={true}>
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

          {/* Gamification Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl">💎</span>
              <p className="text-lg text-emerald-800">
                Grazie al tuo contributo, <span className="font-bold text-emerald-900">{approvedCount} gemme nascoste</span> sono state scoperte dalla nostra community.
              </p>
              <span className="text-2xl">🌟</span>
            </div>
          </div>

          {/* Le mie submissions - Versione Migliorata */}
          <ImprovedSubmissionsList submissions={submissions} />
        </div>
      </div>
    </Layout>
  );
};

export default TerritoryPromoter;
