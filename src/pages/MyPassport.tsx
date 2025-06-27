
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useUserAchievements } from '@/hooks/useUserAchievements';
import { useUserVisits } from '@/hooks/useUserVisits';
import TravelDiary from '@/components/passport/TravelDiary';
import ExplorerMap from '@/components/passport/ExplorerMap';
import { Trophy, MapPin, Utensils, Camera, Heart, Star } from 'lucide-react';

const MyPassport = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
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
      <Layout showSidebar={true}>
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
    <Layout showSidebar={true}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Il Mio Passaporto</h1>
              <p className="text-slate-600">Raccogli badge esplorando la Romagna</p>
            </div>
          </div>
        </div>

        {/* La Mappa dell'Esploratore - nuovo widget principale */}
        <div className="mb-8">
          <ExplorerMap />
        </div>

        {/* Badge Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {achievements.map((achievement) => {
            const progress = userProgress[achievement.id];
            const isCompleted = progress?.completed || false;
            const currentProgress = progress?.current || 0;
            const IconComponent = getBadgeIcon(achievement.icon);

            return (
              <Card 
                key={achievement.id}
                className={`p-6 transition-all duration-300 ${
                  isCompleted 
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 shadow-lg' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="text-center">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center transition-all duration-500 ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse' 
                      : 'bg-gray-300'
                  }`}>
                    <IconComponent 
                      className={`h-10 w-10 ${
                        isCompleted ? 'text-white' : 'text-gray-500'
                      }`} 
                    />
                  </div>
                  
                  <h3 className={`font-bold text-lg mb-2 ${
                    isCompleted ? 'text-slate-900' : 'text-gray-500'
                  }`}>
                    {achievement.name}
                  </h3>
                  
                  <p className={`text-sm mb-4 ${
                    isCompleted ? 'text-slate-600' : 'text-gray-400'
                  }`}>
                    {achievement.description}
                  </p>

                  {isCompleted ? (
                    <Badge className="bg-green-500 hover:bg-green-600">
                      ✓ Completato!
                    </Badge>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Progresso</span>
                        <span>{currentProgress}/{achievement.target}</span>
                      </div>
                      <Progress 
                        value={(currentProgress / achievement.target) * 100} 
                        className="h-2"
                      />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Statistics */}
        <Card className="mb-8 p-6">
          <h2 className="text-xl font-bold mb-4 text-slate-900">Le Tue Statistiche</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedCount}</div>
              <div className="text-sm text-slate-600">Badge Ottenuti</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {getVisitsByAchievementCategory('borgo')}
              </div>
              <div className="text-sm text-slate-600">Borghi Visitati</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {getVisitsByAchievementCategory('ristoranti')}
              </div>
              <div className="text-sm text-slate-600">Ristoranti Provati</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {totalVisits}
              </div>
              <div className="text-sm text-slate-600">Visite Totali</div>
            </div>
          </div>
        </Card>

        {/* Travel Diary */}
        <TravelDiary />
      </div>
    </Layout>
  );
};

export default MyPassport;
