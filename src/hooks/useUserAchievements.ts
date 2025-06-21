
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  category: string;
}

interface UserProgress {
  [achievementId: string]: {
    current: number;
    completed: boolean;
    completedAt?: string;
  };
}

export const useUserAchievements = () => {
  const { user } = useAuth();
  const [achievements] = useState<Achievement[]>([
    {
      id: 'visit_borghi',
      name: 'Esploratore dei Borghi',
      description: 'Visita 5 borghi storici della Romagna',
      icon: 'mappin',
      target: 5,
      category: 'exploration'
    },
    {
      id: 'try_restaurants',
      name: 'Gourmet Romagnolo',
      description: 'Prova 3 ristoranti tipici locali',
      icon: 'utensils',
      target: 3,
      category: 'food'
    },
    {
      id: 'collect_photos',
      name: 'Fotografo Viaggiatore',
      description: 'Scatta foto in 10 luoghi diversi',
      icon: 'camera',
      target: 10,
      category: 'photos'
    },
    {
      id: 'save_favorites',
      name: 'Collezionista',
      description: 'Salva 15 luoghi nei preferiti',
      icon: 'heart',
      target: 15,
      category: 'favorites'
    },
    {
      id: 'attend_events',
      name: 'Partecipante Attivo',
      description: 'Partecipa a 5 eventi culturali',
      icon: 'star',
      target: 5,
      category: 'events'
    },
    {
      id: 'complete_itinerary',
      name: 'Pianificatore Esperto',
      description: 'Completa il tuo primo itinerario',
      icon: 'trophy',
      target: 1,
      category: 'planning'
    }
  ]);
  
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProgress();
    }
  }, [user]);

  const fetchUserProgress = async () => {
    if (!user) return;

    try {
      // Fetch user favorites count
      const { count: favoritesCount } = await supabase
        .from('user_favorites')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // Simulate other progress data (in a real app, this would come from actual tracking)
      const simulatedProgress: UserProgress = {
        visit_borghi: { current: 2, completed: false },
        try_restaurants: { current: 1, completed: false },
        collect_photos: { current: 3, completed: false },
        save_favorites: { current: favoritesCount || 0, completed: (favoritesCount || 0) >= 15 },
        attend_events: { current: 1, completed: false },
        complete_itinerary: { current: 0, completed: false }
      };

      // Check which achievements are completed
      achievements.forEach(achievement => {
        const progress = simulatedProgress[achievement.id];
        if (progress && progress.current >= achievement.target) {
          progress.completed = true;
          if (!progress.completedAt) {
            progress.completedAt = new Date().toISOString();
          }
        }
      });

      setUserProgress(simulatedProgress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (achievementId: string, increment: number = 1) => {
    if (!user) return;

    const currentProgress = userProgress[achievementId]?.current || 0;
    const newProgress = currentProgress + increment;
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (!achievement) return;

    const isCompleted = newProgress >= achievement.target;
    
    setUserProgress(prev => ({
      ...prev,
      [achievementId]: {
        current: newProgress,
        completed: isCompleted,
        completedAt: isCompleted ? new Date().toISOString() : prev[achievementId]?.completedAt
      }
    }));

    // In a real app, you would save this to your database
    console.log(`Achievement ${achievementId} updated: ${newProgress}/${achievement.target}`);
  };

  return {
    achievements,
    userProgress,
    loading,
    updateProgress,
    refetch: fetchUserProgress
  };
};
