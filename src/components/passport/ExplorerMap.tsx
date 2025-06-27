
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, MapPin, Utensils, Camera, Heart, Star } from 'lucide-react';
import { useUserAchievements } from '@/hooks/useUserAchievements';

const ExplorerMap: React.FC = () => {
  const { 
    achievements, 
    userProgress, 
    loading,
    getCompletedCount 
  } = useUserAchievements();

  const getBadgeIcon = (iconName: string) => {
    const icons = {
      trophy: Trophy,
      mappin: MapPin,
      utensils: Utensils,
      camera: Camera,
      heart: Heart,
      star: Star
    };
    return icons[iconName as keyof typeof icons] || Trophy;
  };

  const completedCount = getCompletedCount();
  const completionPercentage = Math.round((completedCount / achievements.length) * 100);

  if (loading) {
    return (
      <Card className="w-full h-80 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse">
        <div className="h-full flex items-center justify-center">
          <div className="text-gold-400 text-lg">Caricamento dei tuoi achievement...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 border-gold-400/30 overflow-hidden relative">
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gold-400 mb-3">
              Il Tuo Viaggio in Romagna
            </h2>
            <p className="text-slate-300 text-xl">
              Scopri i tesori nascosti del territorio
            </p>
          </div>

          {/* Statistics */}
          <div className="bg-slate-800/95 backdrop-blur-sm rounded-xl p-6 border border-gold-400/40 max-w-md mx-auto">
            <h3 className="text-gold-400 font-bold text-xl mb-4 text-center">
              Le Tue Statistiche
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Badge Sbloccati</span>
                <Badge className="bg-gold-500 text-slate-900 font-bold text-base px-3 py-1">
                  {completedCount}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-300 font-medium">Romagna Esplorata</span>
                <Badge className="bg-blue-500 text-white font-bold text-base px-3 py-1">
                  {completionPercentage}%
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Testo esplicativo */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-8 border border-slate-200 shadow-sm">
        <p className="text-slate-700 text-center leading-relaxed text-xl">
          <span className="font-bold text-slate-800 block mb-2 text-2xl">
            Il tuo passaporto personale
          </span>
          Un diario delle tue avventure in Romagna. Ogni esperienza che vivi, 
          ogni luogo che visiti, ti avvicina a diventare un vero conoscitore del territorio. 
          <span className="font-bold text-blue-700 block mt-2 text-xl">
            Quale tesoro scoprirai oggi?
          </span>
        </p>
      </div>
    </div>
  );
};

export default ExplorerMap;
