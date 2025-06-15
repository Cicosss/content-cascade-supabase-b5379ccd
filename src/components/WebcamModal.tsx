
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X, MapPin, Eye, Clock } from 'lucide-react';

interface WebcamModalProps {
  isOpen: boolean;
  onClose: () => void;
  webcam: {
    id: number;
    name: string;
    location: string;
    description: string;
    category: string;
    viewers: number;
    htmlCode: string;
  } | null;
}

const WebcamModal: React.FC<WebcamModalProps> = ({ isOpen, onClose, webcam }) => {
  if (!webcam) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black/95 border-0">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 bg-gradient-to-b from-black/50 to-transparent absolute top-0 left-0 right-0 z-10">
          <div className="flex items-start justify-between">
            <div className="text-white">
              <DialogTitle className="text-2xl font-bold mb-2">{webcam.name}</DialogTitle>
              <div className="flex items-center gap-2 text-white/80 mb-2">
                <MapPin className="h-4 w-4" />
                <span>{webcam.location}</span>
              </div>
              <p className="text-white/70 text-sm leading-relaxed">
                {webcam.description}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </DialogHeader>

        {/* Webcam Content */}
        <div className="relative aspect-video w-full">
          <div 
            dangerouslySetInnerHTML={{ __html: webcam.htmlCode }}
            className="w-full h-full"
          />
          
          {/* Live Badge */}
          <div className="absolute top-6 left-6 flex items-center gap-1.5 bg-red-500 text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-lg z-10">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            LIVE
          </div>

          {/* Category Badge */}
          <div className="absolute top-6 right-6 bg-slate-900 text-white px-3 py-1.5 rounded-md text-sm font-semibold shadow-lg z-10">
            {webcam.category}
          </div>
        </div>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6 pt-8">
          <div className="flex items-center justify-between text-white/80">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4" />
                Aggiornato ora
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Eye className="h-4 w-4" />
                {webcam.viewers} spettatori
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WebcamModal;
