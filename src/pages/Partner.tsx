
import React from 'react';
import Layout from '@/components/Layout';
import PartnerHero from '@/components/partner/PartnerHero';
import PartnerBenefits from '@/components/partner/PartnerBenefits';
import PartnerOffer from '@/components/partner/PartnerOffer';
import PartnerContact from '@/components/partner/PartnerContact';

const Partner = () => {
  return (
    <Layout>
      <div className="min-h-screen">
        <PartnerHero />
        <PartnerBenefits />
        <PartnerOffer />
        <PartnerContact />
      </div>
    </Layout>
  );
};

export default Partner;
