'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Concept3PortalDescentProps {
  heroContainerRef: React.RefObject<HTMLDivElement | null>;
  section2Ref: React.RefObject<HTMLDivElement | null>;
}

/**
 * VARIANT 3: PARTICLE SIPHON DEPTH FLATTEN (Particle Dissolve Siphon)
 * Demonstrates 3D depth flattening (rotateX: 45deg) paired with kinetic vertical particle siphon streams
 * that channel energy down into Section 2 as the logo slips beneath.
 */
export default function Concept3PortalDescent({
  heroContainerRef,
  section2Ref,
}: Concept3PortalDescentProps) {
  const logoMeshRef = useRef<HTMLDivElement>(null);
  const particleSiphonRef = useRef<HTMLDivElement>(null);
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
    const particleSiphon = particleSiphonRef.current;

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

    gsap.set(logoMesh, { transformOrigin: '50% 100%' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: isMobile ? '+=60%' : '+=130%',
        pin: !isMobile,
        scrub: isMobile ? 0.25 : 1,
        anticipatePin: 1,
      },
    });

    // 3D Depth Flattening (rotateX 45deg, scaleY 0.85, scaleX 0.40)
    tl.to(
      logoMesh,
      {
        rotateY: 0,
        rotateZ: 0,
        rotateX: isMobile ? 30 : 45,   // Deep 3D flattening pitch
        scaleY: isMobile ? 0.90 : 0.85, // Flattened sheet height
        scaleX: isMobile ? 0.50 : 0.40, // Compressed width
        y: isMobile ? 260 : 540,        // Slips beneath Section 2 (z-30)
        opacity: 0.95,
        ease: 'power3.in',
      },
      0.25
    );

    if (particleSiphon) {
      tl.to(
        particleSiphon,
        {
          opacity: 1.0,
          scaleY: 1.8,
          y: 120,
          ease: 'power2.in',
        },
        0.35
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
      {/* Vertical Particle Siphon Streaks */}
      <div
        ref={particleSiphonRef}
        className="absolute bottom-2 left-1/2 -translate-x-1/2 w-44 h-36 pointer-events-none z-0 opacity-0 flex justify-around items-end"
      >
        <div className="w-[1.5px] h-full bg-gradient-to-b from-transparent via-slate-violet-light/80 to-transparent animate-pulse" />
        <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-bright-snow/90 to-transparent animate-pulse delay-100" />
        <div className="w-[1.5px] h-full bg-gradient-to-b from-transparent via-slate-violet-light/80 to-transparent animate-pulse delay-200" />
        <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-bright-snow/90 to-transparent animate-pulse delay-300" />
      </div>

      <div
        ref={logoMeshRef}
        className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-80 md:h-80 lg:w-[380px] lg:h-[380px] flex items-center justify-center cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Image
          src="/Logo_White_PNG.png"
          alt="Dasi Games 3D Siphon Logo"
          width={400}
          height={400}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(167,139,250,0.30)] pointer-events-none select-none"
        />
      </div>
    </div>
  );
}
