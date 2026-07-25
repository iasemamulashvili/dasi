'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Concept2GlassMonolithProps {
  heroContainerRef: React.RefObject<HTMLDivElement | null>;
  section2Ref: React.RefObject<HTMLDivElement | null>;
}

/**
 * VARIANT 2: SAWBLADE VORTEX SCRUB (Interactive Cyber Saw)
 * Demonstrates 720-degree scrub rotation in sync with scroll, contracting into a dense spinning reticle
 * core and igniting a floor seam flare line as it dives beneath Section 2.
 */
export default function Concept2GlassMonolith({
  heroContainerRef,
  section2Ref,
}: Concept2GlassMonolithProps) {
  const logoMeshRef = useRef<HTMLDivElement>(null);
  const floorSeamRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!heroContainerRef.current || !logoMeshRef.current) return;

    const heroSection = heroContainerRef.current;
    const logoMesh = logoMeshRef.current;
    const floorSeam = floorSeamRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(logoMesh, {
        rotateY: x * 8,
        rotateX: -y * 8,
        duration: 0.6,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(logoMesh, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    };

    heroSection.addEventListener('mousemove', handleMouseMove);
    heroSection.addEventListener('mouseleave', handleMouseLeave);

    gsap.set(logoMesh, { transformOrigin: '50% 50%' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: isMobile ? '+=60%' : '+=130%',
        pin: !isMobile,
        scrub: isMobile ? 0.3 : 1,
        anticipatePin: 1,
      },
    });

    // 720° Sawblade Rotation + Dense Core Compression + Plunge
    tl.to(
      logoMesh,
      {
        rotation: isMobile ? 360 : 720,  // 720deg scrub rotation
        scale: isMobile ? 0.45 : 0.35,    // Contracts to dense spinning core
        y: isMobile ? 260 : 540,          // Dives beneath Section 2 (z-30)
        opacity: 0.95,
        ease: 'power1.inOut',
      },
      0.20
    );

    if (floorSeam) {
      tl.to(
        floorSeam,
        {
          opacity: 1.0,
          scaleX: 1.5,
          ease: 'power2.in',
        },
        0.50
      );
    }

    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [heroContainerRef, isMobile, section2Ref]);

  return (
    <div className="w-full h-full flex items-center justify-center relative perspective-[1200px] pointer-events-auto select-none">
      {/* Floor Seam Glow Line at Section 2 Interface */}
      <div
        ref={floorSeamRef}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 md:w-96 h-1.5 bg-gradient-to-r from-transparent via-bright-snow to-transparent opacity-0 filter drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] pointer-events-none z-0"
      />

      <div
        ref={logoMeshRef}
        className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-80 md:h-80 lg:w-[360px] lg:h-[360px] flex items-center justify-center cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Custom High-Contrast Sawblade SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full text-bright-snow filter drop-shadow-[0_0_35px_rgba(255,255,255,0.6)]"
        >
          <circle cx="50" cy="50" r="6" fill="currentColor" />
          <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="16 10" className="opacity-80" />
          <circle cx="50" cy="34" r="3" fill="currentColor" />
          <circle cx="50" cy="66" r="3" fill="currentColor" />
          <circle cx="34" cy="50" r="3" fill="currentColor" />
          <circle cx="66" cy="50" r="3" fill="currentColor" />
          <path
            d="M50 20 L53 30 L63 23 L61 34 L73 31 L67 40 L78 42 L69 49 L77 54 L67 57 L73 66 L61 64 L63 75 L53 68 L50 78 L47 68 L37 75 L39 64 L27 66 L33 57 L23 54 L31 49 L22 42 L33 40 L27 31 L39 34 L37 23 L47 30 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
          />
        </svg>
      </div>
    </div>
  );
}
