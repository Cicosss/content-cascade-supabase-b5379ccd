
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

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
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
        children_ages: profile.children_ages
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
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <Card className="p-6 text-center">
            <p>Devi effettuare l'accesso per vedere il tuo profilo.</p>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-6">
            <div className="flex items-center mb-6">
              <User className="h-6 w-6 mr-3 text-blue-600" />
              <h1 className="text-2xl font-bold">Il Mio Profilo</h1>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="first_name">Nome</Label>
                  <Input
                    id="first_name"
                    value={profile.first_name}
                    onChange={(e) => setProfile({...profile, first_name: e.target.value})}
                    placeholder="Il tuo nome"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name">Cognome</Label>
                  <Input
                    id="last_name"
                    value={profile.last_name}
                    onChange={(e) => setProfile({...profile, last_name: e.target.value})}
                    placeholder="Il tuo cognome"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  placeholder="La tua email"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="arrival_location">Luogo di Arrivo</Label>
                  <Input
                    id="arrival_location"
                    value={profile.arrival_location}
                    onChange={(e) => setProfile({...profile, arrival_location: e.target.value})}
                    placeholder="Da dove arrivi?"
                  />
                </div>
                <div>
                  <Label htmlFor="departure_location">Luogo di Partenza</Label>
                  <Input
                    id="departure_location"
                    value={profile.departure_location}
                    onChange={(e) => setProfile({...profile, departure_location: e.target.value})}
                    placeholder="Dove vai dopo?"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="vacation_type">Tipo di Vacanza</Label>
                <Input
                  id="vacation_type"
                  value={profile.vacation_type}
                  onChange={(e) => setProfile({...profile, vacation_type: e.target.value})}
                  placeholder="Es. Relax, Avventura, Famiglia..."
                />
              </div>

              <div>
                <Label htmlFor="number_of_people">Numero di Persone</Label>
                <Input
                  id="number_of_people"
                  type="number"
                  min="1"
                  value={profile.number_of_people}
                  onChange={(e) => setProfile({...profile, number_of_people: parseInt(e.target.value) || 1})}
                />
              </div>

              <Button 
                onClick={updateProfile} 
                disabled={loading}
                className="w-full romagna-gradient"
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
