
import React from 'react';

interface WebcamStatsProps {
  webcamCount: number;
}

const WebcamStats: React.FC<WebcamStatsProps> = ({ webcamCount }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="font-medium">{webcamCount} webcam live attive</span>
      </div>
    </div>
  );
};

export default WebcamStats;
