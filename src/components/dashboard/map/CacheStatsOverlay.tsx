
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Database, Zap, MapPin } from 'lucide-react';

interface CacheStats {
  totalPOIs: number;
  totalTiles: number;
  freshTiles: number;
  staleTiles: number;
  maxPOIs: number;
  maxTiles: number;
  memoryUsage: string;
}

interface CacheStatsOverlayProps {
  stats: CacheStats;
  className?: string;
}

const CacheStatsOverlay: React.FC<CacheStatsOverlayProps> = ({ stats, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    // Show only in development mode
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  if (!isDev) return null;

  const efficiency = stats.totalTiles > 0 ? Math.round((stats.freshTiles / stats.totalTiles) * 100) : 0;
  const poiUsage = Math.round((stats.totalPOIs / stats.maxPOIs) * 100);

  return (
    <div className={`fixed top-20 right-4 z-50 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 bg-white/90 backdrop-blur-sm"
      >
        <BarChart3 className="h-4 w-4 mr-2" />
        Cache Stats
      </Button>

      {isVisible && (
        <Card className="p-4 bg-white/95 backdrop-blur-sm shadow-lg max-w-xs">
          <h3 className="font-semibold text-sm mb-3 flex items-center">
            <Database className="h-4 w-4 mr-2" />
            Geographic Cache
          </h3>
          
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                POIs:
              </span>
              <span className="font-mono">
                {stats.totalPOIs}/{stats.maxPOIs}
                <span className="ml-1 text-gray-500">({poiUsage}%)</span>
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Tiles:</span>
              <span className="font-mono">
                {stats.totalTiles}/{stats.maxTiles}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="flex items-center">
                <Zap className="h-3 w-3 mr-1 text-green-500" />
                Fresh:
              </span>
              <span className="font-mono text-green-600">
                {stats.freshTiles}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-orange-600">Stale:</span>
              <span className="font-mono text-orange-600">
                {stats.staleTiles}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span>Memory:</span>
              <span className="font-mono">{stats.memoryUsage}</span>
            </div>
            
            <div className="pt-2 border-t">
              <div className="flex justify-between items-center">
                <span>Efficiency:</span>
                <span className={`font-mono font-semibold ${
                  efficiency > 80 ? 'text-green-600' : 
                  efficiency > 50 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {efficiency}%
                </span>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CacheStatsOverlay;
