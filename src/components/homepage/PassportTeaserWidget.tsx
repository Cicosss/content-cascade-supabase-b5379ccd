import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useGuestRedirect } from '@/hooks/useGuestRedirect';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Mountain, 
  Utensils, 
  Camera, 
  Star, 
  Heart,
  Lock 
} from 'lucide-react';

interface BadgeData {
  id: string;
  icon: React.ComponentType<any>;
  name: string;
  unlocked: boolean;
  delay: number;
}

const badges: BadgeData[] = [
  { id: 'explorer', icon: MapPin, name: 'Esploratore', unlocked: true, delay: 0 },
  { id: 'mountain', icon: Mountain, name: 'Alpinista', unlocked: true, delay: 100 },
  { id: 'foodie', icon: Utensils, name: 'Gourmet', unlocked: false, delay: 200 },
  { id: 'photographer', icon: Camera, name: 'Fotografo', unlocked: true, delay: 300 },
  { id: 'collector', icon: Star, name: 'Collezionista', unlocked: false, delay: 400 },
  { id: 'local', icon: Heart, name: 'Local Expert', unlocked: false, delay: 500 },
];

const PassportTeaserWidget = () => {
  const { user } = useAuth();
  const { handleGuestClick } = useGuestRedirect();

  // Don't show to logged users
  if (user) return null;

  const handleStartAdventure = () => {
    handleGuestClick();
  };

  return (
    <section className="w-full px-4 py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-slate-800/40 backdrop-blur-sm rounded-3xl p-8 lg:p-12 border border-white/10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Column - Content */}
            <div className="space-y-6">
              <h3 className="font-serif text-4xl lg:text-5xl font-bold text-white leading-tight">
                La Tua Avventura ti Attende
              </h3>
              
              <p className="text-white/80 text-lg leading-relaxed font-sans">
                Ogni luogo che visiti diventa un timbro sul tuo passaporto digitale. 
                Sblocca badge, completa le sfide e mostra a tutti che sei un vero 
                conoscitore della Romagna.
              </p>
              
              <Button
                onClick={handleStartAdventure}
                size="lg"
                className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 font-semibold text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-0"
              >
                🗺️ Inizia la Tua Avventura
              </Button>
            </div>

            {/* Right Column - Animated Badges Grid with 3D Perspective */}
            <div className="relative" style={{ perspective: '1000px' }}>
              <div className="grid grid-cols-3 gap-6">
                {badges.map((badge, index) => {
                  const IconComponent = badge.unlocked ? badge.icon : Lock;
                  
                  return (
                    <div
                      key={badge.id}
                      className={`
                        relative group cursor-pointer
                        animate-flip-in
                        hover:scale-105
                        transform-gpu
                        ${badge.unlocked ? 'hover:animate-badge-glow' : ''}
                      `}
                      style={{
                        animationDelay: `${badge.delay}ms`,
                        animationFillMode: 'both'
                      }}
                    >
                      {/* Badge Container with 3D Transform */}
                      <div className={`
                        w-20 h-20 rounded-full flex items-center justify-center 
                        transition-all duration-700 transform-gpu
                        ${badge.unlocked 
                          ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30' 
                          : 'bg-slate-700/80 border-2 border-slate-600/50'
                        }
                        hover:scale-110 
                        ${badge.unlocked ? 'hover:[transform:rotateY(12deg)]' : 'hover:[transform:rotateY(6deg)]'}
                        group-hover:shadow-2xl 
                        ${badge.unlocked ? 'group-hover:shadow-amber-500/50' : 'group-hover:shadow-slate-500/30'}
                        border-2 border-white/20
                        relative overflow-hidden
                      `}
                      style={{
                        transformStyle: 'preserve-3d'
                      }}
                    >
                      {/* Badge Icon */}
                      <IconComponent 
                        className={`w-8 h-8 transition-all duration-300 ${
                          badge.unlocked 
                            ? 'text-slate-900' 
                            : 'text-white/60'
                        }`} 
                      />

                      {/* Shimmer effect for unlocked badges */}
                      {badge.unlocked && (
                        <div className="absolute inset-0 rounded-full">
                          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
                        </div>
                      )}

                      {/* Lock overlay animation for locked badges */}
                      {!badge.unlocked && (
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-slate-800/20 to-slate-900/40 backdrop-blur-[1px]"></div>
                      )}
                    </div>

                    {/* Enhanced Glow Effects */}
                    <div className={`
                      absolute inset-0 rounded-full 
                      transition-all duration-500
                      ${badge.unlocked 
                        ? 'group-hover:opacity-100 opacity-40' 
                        : 'opacity-0'
                      }
                      ${badge.unlocked 
                        ? 'bg-gradient-to-br from-amber-400/30 to-orange-500/30' 
                        : 'bg-gradient-to-br from-slate-500/20 to-slate-600/20'
                      }
                      blur-xl scale-150 
                      group-hover:scale-[200%]
                      group-hover:blur-2xl
                    `} />

                    {/* Pulsing ring for unlocked badges */}
                    {badge.unlocked && (
                      <div className="absolute inset-0 rounded-full border-2 border-amber-400/50 animate-ping opacity-20 group-hover:opacity-60"></div>
                    )}

                    {/* Badge Name with enhanced typography */}
                    <div className="mt-3 text-center">
                      <span className={`
                        text-xs font-medium transition-all duration-300
                        ${badge.unlocked 
                          ? 'text-white group-hover:text-amber-200' 
                          : 'text-white/50 group-hover:text-white/70'
                        }
                      `}>
                        {badge.unlocked ? badge.name : 'Bloccato'}
                      </span>
                    </div>

                    {/* Enhanced floating animation for unlocked badges */}
                    {badge.unlocked && (
                      <div className={`
                        absolute -top-2 -left-2 w-24 h-24 rounded-full
                        animate-float
                        opacity-20 group-hover:opacity-40
                        bg-gradient-to-br from-amber-400/20 to-orange-500/20
                        blur-md
                        transition-opacity duration-500
                      `} style={{
                        animationDelay: `${badge.delay + 500}ms`,
                        animationDuration: '4s'
                      }} />
                    )}

                    {/* Cascade reveal effect */}
                    <div 
                      className={`
                        absolute inset-0 rounded-full
                        bg-gradient-to-br from-blue-900/80 to-indigo-900/80
                        animate-flip-in
                        ${badge.unlocked ? 'opacity-0' : 'opacity-60'}
                      `}
                      style={{
                        animationDelay: `${badge.delay - 100}ms`,
                        animationDuration: '0.8s',
                        animationDirection: 'reverse'
                      }}
                    />
                  </div>
                )
              })}
              </div>

              {/* Progress Indicator */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm">
                  <div className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80 text-sm font-medium">
                    {badges.filter(b => b.unlocked).length} di {badges.length} badge sbloccati
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PassportTeaserWidget;