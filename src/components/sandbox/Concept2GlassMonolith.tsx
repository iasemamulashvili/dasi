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
 * Slightly reduced logo size (320px max).
 * Fast completion scroll trigger (ends within top+=450px on desktop / top+=220px on mobile).
 * On Mobile: Dissolves cleanly above "SCROLL TO EXPLORE" text without touching or overlapping it.
 * On Desktop: 3D Vortex pitch & twist funneling y: 520px behind Section 2 before Section 2 covers the view.
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

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: isMobile ? 'top+=220 top' : 'top+=450 top',
        scrub: 0.15,
      },
    });

    if (isMobile) {
      // Mobile: Dissolves cleanly above "SCROLL TO EXPLORE" text without touching or overlapping it
      tl.to(
        logoMesh,
        {
          rotateZ: -10,
          scaleY: 1.25,
          scaleX: 0.52,
          y: 75,
          opacity: 0,
          ease: 'power2.inOut',
        },
        0
      );
    } else {
      // Desktop: Fast 3D Vortex pitch & twist funneling deep behind Section 2 border
      tl.to(
        logoMesh,
        {
          rotateY: 0,
          rotateZ: -14,
          rotateX: 32,
          scaleY: 1.55,
          scaleX: 0.38,
          y: 520,
          opacity: 0,
          ease: 'power2.inOut',
        },
        0
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
      <div
        ref={logoMeshRef}
        className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-[320px] lg:h-[320px] flex items-center justify-center cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Image
          src="/Logo_White_PNG.png"
          alt="Dasi Games 3D Logo"
          width={360}
          height={360}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(167,139,250,0.30)] pointer-events-none select-none"
        />
      </div>
    </div>
  );
}
