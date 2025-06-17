
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showSidebar = false }) => {
  const { user } = useAuth();
  
  // Mostra la sidebar se showSidebar è true, indipendentemente dal login
  if (showSidebar) {
    return (
      <SidebarProvider defaultOpen={true}>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <div className="sticky top-0 z-[999]">
              <div className="flex items-center gap-2 px-4 py-2 bg-[#2A3385] border-b border-[#1e2563]">
                <div className="flex-1">
                  <Header />
                </div>
              </div>
            </div>
            <main className="flex-1 p-4 pl-6 z-[1]">
              {children}
            </main>
            <Footer />
          </SidebarInset>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
