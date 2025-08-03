
export interface EnvironmentInfo {
  isProduction: boolean;
  currentDomain: string;
  userAgent: string;
  timestamp: string;
  authState: 'loading' | 'authenticated' | 'unauthenticated' | 'error';
  supabaseUrl: string;
}

export const getEnvironmentInfo = (): EnvironmentInfo => {
  return {
    isProduction: window.location.hostname !== 'localhost',
    currentDomain: window.location.hostname,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    authState: 'loading',
    supabaseUrl: 'https://jxkelzoxxsixqfblnjwj.supabase.co'
  };
};

export const logEnvironmentDifference = (context: string, data: any) => {
  console.group(`🔍 Environment Debug - ${context}`);
  console.log('Environment Info:', getEnvironmentInfo());
  console.log('Context Data:', data);
  console.log('Stack Trace:', new Error().stack);
  console.groupEnd();
};

export const isDevelopment = () => {
  return import.meta.env.DEV || window.location.hostname === 'localhost';
};
