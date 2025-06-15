
import React from 'react';
import Layout from '@/components/Layout';
import YouTubeVideoBackground from '@/components/respiro/YouTubeVideoBackground';
import FAQSection from '@/components/respiro/FAQSection';
import DonationLevelsSection from '@/components/respiro/DonationLevelsSection';
import PartnersSection from '@/components/respiro/PartnersSection';
import FixedDonationButton from '@/components/respiro/FixedDonationButton';

const YOUTUBE_VIDEO_ID = "z4kYYcmITK8";

const RespiroDelMare: React.FC = () => {
  return (
    <Layout>
      <div className="bg-white text-slate-800">
        <YouTubeVideoBackground videoId={YOUTUBE_VIDEO_ID}>
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight drop-shadow-2xl">
              Respiro del Mare
            </h1>
            <h2 className="text-xl md:text-3xl lg:text-4xl font-light max-w-4xl mx-auto leading-relaxed drop-shadow-lg">
              Insieme, puliamo la Costa della Romagna e creiamo Opportunità.
            </h2>
          </div>
        </YouTubeVideoBackground>

        {/* Sezioni del contenuto */}
        <FAQSection />
        <DonationLevelsSection />
        <PartnersSection />
      </div>

      {/* Pulsante di donazione fisso */}
      <FixedDonationButton />
    </Layout>
  );
};

export default RespiroDelMare;
