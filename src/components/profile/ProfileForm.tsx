
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

interface ProfileFormProps {
  profile: ProfileData;
  onProfileChange: (profile: ProfileData) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  onProfileChange
}) => {
  const updateProfile = (field: keyof ProfileData, value: any) => {
    onProfileChange({
      ...profile,
      [field]: value
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="first_name" className="text-sm font-semibold text-gray-700">Nome</Label>
          <Input
            id="first_name"
            value={profile.first_name}
            onChange={(e) => updateProfile('first_name', e.target.value)}
            placeholder="Il tuo nome"
            className="h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name" className="text-sm font-semibold text-gray-700">Cognome</Label>
          <Input
            id="last_name"
            value={profile.last_name}
            onChange={(e) => updateProfile('last_name', e.target.value)}
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
          onChange={(e) => updateProfile('email', e.target.value)}
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
            onChange={(e) => updateProfile('arrival_location', e.target.value)}
            placeholder="Da dove arrivi?"
            className="h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="departure_location" className="text-sm font-semibold text-gray-700">Luogo di Partenza</Label>
          <Input
            id="departure_location"
            value={profile.departure_location}
            onChange={(e) => updateProfile('departure_location', e.target.value)}
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
          onChange={(e) => updateProfile('vacation_type', e.target.value)}
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
          onChange={(e) => updateProfile('number_of_people', parseInt(e.target.value) || 1)}
          className="h-12 rounded-2xl border-gray-200 focus:border-emerald-400 focus:ring-emerald-400"
        />
      </div>
    </div>
  );
};
