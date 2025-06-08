
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  arrival_location: string;
  departure_location: string;
  vacation_type: string;
  number_of_people: number;
  children_ages: string[];
}

export const useProfileData = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    arrival_location: '',
    departure_location: '',
    vacation_type: '',
    number_of_people: 1,
    children_ages: []
  });

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) {
      setProfile({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        email: data.email || user.email || '',
        arrival_location: data.arrival_location || '',
        departure_location: data.departure_location || '',
        vacation_type: data.vacation_type || '',
        number_of_people: data.number_of_people || 1,
        children_ages: data.children_ages || []
      });
      setAvatarUrl(data.avatar_url);
    }
  };

  return {
    profile,
    setProfile,
    avatarUrl,
    setAvatarUrl,
    fetchProfile
  };
};
