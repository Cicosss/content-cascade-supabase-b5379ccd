import { useEffect, useState } from 'react';

interface ViewportSize {
  width: number;
  height: number;
}

// Returns precise viewport size using VisualViewport when available.
// Pass shouldTrack=false to avoid listeners (e.g. on desktop when not needed).
export function useViewportSize(shouldTrack: boolean = true): ViewportSize {
  const getSize = () => {
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    const height = vv?.height ?? window.innerHeight;
    const width = vv?.width ?? window.innerWidth;
    return { width: Math.round(width), height: Math.round(height) };
  };

  const [size, setSize] = useState<ViewportSize>(() => getSize());

  useEffect(() => {
    if (!shouldTrack) return;

    const update = () => setSize(getSize());

    window.addEventListener('resize', update);
    const vv = (window as any).visualViewport as VisualViewport | undefined;
    vv?.addEventListener('resize', update);

    // Initial sync
    update();

    return () => {
      window.removeEventListener('resize', update);
      vv?.removeEventListener('resize', update);
    };
  }, [shouldTrack]);

  return size;
}
