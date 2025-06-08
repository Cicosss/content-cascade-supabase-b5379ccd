
import React from 'react';

interface MapContainerProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  children: React.ReactNode;
}

export const MapContainer: React.FC<MapContainerProps> = ({ mapContainer, children }) => {
  return (
    <div className="flex-1 relative">
      <div ref={mapContainer} className="absolute inset-0" />
      {children}
    </div>
  );
};
