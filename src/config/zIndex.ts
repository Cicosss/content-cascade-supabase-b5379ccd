// Global Z-Index Scale - Prevents conflicts and maintains hierarchy
export const Z_INDEX = {
  // Background elements
  background: 0,
  videoOverlay: 5,
  
  // Content layers
  content: 10,
  
  // Sidebar (under navbar)
  sidebar: 35,
  
  // Navigation
  navbar: 40,
  scrollToTop: 45,
  
  // Overlays and modals
  sheet: 9999, // High z-index for mobile menu over Google Maps
  dialog: 50,
  dropdown: 51,
  navigation: 52,
  mobileTouchNav: 53,
  
  // Notifications and alerts
  toast: 60,
  
  // Development and debug
  debug: 70,
  
  // Maximum priority
  modal: 100,
} as const;

// Helper function to get z-index value
export const getZIndex = (layer: keyof typeof Z_INDEX): string => {
  return `z-[${Z_INDEX[layer]}]`;
};