
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { User, MapPin, Calendar, Users } from 'lucide-react';
import { AvatarUpload } from '@/components/AvatarUpload';

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    first_name: '',
    last_name: '',
    email: '',
    arrival_location: '',
    departure_location: '',
    vacation_type: '',
    number_of_people: 1,
    children_ages: [] as string[]
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

  const uploadAvatar = async (file: File): Promise<string | null> => {
    if (!file || !user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Errore",
          description: "Errore durante il caricamento dell'immagine",
          variant: "destructive"
        });
        return null;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      toast({
        title: "Errore",
        description: "Errore durante il caricamento dell'immagine",
        variant: "destructive"
      });
      return null;
    }
  };

  const handleAvatarChange = async (newAvatarUrl: string | null) => {
    if (!user) return;

    // If it's a file (blob URL), upload it
    if (newAvatarUrl && newAvatarUrl.startsWith('blob:')) {
      const pendingFile = (window as any).pendingAvatarFile;
      if (pendingFile) {
        const uploadedUrl = await uploadAvatar(pendingFile);
        if (uploadedUrl) {
          setAvatarUrl(uploadedUrl);
          // Update profile in database
          await supabase
            .from('user_profiles')
            .update({ avatar_url: uploadedUrl })
            .eq('id', user.id);
          
          toast({
            title: "Successo",
            description: "Immagine del profilo aggiornata"
          });
        }
        // Clean up
        (window as any).pendingAvatarFile = null;
      }
    } else {
      // It's a predefined avatar URL
      setAvatarUrl(newAvatarUrl);
      // Update profile in database
      await supabase
        .from('user_profiles')
        .update({ avatar_url: newAvatarUrl })
        .eq('id', user.id);
      
      toast({
        title: "Successo",
        description: "Immagine del profilo aggiornata"
      });
    }
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-8 text-center rounded-3xl border-0 shadow-lg">
            <p className="text-gray-600 text-lg">Devi effettuare l'accesso per vedere il tuo profilo.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-8 rounded-3xl border-0 shadow-xl bg-white/80 backdrop-blur-sm">
            <div className="flex items-center mb-8">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mr-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                Il Mio Profilo
              </h1>
            </div>

            <div className="space-y-8">
              {/* Avatar Upload Section */}
              <div className="bg-gray-50 p-6 rounded-2xl">
                <AvatarUpload 
                  selectedAvatar={avatarUrl} 
                  onAvatarChange={handleAvatarChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-sm font-semibold text-gray-700">Nome</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                    placeholder="Il tuo nome"
                    className="h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm font-semibold text-gray-700">Cognome</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                    placeholder="Il tuo cognome"
                    className="h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  placeholder="La tua email"
                  className="h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="arrival_location" className="text-sm font-semibold text-gray-700">Luogo di Arrivo</Label>
                  <Input
                    id="arrival_location"
                    value={profile.arrival_location}
                    onChange={(e) => setProfile({...profile, arrival_location: e.target.value})}
                    placeholder="Da dove arrivi?"
                    className="h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departure_location" className="text-sm font-semibold text-gray-700">Luogo di Partenza</Label>
                  <Input
                    id="departure_location"
                    value={profile.departure_location}
                    onChange={(e) => setProfile({...profile, departure_location: e.target.value})}
                    placeholder="Dove vai dopo?"
                    className="h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="vacation_type" className="text-sm font-semibold text-gray-700">Tipo di Vacanza</Label>
                <Input
                  id="vacation_type"
                  value={profile.vacation_type}
                  onChange={(e) => setProfile({...profile, vacation_type: e.target.value})}
                  placeholder="Es. Relax, Avventura, Famiglia..."
                  className="h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number_of_people" className="text-sm font-semibold text-gray-700">Numero di Persone</Label>
                <Input
                  id="number_of_people"
                  type="number"
                  min="1"
                  value={profile.number_of_people}
                  onChange={(e) => setProfile({...profile, number_of_people: parseInt(e.target.value) || 1})}
                  className="h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
                />
              </div>

              <Button 
                onClick={updateProfile} 
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {loading ? 'Salvando...' : 'Salva Profilo'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
