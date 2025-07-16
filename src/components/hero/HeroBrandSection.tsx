import React from 'react';
import VaporizeTextCycle, { Tag } from "@/components/ui/vaporize-text-effect";

const HeroBrandSection = () => {
  return (
    <div className="flex items-center justify-center mb-4 h-96">
      <VaporizeTextCycle
        texts={[
          "Il territorio",
          "è tra le Tue",
          "mani."
        ]}
        font={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "36rem",
          fontWeight: 700
        }}
        color="rgba(255, 255, 255, 0.9)"
        animation={{
          vaporizeDuration: 1.5,
          fadeInDuration: 1.0,
          waitDuration: 0.8
        }}
        tag={Tag.H2}
      />
    </div>
  );
};
export default HeroBrandSection;