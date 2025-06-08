
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2ljb3NzcyIsImEiOiJjbWJtczMzODAxZTNyMmpyMWJuZjY4MHB4In0.RJk9iLhC91gD4iFv32z0VA';

interface DebugInfo {
  tokenValid: boolean | null;
  webglSupported: boolean | null;
  networkConnected: boolean | null;
  mapboxApiReachable: boolean | null;
  browserInfo: string;
  performanceMetrics: {
    tokenCheck: number;
    webglCheck: number;
    networkCheck: number;
    apiCheck: number;
  };
  errors: string[];
}

export const MapDebugPanel: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    tokenValid: null,
    webglSupported: null,
    networkConnected: null,
    mapboxApiReachable: null,
    browserInfo: '',
    performanceMetrics: {
      tokenCheck: 0,
      webglCheck: 0,
      networkCheck: 0,
      apiCheck: 0
    },
    errors: []
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const runDiagnostics = async () => {
    console.log('🔍 Avvio diagnostica completa con metriche performance...');
    setIsRunning(true);
    const errors: string[] = [];
    const metrics = { tokenCheck: 0, webglCheck: 0, networkCheck: 0, apiCheck: 0 };
    
    // Browser info
    const browserInfo = `${navigator.userAgent.split(' ').slice(-2).join(' ')}`;
    
    // Test Token - con timing
    let tokenValid = false;
    const tokenStart = performance.now();
    try {
      tokenValid = !!(MAPBOX_TOKEN && 
                     MAPBOX_TOKEN.length > 50 && 
                     MAPBOX_TOKEN.startsWith('pk.'));
      metrics.tokenCheck = performance.now() - tokenStart;
      console.log('🔑 Token formato valido:', tokenValid, `(${metrics.tokenCheck.toFixed(1)}ms)`);
    } catch (error) {
      metrics.tokenCheck = performance.now() - tokenStart;
      console.error('❌ Errore validazione token:', error);
      errors.push(`Token Error: ${error}`);
    }

    // Test WebGL - con timing e typing corretto
    let webglSupported = false;
    const webglStart = performance.now();
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      webglSupported = !!gl;
      
      if (gl && gl instanceof WebGLRenderingContext) {
        const renderer = gl.getParameter(gl.RENDERER);
        console.log('🖥️ WebGL supportato:', webglSupported, 'Renderer:', renderer);
      } else {
        console.log('🖥️ WebGL supportato:', webglSupported);
      }
      
      metrics.webglCheck = performance.now() - webglStart;
    } catch (error) {
      metrics.webglCheck = performance.now() - webglStart;
      console.error('❌ Errore test WebGL:', error);
      errors.push(`WebGL Error: ${error}`);
    }

    // Test network - con timing
    let networkConnected = false;
    const networkStart = performance.now();
    try {
      networkConnected = navigator.onLine;
      // Test aggiuntivo con fetch a un endpoint veloce
      const connectivityTest = await fetch('https://httpbin.org/get', {
        method: 'HEAD',
        signal: AbortSignal.timeout(3000)
      });
      networkConnected = networkConnected && connectivityTest.ok;
      metrics.networkCheck = performance.now() - networkStart;
      console.log('🌐 Network test:', networkConnected, `(${metrics.networkCheck.toFixed(1)}ms)`);
    } catch (error) {
      metrics.networkCheck = performance.now() - networkStart;
      console.error('❌ Errore test network:', error);
      errors.push(`Network Error: ${error}`);
    }

    // Test Mapbox API - con timing dettagliato
    let mapboxApiReachable = false;
    const apiStart = performance.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const response = await fetch(`https://api.mapbox.com/styles/v1/mapbox/streets-v12?access_token=${MAPBOX_TOKEN}`, {
        method: 'GET',
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      mapboxApiReachable = response.ok;
      metrics.apiCheck = performance.now() - apiStart;
      
      console.log('🗺️ Mapbox API test:', {
        reachable: mapboxApiReachable,
        status: response.status,
        timing: `${metrics.apiCheck.toFixed(1)}ms`,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        errors.push(`Mapbox API Error ${response.status}: ${errorText.substring(0, 100)}`);
      }
    } catch (error) {
      metrics.apiCheck = performance.now() - apiStart;
      console.error('❌ Errore test Mapbox API:', error);
      if (error instanceof Error && error.name === 'AbortError') {
        errors.push('Mapbox API: Timeout dopo 8 secondi');
      } else {
        errors.push(`Mapbox API Error: ${error}`);
      }
    }

    setDebugInfo({
      tokenValid,
      webglSupported,
      networkConnected,
      mapboxApiReachable,
      browserInfo,
      performanceMetrics: metrics,
      errors
    });

    setIsRunning(false);

    console.log('📊 Diagnostica completata:', {
      tokenValid,
      webglSupported,
      networkConnected,
      mapboxApiReachable,
      metrics,
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

  const formatTiming = (ms: number) => {
    if (ms < 1) return '<1ms';
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms/1000).toFixed(1)}s`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white rounded-lg shadow-lg border p-4 max-w-sm text-xs">
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
        <div className="flex justify-between items-center">
          <span>🔑 Token:</span>
          <div className="text-right">
            <span className={debugInfo.tokenValid ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.tokenValid === null ? '⏳' : debugInfo.tokenValid ? '✅' : '❌'}
            </span>
            <div className="text-gray-400 text-xs">
              {formatTiming(debugInfo.performanceMetrics.tokenCheck)}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span>🖥️ WebGL:</span>
          <div className="text-right">
            <span className={debugInfo.webglSupported ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.webglSupported === null ? '⏳' : debugInfo.webglSupported ? '✅' : '❌'}
            </span>
            <div className="text-gray-400 text-xs">
              {formatTiming(debugInfo.performanceMetrics.webglCheck)}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span>🌐 Network:</span>
          <div className="text-right">
            <span className={debugInfo.networkConnected ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.networkConnected === null ? '⏳' : debugInfo.networkConnected ? '✅' : '❌'}
            </span>
            <div className="text-gray-400 text-xs">
              {formatTiming(debugInfo.performanceMetrics.networkCheck)}
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span>🗺️ Mapbox API:</span>
          <div className="text-right">
            <span className={debugInfo.mapboxApiReachable ? 'text-green-600' : 'text-red-600'}>
              {debugInfo.mapboxApiReachable === null ? '⏳' : debugInfo.mapboxApiReachable ? '✅' : '❌'}
            </span>
            <div className="text-gray-400 text-xs">
              {formatTiming(debugInfo.performanceMetrics.apiCheck)}
            </div>
          </div>
        </div>
      </div>

      {debugInfo.errors.length > 0 && (
        <div className="mt-3 p-2 bg-red-50 rounded text-red-700 max-h-20 overflow-y-auto">
          <div className="font-semibold mb-1">❌ Errori:</div>
          {debugInfo.errors.map((error, index) => (
            <div key={index} className="text-xs break-words">{error}</div>
          ))}
        </div>
      )}

      <div className="mt-3 p-2 bg-gray-50 rounded text-gray-600">
        <div className="font-semibold mb-1">🖥️ Browser:</div>
        <div className="text-xs break-words">{debugInfo.browserInfo}</div>
      </div>

      <div className="mt-3 pt-2 border-t">
        <Button
          onClick={runDiagnostics}
          disabled={isRunning}
          size="sm"
          className="w-full text-xs"
        >
          {isRunning ? '⏳ Testing...' : '🔄 Ritest'}
        </Button>
      </div>
    </div>
  );
};
