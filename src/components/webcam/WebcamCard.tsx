
import React from 'react';
import { Card } from '@/components/ui/card';
import { MapPin, Eye, Clock } from 'lucide-react';
import { Webcam } from '@/data/webcamData';

interface WebcamCardProps {
  webcam: Webcam;
}

const WebcamCard: React.FC<WebcamCardProps> = ({ webcam }) => {
  const { htmlCode, category, viewers, name, location, description } = webcam;

  return (
    <Card className="overflow-hidden bg-slate-900 group !border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="aspect-video relative overflow-hidden bg-slate-800">
        <div
          dangerouslySetInnerHTML={{ __html: htmlCode }}
          className="w-full h-full"
        />

        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
          LIVE
        </div>

        <div className="absolute top-3 right-3 bg-white text-slate-900 px-3 py-1.5 rounded-md text-xs font-semibold shadow-lg">
          {category}
        </div>

        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/60 text-white px-2 py-1 rounded-md text-xs backdrop-blur-sm">
          <Eye className="h-3 w-3" />
          {viewers}
        </div>
      </div>

      <div className="p-5 space-y-3">
        <h3 className="font-semibold text-lg text-white group-hover:text-blue-300 transition-colors duration-300">
          {name}
        </h3>
        
        <div className="flex items-start gap-2 text-sm text-white/90">
          <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <span className="leading-relaxed font-medium">{location}</span>
        </div>

        <p className="text-sm text-white/80 leading-relaxed font-normal line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between text-xs text-white/70 pt-3 mt-2 border-t border-white/10">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3 w-3" />
            <span className="font-medium">Aggiornato ora</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Eye className="h-3 w-3" />
            <span className="font-medium">{viewers} spettatori</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WebcamCard;
