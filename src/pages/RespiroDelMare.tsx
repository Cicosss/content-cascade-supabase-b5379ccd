
import React from 'react';
import Layout from '@/components/Layout';
import YouTubeVideoBackground from '@/components/respiro/YouTubeVideoBackground';
import FAQSection from '@/components/respiro/FAQSection';
import DonationLevelsSection from '@/components/respiro/DonationLevelsSection';
import PartnersSection from '@/components/respiro/PartnersSection';
import FixedDonationButton from '@/components/respiro/FixedDonationButton';

const YOUTUBE_ID = "z4kYYcmITK8";

const RespiroDelMare = () => {
  return (
    <Layout>
      <div className="bg-white text-slate-800">
        {/* Hero Section with YouTube Video Background */}
        <YouTubeVideoBackground videoId={YOUTUBE_ID}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 drop-shadow-lg">
            Respiro del Mare
          </h1>
          <h2 className="text-2xl md:text-4xl font-light mb-8 drop-shadow-lg">
            Insieme, puliamo le spiagge della Romagna e creiamo opportunità.
          </h2>
        </YouTubeVideoBackground>

        {/* FAQ Section */}
        <FAQSection />

        {/* Donation Levels Section */}
        <DonationLevelsSection />

        {/* Partners Section */}
        <PartnersSection />
      </div>

      {/* Fixed Donation Button */}
      <FixedDonationButton />
    </Layout>
  );
};

export default RespiroDelMare;
