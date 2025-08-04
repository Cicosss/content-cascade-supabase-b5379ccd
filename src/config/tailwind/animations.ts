
export const keyframes = {
  'accordion-down': {
    from: { height: '0' },
    to: { height: 'var(--radix-accordion-content-height)' }
  },
  'accordion-up': {
    from: { height: 'var(--radix-accordion-content-height)' },
    to: { height: '0' }
  },
  'fade-in': {
    "0%": { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" }
  },
  'slide-down': {
    "0%": { opacity: "0", transform: "translateY(-10px)", maxHeight: "0" },
    "100%": { opacity: "1", transform: "translateY(0)", maxHeight: "500px" }
  },
  // Weather animation keyframes
  'spin-slow': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' }
  },
  'float': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-10px)' }
  },
  'drift': {
    '0%, 100%': { transform: 'translateX(0px) translateY(0px)' },
    '25%': { transform: 'translateX(5px) translateY(-3px)' },
    '50%': { transform: 'translateX(-3px) translateY(-5px)' },
    '75%': { transform: 'translateX(-5px) translateY(3px)' }
  },
  'bounce-gentle': {
    '0%, 100%': { transform: 'translateY(0px)' },
    '50%': { transform: 'translateY(-5px)' }
  },
  'shake': {
    '0%, 100%': { transform: 'translateX(0px)' },
    '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-2px)' },
    '20%, 40%, 60%, 80%': { transform: 'translateX(2px)' }
  },
  'rain-drop': {
    '0%': { transform: 'translateY(0px)', opacity: '1' },
    '100%': { transform: 'translateY(12px)', opacity: '0' }
  },
  'snow-fall': {
    '0%': { transform: 'translateY(0px) translateX(0px)', opacity: '1' },
    '100%': { transform: 'translateY(16px) translateX(2px)', opacity: '0' }
  },
  'lightning': {
    '0%, 50%, 100%': { opacity: '0' },
    '25%, 75%': { opacity: '1' }
  },
  'twinkle': {
    '0%, 100%': { opacity: '0.5', transform: 'scale(0.8)' },
    '50%': { opacity: '1', transform: 'scale(1.2)' }
  }
};

export const animation = {
  'accordion-down': 'accordion-down 0.2s ease-out',
  'accordion-up': 'accordion-up 0.2s ease-out',
  'fade-in': 'fade-in 0.3s ease-in-out',
  'slide-down': 'slide-down 0.3s ease-in-out',
  // Weather animations
  'spin-slow': 'spin-slow 8s linear infinite',
  'float': 'float 4s ease-in-out infinite',
  'drift': 'drift 6s ease-in-out infinite',
  'bounce-gentle': 'bounce-gentle 2s ease-in-out infinite',
  'shake': 'shake 0.5s ease-in-out infinite',
  'rain-drop': 'rain-drop 1s ease-in infinite',
  'snow-fall': 'snow-fall 2s ease-in infinite',
  'lightning': 'lightning 1.5s ease-in-out infinite',
  'twinkle': 'twinkle 2s ease-in-out infinite'
};

export const animationDelay = {
  '0': '0ms',
  '300': '300ms',
  '500': '500ms',
  '600': '600ms',
  '1000': '1000ms'
};
