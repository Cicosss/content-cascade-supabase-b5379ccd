
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserVisits } from '@/hooks/useUserVisits';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  target: number;
  category: string;
  categoryFilter: string; // The category to filter POIs by
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
  const { visits, loading: visitsLoading, getVisitsByCategory } = useUserVisits();
  const [achievements] = useState<Achievement[]>([
    {
      id: 'visit_borghi',
      name: 'Esploratore dei Borghi',
      description: 'Visita 5 borghi storici della Romagna',
      icon: 'mappin',
      target: 5,
      category: 'exploration',
      categoryFilter: 'borgo'
    },
    {
      id: 'try_restaurants',
      name: 'Gourmet Romagnolo',
      description: 'Prova 3 ristoranti tipici locali',
      icon: 'utensils',
      target: 3,
      category: 'food',
      categoryFilter: 'ristoranti'
    },
    {
      id: 'visit_attractions',
      name: 'Scopritore di Attrazioni',
      description: 'Visita 7 attrazioni turistiche',
      icon: 'camera',
      target: 7,
      category: 'attractions',
      categoryFilter: 'attrazioni'
    },
    {
      id: 'explore_culture',
      name: 'Cultore del Territorio',
      description: 'Visita 4 musei o siti culturali',
      icon: 'star',
      target: 4,
      category: 'culture',
      categoryFilter: 'museo'
    },
    {
      id: 'beach_lover',
      name: 'Amante del Mare',
      description: 'Visita 3 stabilimenti balneari',
      icon: 'heart',
      target: 3,
      category: 'beach',
      categoryFilter: 'stabilimento'
    },
    {
      id: 'first_visit',
      name: 'Primo Passo',
      description: 'Registra la tua prima visita',
      icon: 'trophy',
      target: 1,
      category: 'milestone',
      categoryFilter: 'all'
    }
  ]);
  
  const [userProgress, setUserProgress] = useState<UserProgress>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && !visitsLoading) {
      calculateProgress();
    }
  }, [user, visits, visitsLoading]);

  const calculateProgress = () => {
    if (!visits) return;

    const progress: UserProgress = {};

    achievements.forEach(achievement => {
      let current = 0;

      if (achievement.categoryFilter === 'all') {
        current = visits.length;
      } else {
        const categoryVisits = getVisitsByCategory(achievement.categoryFilter);
        current = categoryVisits.length;
      }

      const completed = current >= achievement.target;
      
      progress[achievement.id] = {
        current: Math.min(current, achievement.target),
        completed,
        completedAt: completed ? new Date().toISOString() : undefined
      };
    });

    setUserProgress(progress);
    setLoading(false);
  };

  const getCompletedCount = () => {
    return achievements.filter(achievement => 
      userProgress[achievement.id]?.completed
    ).length;
  };

  const getTotalVisits = () => {
    return visits.length;
  };

  const getVisitsByAchievementCategory = (categoryFilter: string) => {
    if (categoryFilter === 'all') return visits.length;
    return getVisitsByCategory(categoryFilter).length;
  };

  return {
    achievements,
    userProgress,
    loading: loading || visitsLoading,
    getCompletedCount,
    getTotalVisits,
    getVisitsByAchievementCategory,
    refetch: calculateProgress
  };
};
