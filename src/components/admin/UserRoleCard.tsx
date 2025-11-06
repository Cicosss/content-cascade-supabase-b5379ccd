import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { UserWithRoles, AppRole } from '@/hooks/useUserRoles';

interface UserRoleCardProps {
  user: UserWithRoles;
  onAddRole: (userId: string, role: AppRole) => void;
  onRemoveRole: (userId: string, role: AppRole) => void;
}

const AVAILABLE_ROLES: AppRole[] = ['admin', 'moderator', 'promoter', 'user'];

const ROLE_LABELS: Record<AppRole, string> = {
  admin: 'Amministratore',
  moderator: 'Moderatore',
  promoter: 'Promotore',
  user: 'Utente'
};

const ROLE_COLORS: Record<AppRole, string> = {
  admin: 'bg-red-100 text-red-800 border-red-300',
  moderator: 'bg-blue-100 text-blue-800 border-blue-300',
  promoter: 'bg-green-100 text-green-800 border-green-300',
  user: 'bg-gray-100 text-gray-800 border-gray-300'
};

export const UserRoleCard: React.FC<UserRoleCardProps> = ({ 
  user, 
  onAddRole, 
  onRemoveRole 
}) => {
  const [selectedRole, setSelectedRole] = React.useState<AppRole>('user');

  const availableToAdd = AVAILABLE_ROLES.filter(
    role => !user.roles.includes(role)
  );

  const handleAddRole = () => {
    if (selectedRole) {
      onAddRole(user.id, selectedRole);
      setSelectedRole('user');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{user.email}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {new Date(user.created_at).toLocaleDateString('it-IT')}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Roles */}
        <div>
          <p className="text-sm font-medium mb-2">Ruoli Assegnati:</p>
          <div className="flex flex-wrap gap-2">
            {user.roles.length === 0 ? (
              <span className="text-sm text-muted-foreground">Nessun ruolo assegnato</span>
            ) : (
              user.roles.map(role => (
                <Badge 
                  key={role} 
                  variant="outline" 
                  className={ROLE_COLORS[role]}
                >
                  {ROLE_LABELS[role]}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 hover:bg-transparent"
                    onClick={() => onRemoveRole(user.id, role)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))
            )}
          </div>
        </div>

        {/* Add Role */}
        {availableToAdd.length > 0 && (
          <div className="flex gap-2">
            <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as AppRole)}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Seleziona ruolo" />
              </SelectTrigger>
              <SelectContent>
                {availableToAdd.map(role => (
                  <SelectItem key={role} value={role}>
                    {ROLE_LABELS[role]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAddRole} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Aggiungi
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
