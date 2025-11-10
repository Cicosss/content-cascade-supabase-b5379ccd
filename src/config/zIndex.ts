// Global Z-Index Scale - Prevents conflicts and maintains hierarchy
export const Z_INDEX = {
  // Background elements
  background: 0,
  heroVideo: 1,
  videoOverlay: 5,
  
  // Content layers
  content: 10,
  
  // Sidebar (under navbar)
  sidebar: 35,
  
  // Navigation
  navbar: 40,
  navbarButton: 45,
  scrollToTop: 48,
  
  // Overlays and modals
  dialog: 50,
  dropdown: 52,
  mobileTouchNav: 53,
  sheet: 9999, // Mobile menu must be above everything including Google Maps
  
  // Notifications and alerts
  toast: 110,
  
  // Development and debug
  debug: 120,
  
  // Maximum priority
  modal: 150,
} as const;

// Helper function to get z-index value
export const getZIndex = (layer: keyof typeof Z_INDEX): string => {
  return `z-[${Z_INDEX[layer]}]`;
};