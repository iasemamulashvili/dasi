'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollLogoCanvasProps {
  heroContainerRef: React.RefObject<HTMLDivElement | null>;
}

export default function ScrollLogoCanvas({ heroContainerRef }: ScrollLogoCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<HTMLImageElement[]>([]);
  const lastRenderedFrame = useRef<number>(-1);
  
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const totalFrames = 144;
  const initialFrameIndex = 0; // Start with fully exploded frame on mount

  // Detect mobile viewports to adjust pinning and layouts (strict desktop view is >= 1024px)
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Shared frame drawing logic
  const drawFrameToCanvas = (canvas: HTMLCanvasElement, img: HTMLImageElement, isMobileView: boolean) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    
    // Set buffer dimensions dynamically to maintain crisp high-DPI scaling
    const rectWidth = canvas.clientWidth;
    const rectHeight = canvas.clientHeight;
    if (rectWidth > 0 && rectHeight > 0) {
      const targetWidth = Math.round(rectWidth * dpr);
      const targetHeight = Math.round(rectHeight * dpr);
      if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        ctx.resetTransform();
        ctx.scale(dpr, dpr);
      }
    }

    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);

    const imageWidth = img.width;
    const imageHeight = img.height;
    let drawWidth = w;
    let drawHeight = h;
    let offsetX = 0;
    let offsetY = 0;

    // Universal contain fitting for canvas to ensure 100% full visibility on all frames (zero edge clipping)
    const marginScale = isMobileView ? 0.88 : 0.92;
    const canvasRatio = w / h;
    const imageRatio = imageWidth / imageHeight;

    if (canvasRatio > imageRatio) {
      drawHeight = h * marginScale;
      drawWidth = drawHeight * imageRatio;
      offsetX = (w - drawWidth) / 2;
      offsetY = (h - drawHeight) / 2;
    } else {
      drawWidth = w * marginScale;
      drawHeight = drawWidth / imageRatio;
      offsetX = (w - drawWidth) / 2;
      offsetY = (h - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  // Preload initial frame for instant display, then load remainder in the background
  useEffect(() => {
    let isMounted = true;
    const preloadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    // 1. Load initial frame (assembled state)
    const initialImg = new Image();
    const initialFrameNum = String(initialFrameIndex).padStart(3, '0');
    initialImg.src = `/Images/logo-sequence/frame_${initialFrameNum}.webp`;

    initialImg.onload = () => {
      if (!isMounted) return;
      preloadedImages[initialFrameIndex] = initialImg;
      
      // Draw immediately on mount
      const canvas = canvasRef.current;
      if (canvas) {
        drawFrameToCanvas(canvas, initialImg, window.innerWidth < 1024);
      }

      // 2. Load the remaining frames in the background
      loadedCount = 1;
      setLoadProgress(Math.round((loadedCount / totalFrames) * 100));

      for (let i = 0; i < totalFrames; i++) {
        if (i === initialFrameIndex) continue;

        const img = new Image();
        const frameNum = String(i).padStart(3, '0');
        img.src = `/Images/logo-sequence/frame_${frameNum}.webp`;

        img.onload = () => {
          if (!isMounted) return;
          preloadedImages[i] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / totalFrames) * 100));

          if (loadedCount === totalFrames) {
            imageRefs.current = preloadedImages;
            setLoading(false);
          }
        };

        img.onerror = () => {
          if (!isMounted) return;
          console.warn(`Failed to preload frame ${i}, falling back to default`);
          preloadedImages[i] = initialImg; // Fallback to initial frame
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / totalFrames) * 100));

          if (loadedCount === totalFrames) {
            imageRefs.current = preloadedImages;
            setLoading(false);
          }
        };
      }
    };

    initialImg.onerror = () => {
      if (!isMounted) return;
      console.error("Critical: Failed to load initial assembled frame");
      setLoading(false);
    };

    return () => {
      isMounted = false;
      preloadedImages.forEach(img => {
        if (img) {
          img.onload = null;
          img.onerror = null;
        }
      });
    };
  }, []);

  // Set up GSAP ScrollTrigger and canvas rendering once loading completes
  useEffect(() => {
    if (loading || !canvasRef.current || !heroContainerRef.current) return;

    const canvas = canvasRef.current;
    
    // We add virtual padding frames at the beginning and end of the timeline
    // This gives the scrub inertia buffer space to compile completely before unpinning
    const startBuffer = 24;
    const endBuffer = 24;
    const playhead = { frame: -startBuffer };

    const renderFrame = (frameIndex: number) => {
      // Clamp virtual frame index to valid image frame range [0, 143]
      const clampedIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex));
      
      // Prevent redundant canvas redraws
      if (clampedIndex === lastRenderedFrame.current) return;
      
      const img = imageRefs.current[clampedIndex];
      if (img && img.complete) {
        drawFrameToCanvas(canvas, img, isMobile);
        lastRenderedFrame.current = clampedIndex;
      }
    };

    // Debounced resize handler to prevent layout thrashing
    let resizeTimeout: number;
    const resizeCanvas = () => {
      cancelAnimationFrame(resizeTimeout);
      resizeTimeout = requestAnimationFrame(() => {
        const frameIndex = Math.floor(playhead.frame);
        renderFrame(frameIndex);
      });
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create GSAP ScrollTrigger timeline (scrubs from exploded state -24 to assembled state 143+24)
    const tl = gsap.to(playhead, {
      frame: totalFrames - 1 + endBuffer,
      ease: 'none',
      scrollTrigger: {
        trigger: heroContainerRef.current,
        start: 'top top',
        end: isMobile ? '+=40%' : '+=130%',
        pin: !isMobile, // Strictly unpinned on mobile to prevent scroll-lock jank
        scrub: isMobile ? 0.3 : 1, // Fast responsive scrub on mobile
        onUpdate: () => {
          renderFrame(Math.floor(playhead.frame));
        }
      }
    });

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(resizeTimeout);
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [loading, isMobile, heroContainerRef]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square md:aspect-auto md:w-full md:h-full flex items-center justify-center select-none pointer-events-none"
    >
      <canvas 
        ref={canvasRef} 
        className="block w-full h-full pointer-events-none"
      />

      {/* Glassmorphic progress hud in the bottom corner */}
      {loading && (
        <div className="absolute bottom-6 right-6 flex items-center gap-3 px-4 py-2 border border-white/5 bg-carbon-black-2/60 rounded-xl backdrop-blur-md transition-opacity duration-500 pointer-events-none select-none">
          <div className="w-4 h-4 border-2 border-slate-violet/20 border-t-slate-violet-light rounded-full animate-spin" />
          <span className="text-[9px] font-mono tracking-wider text-alabaster-grey/80">
            HYDRATING 3D ASSETS: {loadProgress}%
          </span>
        </div>
      )}
    </div>
  );
}
