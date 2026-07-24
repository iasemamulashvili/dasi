'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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
  const [isMobile, setIsMobile] = useState(false);

  const totalFrames = 144;
  const initialFrameIndex = 0;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const drawFrameToCanvas = (canvas: HTMLCanvasElement, img: HTMLImageElement, isMobileView: boolean) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
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

  // High-Performance Deferred Frame Preloader (LCP < 1.0s)
  useEffect(() => {
    let isMounted = true;
    const preloadedImages: HTMLImageElement[] = new Array(totalFrames);

    // 1. Load initial frame 0 immediately for instant LCP paint
    const initialImg = new Image();
    const initialFrameNum = String(initialFrameIndex).padStart(3, '0');
    initialImg.src = `/Images/logo-sequence/frame_${initialFrameNum}.webp`;

    initialImg.onload = () => {
      if (!isMounted) return;
      preloadedImages[initialFrameIndex] = initialImg;
      imageRefs.current = preloadedImages;

      const canvas = canvasRef.current;
      if (canvas) {
        drawFrameToCanvas(canvas, initialImg, window.innerWidth < 1024);
      }

      // Mark canvas ready immediately so LCP paint is unblocked
      setLoading(false);

      // 2. Defer background frame loading via idle callback to avoid network saturation
      const scheduleBackgroundLoad = () => {
        let index = 1;
        const loadBatch = () => {
          if (!isMounted || index >= totalFrames) return;
          const batchSize = 6;
          let batchRemaining = batchSize;

          for (let i = 0; i < batchSize && index < totalFrames; i++, index++) {
            const currentIdx = index;
            const img = new Image();
            const frameNum = String(currentIdx).padStart(3, '0');
            img.src = `/Images/logo-sequence/frame_${frameNum}.webp`;

            img.onload = () => {
              if (!isMounted) return;
              preloadedImages[currentIdx] = img;
              batchRemaining--;
              if (batchRemaining <= 0) {
                setTimeout(loadBatch, 16); // Non-blocking async loop
              }
            };

            img.onerror = () => {
              if (!isMounted) return;
              preloadedImages[currentIdx] = initialImg; // Fallback
              batchRemaining--;
              if (batchRemaining <= 0) {
                setTimeout(loadBatch, 16);
              }
            };
          }
        };

        if ('requestIdleCallback' in window) {
          (window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadBatch);
        } else {
          setTimeout(loadBatch, 100);
        }
      };

      scheduleBackgroundLoad();
    };

    initialImg.onerror = () => {
      if (!isMounted) return;
      console.error("Critical: Failed to load initial frame");
      setLoading(false);
    };

    return () => {
      isMounted = false;
    };
  }, []);

  // GSAP ScrollTrigger timeline setup
  useEffect(() => {
    if (loading || !canvasRef.current || !heroContainerRef.current) return;

    const canvas = canvasRef.current;
    const startBuffer = 24;
    const endBuffer = 24;
    const playhead = { frame: -startBuffer };

    const renderFrame = (frameIndex: number) => {
      const clampedIndex = Math.max(0, Math.min(totalFrames - 1, frameIndex));
      if (clampedIndex === lastRenderedFrame.current) return;
      
      const img = imageRefs.current[clampedIndex] || imageRefs.current[0];
      if (img && (img.complete || img.naturalWidth > 0)) {
        drawFrameToCanvas(canvas, img, isMobile);
        lastRenderedFrame.current = clampedIndex;
      }
    };

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

    const tl = gsap.to(playhead, {
      frame: totalFrames - 1 + endBuffer,
      ease: 'none',
      scrollTrigger: {
        trigger: heroContainerRef.current,
        start: 'top top',
        end: isMobile ? '+=40%' : '+=130%',
        pin: !isMobile,
        scrub: isMobile ? 0.3 : 1,
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
    </div>
  );
}
