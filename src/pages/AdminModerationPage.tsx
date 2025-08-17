
import React from 'react';
import AdminPanel from '@/components/admin/AdminPanel';
import { useAdminAuth } from '@/hooks/useAdminAuth';

const AdminModerationPage: React.FC = () => {
  const { isAdmin, isLoading } = useAdminAuth();

  if (isLoading) {
    return <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">Caricamento...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold">Accesso negato</h1>
          <p className="text-sm opacity-70">Non hai i permessi per accedere a questa pagina.</p>
        </div>
      </div>
    );
  }

  return <AdminPanel />;
};

export default AdminModerationPage;
