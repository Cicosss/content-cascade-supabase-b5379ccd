
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bug, X, Eye, EyeOff } from 'lucide-react';
import { getEnvironmentInfo, isDevelopment } from '@/utils/environmentDebug';

const EnvironmentDebugPanel = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user, session, loading } = useAuth();
  const envInfo = getEnvironmentInfo();

  // Solo in development o quando esplicitamente abilitato
  if (!isDevelopment() && !window.localStorage.getItem('debug-mode')) {
    return null;
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-[9999]">
        <Button
          onClick={() => setIsVisible(true)}
          size="sm"
          variant="outline"
          className="bg-yellow-500 hover:bg-yellow-600 text-black border-yellow-600"
        >
          <Bug className="h-4 w-4 mr-1" />
          Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-[9999] max-w-md">
      <Card className="p-4 bg-black/90 text-white border-yellow-500 shadow-2xl">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-yellow-400 flex items-center gap-2">
            <Bug className="h-4 w-4" />
            Environment Debug
          </h3>
          <Button
            onClick={() => setIsVisible(false)}
            size="sm"
            variant="ghost"
            className="text-white hover:bg-white/20 p-1"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
        
        <div className="space-y-2 text-xs">
          <div className="border-b border-gray-600 pb-2">
            <div className="font-semibold text-blue-400">🌐 Environment</div>
            <div>Domain: <span className="text-green-400">{envInfo.currentDomain}</span></div>
            <div>Production: <span className={envInfo.isProduction ? 'text-red-400' : 'text-green-400'}>
              {envInfo.isProduction ? 'Yes' : 'No'}
            </span></div>
          </div>
          
          <div className="border-b border-gray-600 pb-2">
            <div className="font-semibold text-blue-400">🔐 Auth State</div>
            <div>Loading: <span className={loading ? 'text-yellow-400' : 'text-green-400'}>
              {loading ? 'Yes' : 'No'}
            </span></div>
            <div>User: <span className={user ? 'text-green-400' : 'text-red-400'}>
              {user ? 'Authenticated' : 'Not authenticated'}
            </span></div>
            <div>Session: <span className={session ? 'text-green-400' : 'text-red-400'}>
              {session ? 'Active' : 'None'}
            </span></div>
            {user && (
              <div>Email: <span className="text-green-400">{user.email}</span></div>
            )}
          </div>
          
          <div className="border-b border-gray-600 pb-2">
            <div className="font-semibold text-blue-400">⚙️ Config</div>
            <div>Supabase: <span className="text-green-400">Connected</span></div>
            <div className="break-all">URL: <span className="text-gray-400">{envInfo.supabaseUrl}</span></div>
          </div>
          
          <div>
            <div className="font-semibold text-blue-400">🕒 Debug Info</div>
            <div className="text-gray-400">{envInfo.timestamp}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnvironmentDebugPanel;
