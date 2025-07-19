
import React from 'react';
import VaporizeTextCycle, { Tag } from "@/components/ui/vaporize-text-effect";

const HeroBrandSection = () => {
  return (
    <div className="flex items-center justify-center mb-8 lg:mb-12">
      <VaporizeTextCycle
        texts={[
          "Il territorio",
          "è tra le Tue",
          "mani."
        ]}
        font={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "28rem",
          fontWeight: 700
        }}
        color="rgba(255, 255, 255, 0.95)"
        animation={{
          vaporizeDuration: 1.5,
          fadeInDuration: 1.0,
          waitDuration: 0.8
        }}
        tag={Tag.H1}
      />
    </div>
  );
};

export default HeroBrandSection;
