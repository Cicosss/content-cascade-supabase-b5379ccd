import React, { useRef, useEffect, useState, useCallback } from 'react';

export enum Tag {
  H1 = 'h1',
  H2 = 'h2',
  H3 = 'h3',
  P = 'p'
}

interface OptimizedVaporizeTextProps {
  texts: string[];
  font?: {
    fontFamily?: string;
    fontSize?: string;
    fontWeight?: number;
  };
  color?: string;
  animation?: {
    vaporizeDuration?: number;
    fadeInDuration?: number;
    waitDuration?: number;
  };
  tag?: Tag;
  onReady?: () => void;
  onError?: () => void;
  startAnimation?: boolean;
}

interface Particle {
  x: number;
  y: number;
  originalX: number;
  originalY: number;
  vx: number;
  vy: number;
  opacity: number;
  originalOpacity: number;
}

const OptimizedVaporizeText: React.FC<OptimizedVaporizeTextProps> = ({
  texts,
  font = {
    fontFamily: "'Playfair Display', serif, Georgia, serif",
    fontSize: "4rem",
    fontWeight: 700
  },
  color = "rgba(255, 255, 255, 0.9)",
  animation = {
    vaporizeDuration: 1.5,
    fadeInDuration: 1.0,
    waitDuration: 0.8
  },
  tag = Tag.H2,
  onReady,
  onError,
  startAnimation = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const initTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animationState, setAnimationState] = useState<'idle' | 'vaporizing' | 'fading-in'>('idle');
  const [isReady, setIsReady] = useState(false);
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });
  const [debugInfo, setDebugInfo] = useState<string>('Initializing...');

  // Semplificato: converte fontSize in pixel
  const getFontSizeInPixels = useCallback((fontSize: string): number => {
    console.log(`Converting font size: ${fontSize}`);
    
    if (fontSize.includes('clamp')) {
      const vw = window.innerWidth;
      // Parsing migliorato per clamp
      const clampMatch = fontSize.match(/clamp\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
      if (clampMatch) {
        const minStr = clampMatch[1].trim();
        const vwStr = clampMatch[2].trim();
        const maxStr = clampMatch[3].trim();
        
        const minRem = parseFloat(minStr.replace('rem', ''));
        const maxRem = parseFloat(maxStr.replace('rem', ''));
        const vwValue = parseFloat(vwStr.replace('vw', ''));
        
        const vwPixels = (vw * vwValue) / 100;
        const minPixels = minRem * 16;
        const maxPixels = maxRem * 16;
        
        const result = Math.max(minPixels, Math.min(maxPixels, vwPixels));
        console.log(`Clamp result: ${result}px (vw: ${vw}, vwPixels: ${vwPixels}, min: ${minPixels}, max: ${maxPixels})`);
        return result;
      }
    }
    
    if (fontSize.includes('rem')) {
      const result = parseFloat(fontSize) * 16;
      console.log(`Rem result: ${result}px`);
      return result;
    }
    
    if (fontSize.includes('px')) {
      const result = parseFloat(fontSize);
      console.log(`Pixel result: ${result}px`);
      return result;
    }
    
    console.log('Using fallback: 64px');
    return 64;
  }, []);

  // Inizializzazione semplificata del canvas
  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current || !wrapperRef.current || wrapperSize.width === 0) {
      console.log('Canvas initialization skipped - missing elements');
      setDebugInfo('Waiting for elements...');
      return false;
    }
    
    console.log('Starting canvas initialization...');
    setDebugInfo('Initializing canvas...');
    
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Could not get 2D context');
        onError?.();
        return false;
      }

      // Dimensioni semplici basate sul wrapper
      const rect = wrapperRef.current.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      
      console.log(`Wrapper size: ${rect.width}x${rect.height}`);
      
      // Canvas size = wrapper size
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      
      ctx.scale(dpr, dpr);
      
      // Font setup con fallback
      const fontSizePixels = getFontSizeInPixels(font.fontSize || '4rem');
      console.log(`Using font size: ${fontSizePixels}px`);
      
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${font.fontWeight} ${fontSizePixels}px ${font.fontFamily}`;
      ctx.fillStyle = color;
      
      // Test se il font è caricato disegnando il testo
      const testText = texts[currentTextIndex] || 'Test';
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      console.log(`Drawing text "${testText}" at ${centerX}, ${centerY}`);
      
      // Clear e disegna per test
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillText(testText, centerX, centerY);
      
      // Verifica se il testo è stato disegnato
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const hasContent = imageData.data.some((value, index) => index % 4 === 3 && value > 0);
      
      if (!hasContent) {
        console.error('No text was drawn to canvas');
        onError?.();
        return false;
      }
      
      console.log('Text successfully drawn to canvas');
      setDebugInfo('Canvas ready');
      
      // Crea particelle
      createParticles(ctx, testText, centerX, centerY);
      
      return true;
    } catch (error) {
      console.error('Canvas initialization error:', error);
      setDebugInfo('Canvas error');
      onError?.();
      return false;
    }
  }, [wrapperSize, font, color, texts, currentTextIndex, getFontSizeInPixels, onError]);

  // Creazione particelle semplificata
  const createParticles = useCallback((ctx: CanvasRenderingContext2D, text: string, centerX: number, centerY: number) => {
    console.log('Creating particles...');
    setDebugInfo('Creating particles...');
    
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillText(text, centerX, centerY);
    
    // Estrai pixel data
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const pixels = imageData.data;
    const particles: Particle[] = [];
    
    // Sampling delle particelle con step più grande per performance
    const step = 6;
    const dpr = window.devicePixelRatio || 1;
    
    for (let y = 0; y < ctx.canvas.height; y += step) {
      for (let x = 0; x < ctx.canvas.width; x += step) {
        const index = (y * ctx.canvas.width + x) * 4;
        const alpha = pixels[index + 3];
        
        if (alpha > 100) {
          particles.push({
            x: x / dpr,
            y: y / dpr,
            originalX: x / dpr,
            originalY: y / dpr,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3 - 1,
            opacity: 1,
            originalOpacity: 1
          });
        }
      }
    }
    
    console.log(`Created ${particles.length} particles`);
    particlesRef.current = particles;
    
    // Render iniziale
    renderParticles(ctx);
    setDebugInfo(`Ready - ${particles.length} particles`);
    
    // Segna come pronto
    if (!isReady) {
      setIsReady(true);
      onReady?.();
    }
  }, [isReady, onReady]);

  // Rendering particelle
  const renderParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const particles = particlesRef.current;
    const rgbaColor = parseColor(color);
    
    particles.forEach(particle => {
      ctx.fillStyle = `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, ${particle.opacity})`;
      ctx.fillRect(particle.x, particle.y, 3, 3);
    });
  }, [color]);

  // Parse colore
  const parseColor = useCallback((colorStr: string) => {
    if (colorStr.startsWith('rgba')) {
      const match = colorStr.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
      return match ? {
        r: parseInt(match[1]),
        g: parseInt(match[2]),
        b: parseInt(match[3]),
        a: parseFloat(match[4])
      } : { r: 255, g: 255, b: 255, a: 1 };
    }
    return { r: 255, g: 255, b: 255, a: 1 };
  }, []);

  // Animazione vaporize
  const startVaporizeAnimation = useCallback(() => {
    if (!isReady || animationState !== 'idle') return;
    
    setAnimationState('vaporizing');
    const startTime = Date.now();
    const duration = (animation.vaporizeDuration || 1.5) * 1000;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d')!;
      const particles = particlesRef.current;
      
      // Aggiorna particelle
      particles.forEach(particle => {
        particle.x = particle.originalX + particle.vx * progress * 50;
        particle.y = particle.originalY + particle.vy * progress * 50;
        particle.opacity = particle.originalOpacity * (1 - progress);
      });
      
      renderParticles(ctx);
      
      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animazione completata
        setAnimationState('fading-in');
        
        // Passa al testo successivo dopo wait duration
        timeoutRef.current = setTimeout(() => {
          setCurrentTextIndex((prev) => (prev + 1) % texts.length);
          setAnimationState('idle');
        }, (animation.waitDuration || 0.8) * 1000);
      }
    };
    
    animate();
  }, [isReady, animationState, animation, texts.length]);

  // Effect per gestire resize
  useEffect(() => {
    const updateSize = () => {
      if (wrapperRef.current) {
        const rect = wrapperRef.current.getBoundingClientRect();
        setWrapperSize({ width: rect.width, height: rect.height });
      }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Effect per inizializzazione con timeout di sicurezza
  useEffect(() => {
    if (wrapperSize.width > 0 && wrapperSize.height > 0) {
      console.log('Scheduling canvas initialization...');
      
      // Clear precedenti timeout
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      
      // Prova inizializzazione immediata
      const success = initializeCanvas();
      
      if (!success) {
        // Retry dopo 500ms
        initTimeoutRef.current = setTimeout(() => {
          console.log('Retrying canvas initialization...');
          const retrySuccess = initializeCanvas();
          
          if (!retrySuccess) {
            console.log('Canvas initialization failed, triggering fallback');
            onError?.();
          }
        }, 500);
      }
    }
  }, [wrapperSize, currentTextIndex, initializeCanvas, onError]);

  // Effect per avvio animazione
  useEffect(() => {
    if (isReady && startAnimation && animationState === 'idle') {
      setTimeout(startVaporizeAnimation, 200);
    }
  }, [isReady, startAnimation, animationState, startVaporizeAnimation]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
    };
  }, []);

  // SEO Element
  const SeoElement = React.memo(({ tag, texts }: { tag: Tag; texts: string[] }) => {
    const Element = tag;
    return (
      <Element className="sr-only">
        {texts.join(' ')}
      </Element>
    );
  });

  return (
    <div ref={wrapperRef} className="relative w-full h-full">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ willChange: 'auto' }}
      />
      <SeoElement tag={tag} texts={texts} />
      {/* Debug info in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 text-xs text-white/50 bg-black/20 px-2 py-1 rounded">
          {debugInfo}
        </div>
      )}
    </div>
  );
};

export default OptimizedVaporizeText;