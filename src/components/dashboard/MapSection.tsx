
import React from 'react';
import { Card } from '@/components/ui/card';
import GoogleMap from './GoogleMap';

interface MapSectionProps {
  filters: {
    categories: string[];
    zone: string;
  };
}

const MapSection: React.FC<MapSectionProps> = ({ filters }) => {
  // Trasforma i filtri per il formato richiesto da GoogleMap
  const mapFilters = {
    activityTypes: filters.categories,
    zone: filters.zone,
    withChildren: 'no'
  };

  return (
    <Card className="p-6 rounded-3xl border-0 shadow-xl bg-white/95 backdrop-blur-sm">
      <div className="flex items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Mappa Interattiva
          </h2>
          <p className="text-slate-600 mt-1">
            Esplora le esperienze sulla mappa
          </p>
        </div>
      </div>
      
      <div className="h-96 rounded-xl overflow-hidden">
        <GoogleMap filters={mapFilters} />
      </div>
    </Card>
  );
};

export default MapSection;
