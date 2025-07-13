
import React from 'react';
import Layout from '@/components/Layout';
import FamilyHero from '@/components/family/FamilyHero';
import AgeGroupsSection from '@/components/family/AgeGroupsSection';
import FamilyActivitiesSection from '@/components/family/FamilyActivitiesSection';
import FamilyBenefitsSection from '@/components/family/FamilyBenefitsSection';
import FamilyTipsSection from '@/components/family/FamilyTipsSection';

const Family = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-slate-50">
        <FamilyHero />
      
      <div className="container mx-auto px-4 py-12">
        <AgeGroupsSection />
        <FamilyActivitiesSection />
        <FamilyBenefitsSection />
        <FamilyTipsSection />
        </div>
      </div>
    </Layout>
  );
};

export default Family;
