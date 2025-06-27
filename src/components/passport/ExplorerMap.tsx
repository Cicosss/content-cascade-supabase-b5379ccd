
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

  // Posizioni geografiche ottimizzate e più logiche
  const badgePositions = {
    'visit_borghi': { x: 140, y: 140 }, // Vicino a San Leo
    'try_restaurants': { x: 300, y: 220 }, // Zona Rimini
    'visit_attractions': { x: 350, y: 180 }, // Costa centrale
    'explore_culture': { x: 250, y: 135 }, // Zona Ravenna
    'beach_lover': { x: 380, y: 200 }, // Litorale
    'first_visit': { x: 200, y: 175 } // Centro mappa
  };

  const completedCount = getCompletedCount();
  const completionPercentage = Math.round((completedCount / achievements.length) * 100);

  if (loading) {
    return (
      <Card className="w-full h-80 bg-gradient-to-br from-slate-800 to-slate-900 animate-pulse">
        <div className="h-full flex items-center justify-center">
          <div className="text-gold-400 text-lg">Caricamento della tua mappa...</div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="w-full bg-gradient-to-br from-slate-800 via-slate-900 to-indigo-900 border-gold-400/30 overflow-hidden relative">
        
        <div className="relative p-8">
          {/* Header migliorato */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gold-400 mb-3">
              La Mappa dell'Esploratore
            </h2>
            <p className="text-slate-300 text-xl">
              Scopri i tesori nascosti della Romagna
            </p>
          </div>

          {/* Container della mappa ottimizzato */}
          <div className="relative w-full max-w-5xl mx-auto">
            <TooltipProvider>
              <RomagnaMapSVG className="w-full h-auto">
                {/* Badge con design migliorato */}
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
                          className={`cursor-pointer transition-all duration-500 ${
                            isCompleted 
                              ? 'animate-gps-pulse hover:scale-110' 
                              : 'opacity-60 hover:opacity-90'
                          }`}
                          transform={`translate(${position.x - 18}, ${position.y - 18})`}
                        >
                          {/* Cerchio esterno con glow */}
                          <circle
                            cx="18"
                            cy="18"
                            r="20"
                            fill={isCompleted ? 'rgba(205, 164, 52, 0.2)' : 'rgba(100, 116, 139, 0.2)'}
                            stroke={isCompleted ? '#E6C866' : '#64748B'}
                            strokeWidth="2"
                            filter={isCompleted ? 'url(#glow)' : 'none'}
                          />
                          
                          {/* Cerchio interno per l'icona */}
                          <circle
                            cx="18"
                            cy="18"
                            r="14"
                            fill={isCompleted ? 'rgba(230, 200, 102, 0.9)' : 'rgba(100, 116, 139, 0.7)'}
                            stroke={isCompleted ? '#CDA434' : '#475569'}
                            strokeWidth="2"
                          />
                          
                          {/* Icona del badge */}
                          <foreignObject x="10" y="10" width="16" height="16">
                            <IconComponent 
                              className={`w-4 h-4 ${
                                isCompleted ? 'text-slate-900' : 'text-slate-300'
                              }`}
                            />
                          </foreignObject>

                          {/* Indicatore di completamento */}
                          {isCompleted && (
                            <circle
                              cx="26"
                              cy="10"
                              r="4"
                              fill="#22c55e"
                              stroke="#ffffff"
                              strokeWidth="1"
                              className="animate-pulse"
                            />
                          )}
                        </g>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-800 border-gold-400/20">
                        <div className="text-center p-2">
                          <p className="font-semibold text-gold-400">{achievement.name}</p>
                          <p className="text-sm text-slate-300 mt-1">
                            Progresso: {progress?.current || 0}/{achievement.target}
                          </p>
                          {isCompleted && (
                            <Badge className="mt-2 bg-green-500 text-white">
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

            {/* Statistiche ridisegnate */}
            <div className="absolute bottom-6 right-6 bg-slate-800/95 backdrop-blur-sm rounded-xl p-6 border border-gold-400/40 min-w-[200px]">
              <h3 className="text-gold-400 font-bold text-xl mb-4 text-center">
                Il Tuo Viaggio
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
        </div>
      </Card>

      {/* Testo esplicativo migliorato */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-8 border border-slate-200 shadow-sm">
        <p className="text-slate-700 text-center leading-relaxed text-xl">
          <span className="font-bold text-slate-800 block mb-2 text-2xl">
            Questa è la tua mappa personale
          </span>
          Un diario delle tue avventure in Romagna. Ogni esperienza che vivi, 
          ogni luogo che visiti, svela una nuova parte del territorio e ti avvicina 
          a diventare un vero conoscitore. 
          <span className="font-bold text-blue-700 block mt-2 text-xl">
            Quale tesoro scoprirai oggi?
          </span>
        </p>
      </div>
    </div>
  );
};

export default ExplorerMap;
