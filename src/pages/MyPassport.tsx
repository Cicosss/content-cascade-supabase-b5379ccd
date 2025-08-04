
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUserAchievements } from '@/hooks/useUserAchievements';
import { useUserVisits } from '@/hooks/useUserVisits';
import { useServiceVisibility } from '@/hooks/useServiceVisibility';
import TravelDiary from '@/components/passport/TravelDiary';
import ExplorerMap from '@/components/passport/ExplorerMap';
import { Trophy, MapPin, Utensils, Camera, Heart, Star } from 'lucide-react';

const MyPassport = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { isVisible: badgesVisible, elementRef: badgesRef } = useServiceVisibility({ threshold: 0.1 });
  const { isVisible: statsVisible, elementRef: statsRef } = useServiceVisibility({ threshold: 0.1 });
  const { isVisible: headerVisible, elementRef: headerRef } = useServiceVisibility({ threshold: 0.1 });
  
  const { 
    achievements, 
    userProgress, 
    loading: achievementsLoading,
    getCompletedCount,
    getTotalVisits,
    getVisitsByAchievementCategory
  } = useUserAchievements();
  const { loading: visitsLoading } = useUserVisits();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading || achievementsLoading || visitsLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Caricamento...</div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return null;
  }

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
  const totalVisits = getTotalVisits();

  return (
    <Layout>
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-8 relative overflow-hidden">
        {/* Background Animation Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full animate-float animation-delay-0"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-accent/5 rounded-full animate-drift animation-delay-500"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-secondary/5 rounded-full animate-pulse animation-delay-1000"></div>
        </div>

        {/* Header */}
        <div 
          ref={headerRef}
          className={`mb-12 relative z-10 transition-all duration-1000 ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-primary via-accent to-secondary rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-300 animate-pulse">
              <Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-white animate-bounce" />
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 blur-lg animate-ping"></div>
            </div>
            <div>
              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight tracking-tight">
                Il Mio Passaporto
              </h1>
              <p className="font-lora text-lg sm:text-xl md:text-2xl text-slate-700 dark:text-slate-300 font-medium">
                Raccogli badge esplorando la Romagna
              </p>
            </div>
          </div>
        </div>

        {/* La Mappa dell'Esploratore - nuovo widget principale */}
        <div className="mb-8">
          <ExplorerMap />
        </div>

        {/* Badge Grid */}
        <div 
          ref={badgesRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12 relative z-10 transition-all duration-1000 ${
            badgesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {achievements.map((achievement, index) => {
            const progress = userProgress[achievement.id];
            const isCompleted = progress?.completed || false;
            const currentProgress = progress?.current || 0;
            const IconComponent = getBadgeIcon(achievement.icon);

            return (
              <Card 
                key={achievement.id}
                className={`relative p-8 transition-all duration-700 hover:scale-105 transform perspective-1000 ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-green-50/80 via-green-100/60 to-accent/10 border-accent/30 shadow-2xl ring-2 ring-accent/20' 
                    : 'bg-gradient-to-br from-red-50/80 via-red-100/60 to-slate-50/90 border-red-200/40 shadow-lg hover:shadow-xl hover:border-red-300/60'
                } backdrop-blur-sm rounded-3xl`}
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animationDelay: `${index * 150}ms`
                }}
              >
                {/* 3D Relief Shadow Layers */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-200/20 to-slate-400/10 rounded-3xl transform translate-x-1 translate-y-1 blur-sm z-behind"></div>
                
                <div className="text-center relative z-10">
                  <div className={`relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 rounded-3xl flex items-center justify-center transition-all duration-700 transform hover:scale-110 hover:rotate-6 ${
                    isCompleted 
                      ? 'bg-gradient-to-br from-accent via-accent/90 to-primary shadow-2xl animate-pulse' 
                      : 'bg-gradient-to-br from-slate-300 to-slate-400 shadow-lg'
                  }`}>
                    <IconComponent 
                      className={`h-12 w-12 sm:h-14 sm:w-14 transition-all duration-500 ${
                        isCompleted ? 'text-white animate-bounce' : 'text-slate-600'
                      }`} 
                    />
                    
                    {/* Glow effect for completed badges */}
                    {isCompleted && (
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/40 to-primary/30 blur-lg animate-ping"></div>
                    )}
                    
                    {/* Floating particles for completed badges */}
                    {isCompleted && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-white/80 rounded-full animate-twinkle animation-delay-0"></div>
                        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-white/60 rounded-full animate-twinkle animation-delay-500"></div>
                        <div className="absolute top-1/2 -right-1 w-1 h-1 bg-white/40 rounded-full animate-twinkle animation-delay-1000"></div>
                      </div>
                    )}
                  </div>
                  
                  <h3 className={`font-playfair text-xl sm:text-2xl lg:text-3xl font-bold mb-4 leading-tight tracking-tight ${
                    isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'
                  }`}>
                    {achievement.name}
                  </h3>
                  
                  <p className={`font-lora text-base sm:text-lg leading-relaxed mb-6 px-2 ${
                    isCompleted ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500 dark:text-slate-500'
                  }`}>
                    {achievement.description}
                  </p>

                  {isCompleted ? (
                    <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold font-inter px-6 py-3 text-base rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                      ✓ Completato!
                    </Badge>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm font-medium text-slate-600 dark:text-slate-400 font-inter">
                        <span>Progresso</span>
                        <span className="animate-pulse text-red-600 font-bold">
                          {currentProgress}/{achievement.target}
                        </span>
                      </div>
                      <Progress 
                        value={(currentProgress / achievement.target) * 100} 
                        className="h-3 rounded-full shadow-inner w-full"
                      />
                    </div>
                  )}
                </div>
                
                {/* Decorative elements */}
                <div className="absolute -top-3 -right-3 w-6 h-6 bg-gradient-to-br from-secondary/30 to-primary/30 rounded-full animate-pulse animation-delay-300"></div>
                <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-full animate-ping animation-delay-600"></div>
              </Card>
            );
          })}
        </div>

        {/* Statistics */}
        <Card 
          ref={statsRef}
          className={`relative mb-12 p-8 lg:p-10 rounded-3xl shadow-2xl border border-slate-200/50 bg-gradient-to-br from-slate-50/90 to-white/95 backdrop-blur-sm perspective-1000 transition-all duration-1000 transform ${
            statsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {/* 3D Relief Shadow Layers */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200/30 to-slate-400/20 rounded-3xl transform translate-x-2 translate-y-2 blur-sm z-behind"></div>
          <div className="absolute inset-0 bg-gradient-to-tl from-slate-300/20 to-slate-100/30 rounded-3xl transform translate-x-1 translate-y-1 z-behind"></div>
          
          <div className="relative z-10">
            <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold mb-8 text-slate-900 dark:text-white leading-tight tracking-tight text-center">
              Le Tue Statistiche
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
              <div className="text-center p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="font-playfair text-3xl lg:text-4xl font-bold text-primary mb-2 animate-pulse">{completedCount}</div>
                <div className="font-lora text-sm lg:text-base text-slate-700 dark:text-slate-300 font-medium">Badge Ottenuti</div>
              </div>
              <div className="text-center p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-green-500/5 to-green-500/10 border border-green-500/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="font-playfair text-3xl lg:text-4xl font-bold text-green-600 mb-2 animate-pulse animation-delay-300">
                  {getVisitsByAchievementCategory('borgo')}
                </div>
                <div className="font-lora text-sm lg:text-base text-slate-700 dark:text-slate-300 font-medium">Borghi Visitati</div>
              </div>
              <div className="text-center p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="font-playfair text-3xl lg:text-4xl font-bold text-accent mb-2 animate-pulse animation-delay-600">
                  {getVisitsByAchievementCategory('ristoranti')}
                </div>
                <div className="font-lora text-sm lg:text-base text-slate-700 dark:text-slate-300 font-medium">Ristoranti Provati</div>
              </div>
              <div className="text-center p-4 lg:p-6 rounded-2xl bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <div className="font-playfair text-3xl lg:text-4xl font-bold text-secondary mb-2 animate-pulse animation-delay-1000">
                  {totalVisits}
                </div>
                <div className="font-lora text-sm lg:text-base text-slate-700 dark:text-slate-300 font-medium">Visite Totali</div>
              </div>
            </div>
          </div>
          
          {/* Decorative floating elements */}
          <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-ping animation-delay-300"></div>
          <div className="absolute bottom-6 left-6 w-4 h-4 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full animate-pulse animation-delay-600"></div>
          
          {/* Subtle twinkle effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-8 left-16 w-1 h-1 bg-white/60 rounded-full animate-twinkle animation-delay-0"></div>
            <div className="absolute bottom-12 right-20 w-1.5 h-1.5 bg-white/50 rounded-full animate-twinkle animation-delay-500"></div>
            <div className="absolute top-1/3 right-8 w-1 h-1 bg-white/40 rounded-full animate-twinkle animation-delay-1000"></div>
          </div>
        </Card>

        {/* Travel Diary */}
        <TravelDiary />
      </div>
    </Layout>
  );
};

export default MyPassport;
