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
  
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const totalFrames = 144;

  // Detect mobile viewports to adjust pinning and layouts
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Preload all WebP frames on mount
  useEffect(() => {
    let loadedCount = 0;
    const preloadedImages: HTMLImageElement[] = [];

    const handleImageLoad = () => {
      loadedCount++;
      setLoadProgress(Math.round((loadedCount / totalFrames) * 100));
      
      if (loadedCount === totalFrames) {
        imageRefs.current = preloadedImages;
        setLoading(false);
      }
    };

    const handleImageError = (e: any) => {
      console.error("Failed to load frame:", e);
      // Still increment to allow loader to bypass broken frames if any
      handleImageLoad();
    };

    for (let i = 0; i < totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/Images/logo-sequence/frame_${frameNum}.webp`;
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      preloadedImages.push(img);
    }
  }, []);

  // Set up GSAP ScrollTrigger and canvas rendering once loading completes
  useEffect(() => {
    if (loading || !canvasRef.current || !heroContainerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set high-DPI backing store size for sharp rendering
    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.scale(dpr, dpr);
      
      // Draw initial frame after resizing
      renderFrame(Math.floor(playhead.frame));
    };

    const renderFrame = (frameIndex: number) => {
      const img = imageRefs.current[frameIndex];
      if (!img || !img.complete) return;

      const dpr = window.devicePixelRatio || 1;
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;

      // Clear the canvas
      ctx.clearRect(0, 0, w, h);

      const imageWidth = img.width;
      const imageHeight = img.height;
      let drawWidth = w;
      let drawHeight = h;
      let offsetX = 0;
      let offsetY = 0;

      if (isMobile) {
        // Safe, contained fitting for mobile layout
        const marginScale = 0.85;
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
      } else {
        // Desktop: Full-viewport height scaling to push top/bottom clipping lines off-screen
        drawHeight = h * 1.08;
        drawWidth = drawHeight * (imageWidth / imageHeight);
        offsetX = (w - drawWidth) / 2;
        offsetY = (h - drawHeight) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };

    // Initialize playhead to final frame (assembled logo) for reverse scroll flow
    const playhead = { frame: totalFrames - 1 };
    
    // Initial size setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create GSAP ScrollTrigger timeline (scrubs backwards from totalFrames-1 to 0)
    const tl = gsap.to(playhead, {
      frame: 0,
      snap: 'frame',
      ease: 'none',
      scrollTrigger: {
        trigger: heroContainerRef.current,
        start: 'top top',
        end: isMobile ? 'bottom top' : '+=130%',
        pin: !isMobile,
        scrub: 1, // Momentum inertia scroll
        onUpdate: () => {
          renderFrame(Math.floor(playhead.frame));
        }
      }
    });

    // Animate canvas scale & opacity for a smooth transition out of view
    const canvasFade = gsap.fromTo(canvas,
      { scale: 1, opacity: 1 },
      {
        scale: 0.85,
        opacity: 0,
        ease: 'power1.inOut',
        scrollTrigger: {
          trigger: heroContainerRef.current,
          start: 'top top',
          end: isMobile ? 'bottom top' : '+=130%',
          scrub: 1
        }
      }
    );

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      if (canvasFade.scrollTrigger) canvasFade.scrollTrigger.kill();
      tl.kill();
      canvasFade.kill();
    };
  }, [loading, isMobile, heroContainerRef]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-square md:aspect-auto md:w-full md:h-full flex items-center justify-center select-none pointer-events-none"
    >
      {loading ? (
        // Premium glassmorphic loading HUD loader
        <div className="flex flex-col items-center justify-center gap-4 p-8 border border-white/5 bg-carbon-black-2/40 rounded-2xl backdrop-blur-md select-none pointer-events-none">
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Spinning tech circle outer ring */}
            <div className="absolute inset-0 border-2 border-slate-violet/20 rounded-full" />
            <div className="absolute inset-0 border-2 border-t-slate-violet-light rounded-full animate-spin" />
            <span className="text-[10px] font-mono text-bright-snow font-bold">
              {loadProgress}%
            </span>
          </div>
          <div className="text-[8px] font-silkscreen tracking-widest text-alabaster-grey/60 uppercase animate-pulse">
            Hydrating 3D Assets
          </div>
        </div>
      ) : (
        <canvas 
          ref={canvasRef} 
          className="block w-full h-full pointer-events-none"
        />
      )}
    </div>
  );
}
