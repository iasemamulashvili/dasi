'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
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
 * VARIANT 2: FLUID FUNNEL & VORTEX TWIST (Instant 3D Funnel Twist)
 * Uses official Dasi Logo (/Logo_White_PNG.png).
 * Starts movement instantly on scroll, combining vertical stretch (scaleY: 1.65) with 3D Z-rotation twist (-14deg)
 * and deep y: 950px plunge behind Section 2.
 */
export default function Concept2GlassMonolith({
  heroContainerRef,
  section2Ref,
}: Concept2GlassMonolithProps) {
  const logoMeshRef = useRef<HTMLDivElement>(null);
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

    gsap.set(logoMesh, { transformOrigin: '50% 90%' });

    // Instant, Unpinned ScrollTrigger
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.15,
      },
    });

    // 3D Vortex Funnel Pitch + Deep Plunge
    tl.to(
      logoMesh,
      {
        rotateY: 0,
        rotateZ: isMobile ? -8 : -14,   // Vortex twist angle
        rotateX: isMobile ? 22 : 36,   // 3D Pitch
        scaleY: isMobile ? 1.45 : 1.65, // Vertical elongation
        scaleX: isMobile ? 0.44 : 0.38, // Narrow funnel taper
        y: isMobile ? 650 : 950,        // Deep descent to completely clear Section 2 border
        opacity: 0,                     // Clean fade behind Section 2 (z-30)
        ease: 'power2.inOut',
      },
      0
    );

    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [heroContainerRef, isMobile, section2Ref]);

  return (
    <div className="w-full h-full flex items-center justify-center relative perspective-[1200px] pointer-events-auto select-none">
      <div
        ref={logoMeshRef}
        className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-80 md:h-80 lg:w-[380px] lg:h-[380px] flex items-center justify-center cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Image
          src="/Logo_White_PNG.png"
          alt="Dasi Games 3D Logo"
          width={400}
          height={400}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(167,139,250,0.30)] pointer-events-none select-none"
        />
      </div>
    </div>
  );
}
