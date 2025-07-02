
import React from 'react';
import { Euro, Clock, Users } from 'lucide-react';

interface POIPracticalInfoProps {
  priceInfo?: string;
  durationInfo?: string;
  targetAudience?: string;
}

const POIPracticalInfo: React.FC<POIPracticalInfoProps> = ({
  priceInfo,
  durationInfo,
  targetAudience
}) => {
  return (
    <>
      {priceInfo && (
        <div className="flex items-start gap-3">
          <Euro className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-xs text-gray-600">Prezzo</p>
            <p className="text-gray-900 text-sm">{priceInfo}</p>
          </div>
        </div>
      )}

      {durationInfo && (
        <div className="flex items-start gap-3">
          <Clock className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-xs text-gray-600">Durata</p>
            <p className="text-gray-900 text-sm">{durationInfo}</p>
          </div>
        </div>
      )}

      {targetAudience && targetAudience !== 'everyone' && (
        <div className="flex items-start gap-3">
          <Users className="h-4 w-4 text-gray-400 mt-1 flex-shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="font-medium text-xs text-gray-600">Pubblico</p>
            <p className="text-gray-900 text-sm">{targetAudience}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default POIPracticalInfo;
