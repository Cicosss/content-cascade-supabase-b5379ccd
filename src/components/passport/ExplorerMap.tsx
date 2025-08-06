
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, MapPin, Utensils, Camera, Heart, Star } from 'lucide-react';
import { useUserAchievements } from '@/hooks/useUserAchievements';
import { useServiceVisibility } from '@/hooks/useServiceVisibility';

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
      <Card className="w-full h-80 bg-gradient-to-br from-slate-800/90 via-slate-900/95 to-slate-950/90 backdrop-blur-sm animate-pulse border border-slate-700/50 shadow-2xl rounded-3xl">
        <div className="h-full flex items-center justify-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl blur-lg"></div>
          <div className="font-playfair text-gold-400 text-xl font-bold animate-bounce relative z-10">
            Caricamento dei tuoi achievement...
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8 lg:space-y-10 relative">
      {/* Background Animation Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 right-20 w-20 h-20 bg-primary/5 rounded-full animate-float animation-delay-0"></div>
        <div className="absolute bottom-16 left-16 w-16 h-16 bg-accent/5 rounded-full animate-drift animation-delay-700"></div>
        <div className="absolute top-1/3 right-10 w-12 h-12 bg-secondary/5 rounded-full animate-pulse animation-delay-1200"></div>
      </div>

      <Card 
        className="w-full bg-gradient-to-br from-slate-800/95 via-slate-900/98 to-indigo-900/95 border-gold-400/40 overflow-hidden relative backdrop-blur-sm shadow-2xl rounded-3xl"
      >
        {/* 3D Relief Shadow Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-700/30 to-slate-900/20 rounded-3xl transform translate-x-2 translate-y-2 blur-lg -z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-slate-600/20 to-slate-800/30 rounded-3xl transform translate-x-1 translate-y-1 -z-10"></div>
        
        <div className="p-8 lg:p-10 relative z-10">
          {/* Header */}
          <div className="text-center mb-10 lg:mb-12">
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-gold-400 mb-4 lg:mb-6 leading-tight tracking-tight animate-fade-in">
              Il Tuo Viaggio in Romagna
            </h2>
            <p className="font-lora text-slate-300 text-lg sm:text-xl lg:text-2xl font-medium leading-relaxed animate-fade-in animation-delay-300">
              Scopri i tesori nascosti del territorio
            </p>
          </div>

          {/* Statistics */}
          <div className="bg-gradient-to-br from-slate-800/95 via-slate-700/90 to-slate-800/95 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-6 lg:p-8 border border-gold-400/50 max-w-lg mx-auto shadow-2xl relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-gold-400/30 to-primary/30 rounded-full animate-pulse animation-delay-500"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-br from-accent/30 to-secondary/30 rounded-full animate-ping animation-delay-800"></div>
            
            <h3 className="font-playfair text-gold-400 font-bold text-xl lg:text-2xl mb-6 text-center leading-tight tracking-tight animate-fade-in animation-delay-600">
              Le Tue Statistiche
            </h3>
            <div className="space-y-4 lg:space-y-5">
              <div className="flex justify-between items-center bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/70 transition-all duration-300 transform hover:scale-102">
                <span className="font-lora text-slate-300 font-medium text-base lg:text-lg">Badge Sbloccati</span>
                <Badge className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-slate-900 font-bold text-base lg:text-lg px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse">
                  {completedCount}
                </Badge>
              </div>
              <div className="flex justify-between items-center bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/70 transition-all duration-300 transform hover:scale-102">
                <span className="font-lora text-slate-300 font-medium text-base lg:text-lg">Romagna Esplorata</span>
                <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold text-base lg:text-lg px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse animation-delay-300">
                  {completionPercentage}%
                </Badge>
              </div>
            </div>
            
            {/* Subtle twinkle effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-6 left-8 w-1 h-1 bg-white/60 rounded-full animate-twinkle animation-delay-0"></div>
              <div className="absolute bottom-8 right-12 w-1.5 h-1.5 bg-white/50 rounded-full animate-twinkle animation-delay-700"></div>
              <div className="absolute top-1/2 right-6 w-1 h-1 bg-white/40 rounded-full animate-twinkle animation-delay-1200"></div>
            </div>
          </div>
        </div>
        
        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 right-8 w-2 h-2 bg-gold-400/30 rounded-full animate-twinkle animation-delay-0"></div>
          <div className="absolute bottom-12 left-12 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-twinkle animation-delay-500"></div>
          <div className="absolute top-1/3 left-8 w-1 h-1 bg-white/30 rounded-full animate-twinkle animation-delay-1000"></div>
        </div>
      </Card>

      {/* Testo esplicativo */}
      <div 
        className="bg-gradient-to-br from-slate-50/95 via-blue-50/90 to-accent/5 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-8 lg:p-10 border border-slate-200/60 shadow-2xl relative overflow-hidden"
      >
        {/* 3D Relief Shadow Layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-200/20 to-slate-300/10 rounded-2xl lg:rounded-3xl transform translate-x-1 translate-y-1 blur-sm -z-10"></div>
        
        <div className="relative z-10">
          <p className="font-lora text-slate-700 dark:text-slate-300 text-center leading-relaxed text-lg sm:text-xl lg:text-2xl">
            <span className="font-playfair font-bold text-slate-800 dark:text-slate-200 block mb-4 text-2xl sm:text-3xl lg:text-4xl leading-tight tracking-tight animate-fade-in">
              Il tuo passaporto personale
            </span>
            <span className="animate-fade-in animation-delay-300">
              Un diario delle tue avventure in Romagna. Ogni esperienza che vivi, 
              ogni luogo che visiti, ti avvicina a diventare un vero conoscitore del territorio.
            </span>
            <span className="font-playfair font-bold text-blue-700 dark:text-blue-400 block mt-4 lg:mt-6 text-xl sm:text-2xl lg:text-3xl leading-tight tracking-tight animate-fade-in animation-delay-600">
              Quale tesoro scoprirai oggi?
            </span>
          </p>
        </div>
        
        {/* Decorative floating elements */}
        <div className="absolute top-4 right-4 w-6 h-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full animate-pulse animation-delay-400"></div>
        <div className="absolute bottom-6 left-6 w-4 h-4 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full animate-ping animation-delay-800"></div>
        
        {/* Subtle twinkle effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-8 left-16 w-1 h-1 bg-blue-500/40 rounded-full animate-twinkle animation-delay-200"></div>
          <div className="absolute bottom-12 right-20 w-1.5 h-1.5 bg-primary/30 rounded-full animate-twinkle animation-delay-600"></div>
          <div className="absolute top-1/3 right-8 w-1 h-1 bg-accent/40 rounded-full animate-twinkle animation-delay-1000"></div>
        </div>
      </div>
    </div>
  );
};

export default ExplorerMap;
