
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  const { user } = useAuth();
  
  // Mostra la sidebar se showSidebar è true, indipendentemente dal login
  if (showSidebar) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1">
            <div className="flex items-center gap-2 p-4 border-b border-slate-200/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <SidebarTrigger className="h-8 w-8 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors" />
              <div className="flex-1">
                <Header />
              </div>
            </div>
            <main className="flex-1 p-4">
              {children}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
