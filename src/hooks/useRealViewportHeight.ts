import { useEffect, useState } from 'react';

// Hook to get real viewport height accounting for mobile browser bars
export function useRealViewportHeight() {
  const [height, setHeight] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const vv = (window as any).visualViewport as VisualViewport | undefined;
      return vv?.height ?? window.innerHeight;
    }
    return 0;
  });

  useEffect(() => {
    const updateHeight = () => {
      const vv = (window as any).visualViewport as VisualViewport | undefined;
      const newHeight = vv?.height ?? window.innerHeight;
      setHeight(newHeight);
      
      // Update CSS custom property for use in styles
      document.documentElement.style.setProperty('--real-vh', `${newHeight * 0.01}px`);
    };

    // Initial update
    updateHeight();

    // Listen to both window resize and visualViewport resize
    window.addEventListener('resize', updateHeight);
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    vv?.addEventListener('resize', updateHeight);
    vv?.addEventListener('scroll', updateHeight);

    return () => {
      window.removeEventListener('resize', updateHeight);
      vv?.removeEventListener('resize', updateHeight);
      vv?.removeEventListener('scroll', updateHeight);
    };
  }, []);

  return height;
}
