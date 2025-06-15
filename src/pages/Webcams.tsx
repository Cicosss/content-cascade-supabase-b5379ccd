
import React from 'react';
import Layout from '@/components/Layout';
import WebcamHero from '@/components/webcam/WebcamHero';
import WebcamFilters from '@/components/webcam/WebcamFilters';
import WebcamStats from '@/components/webcam/WebcamStats';
import WebcamCard from '@/components/webcam/WebcamCard';
import WebcamInfoSection from '@/components/webcam/WebcamInfoSection';
import { webcamsData, categories } from '@/data/webcamData';

const Webcams = () => {
  const [selectedCategory, setSelectedCategory] = React.useState("Tutti");

  const filteredWebcams = React.useMemo(() => {
    return selectedCategory === "Tutti" 
      ? webcamsData 
      : webcamsData.filter(webcam => webcam.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <Layout showSidebar>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <WebcamHero />

        <div className="container mx-auto px-6 py-12">
          <WebcamFilters 
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />

          <WebcamStats webcamCount={filteredWebcams.length} />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {filteredWebcams.map((webcam) => (
              <WebcamCard key={webcam.id} webcam={webcam} />
            ))}
          </div>

          <WebcamInfoSection />
        </div>
      </div>
    </Layout>
  );
};

export default Webcams;
