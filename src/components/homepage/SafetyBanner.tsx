
import React from 'react';
import { Card } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const SafetyBanner = () => {
  return (
    <Card className="p-6 bg-amber-50 border-amber-200 mb-16">
      <div className="flex items-start space-x-4">
        <AlertTriangle className="h-8 w-8 text-amber-600 mt-1 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-amber-900 mb-3">Prudenza in Mare</h3>
          <p className="text-amber-800 leading-relaxed">
            Controlla sempre le condizioni meteo marine prima di entrare in acqua. Rispetta le bandiere di sicurezza 
            e segui le indicazioni del personale di salvataggio. La tua sicurezza e quella degli altri è la priorità.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default SafetyBanner;
