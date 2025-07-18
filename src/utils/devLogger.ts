// Development logger utility
// Only logs in development environment

export const devLog = {
  info: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  debug: (message: string, ...args: any[]) => {
    if (import.meta.env.DEV) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};