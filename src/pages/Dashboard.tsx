
import React from 'react';
import Layout from '@/components/Layout';
import PersonalizedContent from '@/components/dashboard/PersonalizedContent';
import PersonalizedWeather from '@/components/dashboard/PersonalizedWeather';

const Dashboard = () => {
  return (
    <Layout showSidebar={true}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <PersonalizedContent />
            </div>
            <div className="lg:col-span-1">
              <PersonalizedWeather />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
