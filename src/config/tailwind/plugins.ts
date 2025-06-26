
export const animationDelayPlugin = function({ addUtilities }: any) {
  const newUtilities = {
    '.animation-delay-0': {
      'animation-delay': '0ms',
    },
    '.animation-delay-300': {
      'animation-delay': '300ms',
    },
    '.animation-delay-500': {
      'animation-delay': '500ms',
    },
    '.animation-delay-600': {
      'animation-delay': '600ms',
    },
    '.animation-delay-1000': {
      'animation-delay': '1000ms',
    },
  }
  addUtilities(newUtilities)
};
