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
  Heart 
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
  { id: 'mountain', icon: Mountain, name: 'Alpinista', unlocked: true, delay: 200 },
  { id: 'foodie', icon: Utensils, name: 'Gourmet', unlocked: false, delay: 400 },
  { id: 'photographer', icon: Camera, name: 'Fotografo', unlocked: true, delay: 600 },
  { id: 'collector', icon: Star, name: 'Collezionista', unlocked: false, delay: 800 },
  { id: 'local', icon: Heart, name: 'Local Expert', unlocked: false, delay: 1000 },
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

            {/* Right Column - Animated Badges Grid */}
            <div className="relative">
              <div className="grid grid-cols-3 gap-6">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`
                      relative group cursor-pointer
                      animate-fade-in
                      hover:animate-pulse
                    `}
                    style={{
                      animationDelay: `${badge.delay}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {/* Badge Container */}
                    <div className={`
                      w-20 h-20 rounded-full flex items-center justify-center 
                      transition-all duration-500 transform
                      ${badge.unlocked 
                        ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-lg shadow-amber-500/30' 
                        : 'bg-slate-700/50 grayscale'
                      }
                      hover:scale-110 hover:rotate-12
                      group-hover:shadow-2xl group-hover:shadow-amber-500/50
                      border-2 border-white/20
                    `}>
                      <badge.icon 
                        className={`w-8 h-8 ${
                          badge.unlocked 
                            ? 'text-slate-900' 
                            : 'text-white/40'
                        }`} 
                      />
                    </div>

                    {/* Badge Glow Effect */}
                    <div className={`
                      absolute inset-0 rounded-full 
                      transition-opacity duration-300
                      ${badge.unlocked ? 'group-hover:opacity-100' : 'opacity-0'}
                      bg-gradient-to-br from-amber-400/20 to-orange-500/20
                      blur-xl scale-150
                    `} />

                    {/* Badge Name */}
                    <div className="mt-3 text-center">
                      <span className={`
                        text-xs font-medium
                        ${badge.unlocked ? 'text-white' : 'text-white/50'}
                      `}>
                        {badge.name}
                      </span>
                    </div>

                    {/* Floating Animation */}
                    <div className={`
                      absolute -top-1 -left-1 w-22 h-22 rounded-full
                      animate-float
                      ${badge.unlocked ? 'opacity-30' : 'opacity-0'}
                      bg-gradient-to-br from-amber-400/20 to-orange-500/20
                      blur-sm
                    `} style={{
                      animationDelay: `${badge.delay + 1000}ms`,
                      animationDuration: '3s'
                    }} />
                  </div>
                ))}
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