
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Trophy, MapPin, Utensils, Camera, Heart, Star } from 'lucide-react';
import RomagnaMapSVG from './RomagnaMapSVG';
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

  // Mapping geografico degli achievement sulla mappa
  const badgePositions = {
    'visit_borghi': { x: 135, y: 75 }, // San Leo area
    'try_restaurants': { x: 280, y: 180 }, // Rimini centro
    'visit_attractions': { x: 320, y: 150 }, // Costa
    'explore_culture': { x: 120, y: 120 }, // San Marino area
    'beach_lover': { x: 330, y: 200 }, // Litorale
    'first_visit': { x: 200, y: 150 } // Centro mappa
  };

  const completedCount = getCompletedCount();
  const completionPercentage = Math.round((completedCount / achievements.length) * 100);

  if (loading) {
    return (
      <Card className="w-full h-64 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse">
        <div className="h-full flex items-center justify-center">
          <div className="text-gold-400">Caricamento della tua mappa...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 border-gold-400/20 overflow-hidden relative">
        {/* Texture di pergamena overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDIwNSwxNjQsNTIsMC4wNSkiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
        
        <div className="relative p-8">
          {/* Header del widget */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gold-400 mb-2">
              La Mappa dell'Esploratore
            </h2>
            <p className="text-slate-300 text-lg">
              Scopri i tesori nascosti della Romagna
            </p>
          </div>

          {/* Container della mappa */}
          <div className="relative w-full max-w-4xl mx-auto">
            <TooltipProvider>
              <RomagnaMapSVG className="w-full h-auto max-h-80">
                {/* Icone dei badge posizionate geograficamente */}
                {achievements.map((achievement) => {
                  const position = badgePositions[achievement.id as keyof typeof badgePositions];
                  if (!position) return null;

                  const progress = userProgress[achievement.id];
                  const isCompleted = progress?.completed || false;
                  const IconComponent = getBadgeIcon(achievement.icon);

                  return (
                    <Tooltip key={achievement.id}>
                      <TooltipTrigger asChild>
                        <g
                          className={`cursor-pointer transition-all duration-300 ${
                            isCompleted 
                              ? 'animate-pulse hover:scale-110' 
                              : 'opacity-50 hover:opacity-75'
                          }`}
                          transform={`translate(${position.x - 12}, ${position.y - 12})`}
                        >
                          {/* Cerchio di sfondo per l'icona */}
                          <circle
                            cx="12"
                            cy="12"
                            r="14"
                            fill={isCompleted ? 'rgba(205, 164, 52, 0.3)' : 'rgba(100, 116, 139, 0.3)'}
                            stroke={isCompleted ? '#CDA434' : '#64748B'}
                            strokeWidth="2"
                            className={isCompleted ? 'animate-pulse' : ''}
                          />
                          
                          {/* Icona del badge */}
                          <foreignObject x="4" y="4" width="16" height="16">
                            <IconComponent 
                              className={`w-4 h-4 ${
                                isCompleted ? 'text-gold-400' : 'text-slate-400'
                              }`}
                            />
                          </foreignObject>

                          {/* Linee di connessione animate per badge completati */}
                          {isCompleted && (
                            <g className="animate-pulse">
                              <line
                                x1="12"
                                y1="12"
                                x2="200"
                                y2="150"
                                stroke="#CDA434"
                                strokeWidth="1"
                                opacity="0.5"
                                strokeDasharray="2,2"
                                className="animate-pulse"
                              />
                            </g>
                          )}
                        </g>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-center">
                          <p className="font-semibold">{achievement.name}</p>
                          <p className="text-sm opacity-75">
                            {progress?.current || 0}/{achievement.target}
                          </p>
                          {isCompleted && (
                            <Badge className="mt-1 bg-gold-500 text-slate-900">
                              ✓ Completato!
                            </Badge>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </RomagnaMapSVG>
            </TooltipProvider>

            {/* Statistiche integrate */}
            <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-4 border border-gold-400/30">
              <h3 className="text-gold-400 font-semibold text-lg mb-2">
                Il Tuo Viaggio
              </h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Badge Sbloccati:</span>
                  <Badge className="bg-gold-500 text-slate-900 ml-2">
                    {completedCount}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Romagna Esplorata:</span>
                  <Badge className="bg-blue-500 text-white ml-2">
                    {completionPercentage}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Testo esplicativo */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 border border-slate-200">
        <p className="text-slate-700 text-center leading-relaxed text-lg">
          <span className="font-semibold text-slate-800">
            Questa è la tua mappa personale
          </span>
          , un diario delle tue avventure in Romagna. Ogni esperienza che vivi, 
          ogni luogo che visiti, svela una nuova parte del territorio e ti avvicina 
          a diventare un vero conoscitore. 
          <span className="font-semibold text-blue-700 ml-2">
            Quale tesoro scoprirai oggi?
          </span>
        </p>
      </div>
    </div>
  );
};

export default ExplorerMap;
