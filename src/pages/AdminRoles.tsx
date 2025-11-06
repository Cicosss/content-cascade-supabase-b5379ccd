import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Users, Shield, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useUserRoles } from '@/hooks/useUserRoles';
import { UserRoleCard } from '@/components/admin/UserRoleCard';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AdminRoles: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const { users, isLoading, fetchUsersWithRoles, addRole, removeRole } = useUserRoles();

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, authLoading, navigate]);

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">Caricamento...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold">Gestione Ruoli Utente</h1>
              <p className="text-muted-foreground">
                Gestisci i permessi e i ruoli degli utenti registrati
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={fetchUsersWithRoles}
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Aggiorna
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/admin-moderation')}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Torna al Pannello Admin
            </Button>
          </div>
        </div>

        {/* Info Alert */}
        <Alert className="mb-6">
          <Users className="h-4 w-4" />
          <AlertTitle>Sistema di Ruoli</AlertTitle>
          <AlertDescription>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li><strong>Admin:</strong> Accesso completo + gestione ruoli e moderazione</li>
              <li><strong>Moderator:</strong> Accesso al pannello di moderazione POI</li>
              <li><strong>Promoter:</strong> Accesso alla sezione Promotore del Territorio</li>
              <li><strong>User:</strong> Utente base (assegnato automaticamente)</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Users List */}
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium">Nessun utente registrato</p>
              <p className="text-muted-foreground">Gli utenti appariranno qui dopo la registrazione</p>
            </div>
          ) : (
            users.map(user => (
              <UserRoleCard
                key={user.id}
                user={user}
                onAddRole={addRole}
                onRemoveRole={removeRole}
              />
            ))
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminRoles;
