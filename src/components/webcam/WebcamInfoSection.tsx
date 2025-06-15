
import React from 'react';
import { Card } from '@/components/ui/card';

const WebcamInfoSection = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/60">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Webcam Live 24/7
          </h2>
          <p className="text-slate-600 leading-relaxed mb-6">
            Le nostre webcam sono attive 24 ore su 24, 7 giorni su 7. Puoi vedere in tempo reale 
            le condizioni meteorologiche, l'affluenza nelle spiagge e la bellezza dei paesaggi romagnoli. 
            Perfetto per pianificare la tua visita o semplicemente per ammirare la Romagna da casa.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">16</div>
              <div className="text-sm text-slate-600">Webcam Attive</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">24/7</div>
              <div className="text-sm text-slate-600">Streaming Live</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600 mb-1">HD</div>
              <div className="text-sm text-slate-600">Qualità Video</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WebcamInfoSection;
