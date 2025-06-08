
import React from 'react';
import SimpleMap from './SimpleMap';

interface InteractiveMapProps {
  filters: {
    zone: string;
    withChildren: string;
    activityTypes: string[];
    period: any;
    isFirstVisit: boolean;
  };
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ filters }) => {
  console.log('🗺️ InteractiveMap render con SimpleMap:', {
    filters: filters.activityTypes,
    timestamp: new Date().toISOString()
  });

  return <SimpleMap filters={filters} />;
};

export default InteractiveMap;
