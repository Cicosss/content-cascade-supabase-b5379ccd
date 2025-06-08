
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';

interface DebugInfo {
  tokenValid: boolean | null;
  webglSupported: boolean | null;
  networkConnected: boolean | null;
  mapboxApiReachable: boolean | null;
  browserInfo: string;
  errors: string[];
}

export const MapDebugPanel: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    tokenValid: null,
    webglSupported: null,
    networkConnected: null,
    mapboxApiReachable: null,
    browserInfo: '',
    errors: []
  });
  const [isVisible, setIsVisible] = useState(false);

  const runDiagnostics = async () => {
    console.log('🔍 Avvio diagnostica completa...');
    const errors: string[] = [];
    
    // Browser info
    const browserInfo = `${navigator.userAgent}`;
    
    // Test WebGL
    let webglSupported = false;
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      webglSupported = !!gl;
      console.log('🖥️ WebGL supportato:', webglSupported);
    } catch (error) {
      console.error('❌ Errore test WebGL:', error);
      errors.push(`WebGL Error: ${error}`);
    }

    // Test token format
    let tokenValid = false;
    try {
      tokenValid = !!(MAPBOX_TOKEN && 
                     MAPBOX_TOKEN.length > 50 && 
                     MAPBOX_TOKEN.startsWith('pk.'));
      console.log('🔑 Token formato valido:', tokenValid);
    } catch (error) {
      console.error('❌ Errore validazione token:', error);
      errors.push(`Token Error: ${error}`);
    }

    // Test network
    let networkConnected = false;
    try {
      networkConnected = navigator.onLine;
      console.log('🌐 Network online:', networkConnected);
    } catch (error) {
      console.error('❌ Errore test network:', error);
      errors.push(`Network Error: ${error}`);
    }

    // Test Mapbox API
    let mapboxApiReachable = false;
    try {
      const response = await fetch(`https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=${MAPBOX_TOKEN}`, {
        method: 'GET',
        signal: AbortSignal.timeout(10000)
      });
      mapboxApiReachable = response.ok;
      console.log('🗺️ Mapbox API raggiungibile:', mapboxApiReachable, response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        errors.push(`Mapbox API Error ${response.status}: ${errorText}`);
      }
    } catch (error) {
      console.error('❌ Errore test Mapbox API:', error);
      errors.push(`Mapbox API Error: ${error}`);
    }

    setDebugInfo({
      tokenValid,
      webglSupported,
      networkConnected,
      mapboxApiReachable,
      browserInfo,
      errors
    });

    console.log('📊 Diagnostica completata:', {
      tokenValid,
      webglSupported,
      networkConnected,
      mapboxApiReachable,
      errorsCount: errors.length
    });
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  if (!isVisible) {
    return (
      <Button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1"
        size="sm"
      >
        🔍 Debug Mappa
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 max-w-md text-xs">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-900">🔍 Debug Mappa</h3>
        <Button
          onClick={() => setIsVisible(false)}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700 p-1 h-auto"
        >
          ✕
        </Button>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>🔑 Token:</span>
          <span className={debugInfo.tokenValid ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.tokenValid === null ? '⏳' : debugInfo.tokenValid ? '✅ Valido' : '❌ Invalido'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>🖥️ WebGL:</span>
          <span className={debugInfo.webglSupported ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.webglSupported === null ? '⏳' : debugInfo.webglSupported ? '✅ Supportato' : '❌ Non supportato'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>🌐 Network:</span>
          <span className={debugInfo.networkConnected ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.networkConnected === null ? '⏳' : debugInfo.networkConnected ? '✅ Online' : '❌ Offline'}
          </span>
        </div>
        
        <div className="flex justify-between">
          <span>🗺️ Mapbox API:</span>
          <span className={debugInfo.mapboxApiReachable ? 'text-green-600' : 'text-red-600'}>
            {debugInfo.mapboxApiReachable === null ? '⏳' : debugInfo.mapboxApiReachable ? '✅ OK' : '❌ Errore'}
          </span>
        </div>
      </div>

      {debugInfo.errors.length > 0 && (
        <div className="mt-3 p-2 bg-red-50 rounded text-red-700">
          <div className="font-semibold mb-1">❌ Errori:</div>
          {debugInfo.errors.map((error, index) => (
            <div key={index} className="text-xs break-words">{error}</div>
          ))}
        </div>
      )}

      <div className="mt-3 pt-2 border-t">
        <Button
          onClick={runDiagnostics}
          size="sm"
          className="w-full text-xs"
        >
          🔄 Ritest
        </Button>
      </div>
    </div>
  );
};
