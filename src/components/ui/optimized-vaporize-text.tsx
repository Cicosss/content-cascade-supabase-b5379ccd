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
    fontFamily: "'Playfair Display', serif",
    fontSize: "36rem",
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
  startAnimation = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>();
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [animationState, setAnimationState] = useState<'idle' | 'vaporizing' | 'fading-in'>('idle');
  const [isReady, setIsReady] = useState(false);
  const [wrapperSize, setWrapperSize] = useState({ width: 0, height: 0 });

  // Readiness gate - aspetta che tutto sia pronto
  const checkReadiness = useCallback(() => {
    if (canvasRef.current && wrapperRef.current && wrapperSize.width > 0 && wrapperSize.height > 0) {
      if (!isReady) {
        setIsReady(true);
        onReady?.();
      }
      return true;
    }
    return false;
  }, [wrapperSize, isReady, onReady]);

  // Inizializza canvas e particelle
  const initializeCanvas = useCallback(() => {
    if (!checkReadiness()) return;
    
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    
    // Setup canvas con device pixel ratio per qualità ottimale
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    
    ctx.scale(dpr, dpr);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${font.fontWeight} ${font.fontSize} ${font.fontFamily}`;
    ctx.fillStyle = color;
    
    // Crea particelle dal testo
    createParticles(ctx, texts[currentTextIndex]);
  }, [checkReadiness, font, color, texts, currentTextIndex]);

  // Crea particelle dal testo
  const createParticles = useCallback((ctx: CanvasRenderingContext2D, text: string) => {
    const canvas = ctx.canvas;
    const centerX = canvas.width / (window.devicePixelRatio || 1) / 2;
    const centerY = canvas.height / (window.devicePixelRatio || 1) / 2;
    
    // Clear e disegna testo
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(text, centerX, centerY);
    
    // Estrai pixel data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    const particles: Particle[] = [];
    
    // Sampling ottimizzato per performance
    const step = 4; // Riduce densità particelle per performance
    
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const index = (y * canvas.width + x) * 4;
        const alpha = pixels[index + 3];
        
        if (alpha > 128) { // Soglia alpha per particelle visibili
          const dpr = window.devicePixelRatio || 1;
          particles.push({
            x: x / dpr,
            y: y / dpr,
            originalX: x / dpr,
            originalY: y / dpr,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1,
            opacity: 1,
            originalOpacity: 1
          });
        }
      }
    }
    
    particlesRef.current = particles;
    
    // Clear canvas per rendering particelle
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderParticles(ctx);
  }, []);

  // Rendering particelle ottimizzato
  const renderParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    const particles = particlesRef.current;
    const rgbaColor = parseColor(color);
    
    particles.forEach(particle => {
      ctx.fillStyle = `rgba(${rgbaColor.r}, ${rgbaColor.g}, ${rgbaColor.b}, ${particle.opacity})`;
      ctx.fillRect(particle.x, particle.y, 2, 2); // Pixel size ottimizzato
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

  // Effect per inizializzazione
  useEffect(() => {
    if (wrapperSize.width > 0 && wrapperSize.height > 0) {
      // Delay per assicurarsi che tutto sia renderizzato
      setTimeout(initializeCanvas, 100);
    }
  }, [wrapperSize, initializeCanvas]);

  // Effect per avvio animazione
  useEffect(() => {
    if (isReady && startAnimation && animationState === 'idle') {
      // Delay aggiuntivo per sincronizzazione perfetta
      setTimeout(startVaporizeAnimation, 500);
    }
  }, [isReady, startAnimation, animationState, startVaporizeAnimation]);

  // Effect per cambio testo
  useEffect(() => {
    if (isReady && animationState === 'idle') {
      initializeCanvas();
    }
  }, [currentTextIndex, isReady, animationState, initializeCanvas]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
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
    </div>
  );
};

export default OptimizedVaporizeText;