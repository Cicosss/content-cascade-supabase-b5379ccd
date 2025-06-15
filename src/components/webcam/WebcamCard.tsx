
import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Eye, Clock } from 'lucide-react';

interface WebcamCardProps {
  webcam: {
    id: number;
    name: string;
    location: string;
    description: string;
    category: string;
    isLive: boolean;
    viewers: number;
    htmlCode: string;
  };
}

const WebcamCard: React.FC<WebcamCardProps> = ({ webcam }) => {
  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-slate-900 backdrop-blur-sm border border-slate-600 group">
      {/* Webcam Video Container */}
      <div className="aspect-video relative overflow-hidden bg-slate-800">
        {/* Placeholder for HTML code - sostituirai questo con il tuo codice */}
        <div 
          dangerouslySetInnerHTML={{ __html: webcam.htmlCode }}
          className="w-full h-full"
        />
        
        {/* Live Badge - Unified Style */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          LIVE
        </div>

        {/* Category Badge - Unified Style with Brand Colors */}
        <div className="absolute top-3 right-3 bg-white text-slate-900 px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg">
          {webcam.category}
        </div>

        {/* Viewers Count */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-md text-xs backdrop-blur-sm">
          <Eye className="h-3 w-3" />
          {webcam.viewers}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5">
        <h3 className="font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors">
          {webcam.name}
        </h3>
        
        <div className="flex items-start gap-2 text-sm text-white mb-3">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-white/80" />
          <span className="leading-relaxed font-medium">{webcam.location}</span>
        </div>

        <p className="text-sm text-white leading-relaxed mb-4 font-normal">
          {webcam.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-white/80">
            <Clock className="h-3 w-3" />
            <span className="font-medium">Aggiornato ora</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-white/80">
            <Eye className="h-3 w-3" />
            <span className="font-medium">{webcam.viewers} spettatori</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WebcamCard;
