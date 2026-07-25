'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Concept1PureFramelessProps {
  heroContainerRef: React.RefObject<HTMLDivElement | null>;
  section2Ref: React.RefObject<HTMLDivElement | null>;
}

/**
 * VARIANT 1: ELASTIC LIQUID WARP & PLUNGE (Liquid Rubber Physics)
 * Demonstrates extreme elastic vertical stretch (scaleY: 2.10) with horizontal width pinching (scaleX: 0.30),
 * making the logo feel like a viscous fluid drop being sucked beneath Section 2.
 */
export default function Concept1PureFrameless({
  heroContainerRef,
  section2Ref,
}: Concept1PureFramelessProps) {
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

    // 3D Cursor Parallax Tilt (Desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(logoMesh, {
        rotateY: x * 6,
        rotateX: -y * 6,
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

    // Anchor transformOrigin to bottom center for liquid stretch
    gsap.set(logoMesh, { transformOrigin: '50% 100%' });

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

    // Extreme liquid rubber stretch on scroll
    tl.to(
      logoMesh,
      {
        rotateY: 0,
        rotateZ: 0,
        rotateX: isMobile ? 15 : 24,
        scaleY: isMobile ? 1.65 : 2.10, // Extreme liquid vertical elongation
        scaleX: isMobile ? 0.42 : 0.30, // Ultra-narrow width pinch
        y: isMobile ? 260 : 540,        // Plunges beneath Section 2 (z-30)
        opacity: 0.95,
        ease: 'power2.in',
      },
      0.30
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
          alt="Dasi Games 3D Liquid Logo"
          width={400}
          height={400}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(167,139,250,0.30)] pointer-events-none select-none"
        />
      </div>
    </div>
  );
}
