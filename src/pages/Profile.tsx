
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileAvatarSection } from '@/components/profile/ProfileAvatarSection';
import { ProfileForm } from '@/components/profile/ProfileForm';
import { ProfileActions } from '@/components/profile/ProfileActions';
import { useProfileData } from '@/hooks/useProfileData';
import { useAvatarManager } from '@/hooks/useAvatarManager';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const { profile, setProfile, avatarUrl, setAvatarUrl } = useProfileData();
  const { handleAvatarChange } = useAvatarManager();

  const onAvatarChange = (newAvatarUrl: string | null) => {
    handleAvatarChange(newAvatarUrl, setAvatarUrl);
  };

  const updateProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        id: user.id,
        first_name: profile.first_name,
        last_name: profile.last_name,
        email: profile.email,
        arrival_location: profile.arrival_location,
        departure_location: profile.departure_location,
        vacation_type: profile.vacation_type,
        number_of_people: profile.number_of_people,
        children_ages: profile.children_ages,
        avatar_url: avatarUrl
      });

    if (error) {
      toast({
        title: "Errore",
        description: "Impossibile aggiornare il profilo",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Successo",
        description: "Profilo aggiornato con successo"
      });
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
          <div className="container mx-auto px-4 py-8">
            <Card className="p-8 text-center rounded-3xl border-0 shadow-lg">
              <p className="text-gray-600 text-lg">Devi effettuare l'accesso per vedere il tuo profilo.</p>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Card className="p-8 rounded-3xl border-0 shadow-xl bg-white/80 backdrop-blur-sm">
              <ProfileHeader />

              <div className="space-y-8">
                <ProfileAvatarSection 
                  avatarUrl={avatarUrl} 
                  onAvatarChange={onAvatarChange}
                />

                <ProfileForm 
                  profile={profile}
                  onProfileChange={setProfile}
                />

                <ProfileActions 
                  loading={loading}
                  onSave={updateProfile}
                />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
