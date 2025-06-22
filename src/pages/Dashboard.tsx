
import React from 'react';
import Layout from '@/components/Layout';
import PersonalizedContent from '@/components/dashboard/PersonalizedContent';
import PersonalizedWeather from '@/components/dashboard/PersonalizedWeather';

const Dashboard = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-50">
        <div className="container mx-auto px-4 py-6 space-y-6">
          <PersonalizedWeather />
          <PersonalizedContent />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
