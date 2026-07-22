'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Concept3PortalDescentProps {
  section2Ref: React.RefObject<HTMLDivElement | null>;
}

export default function Concept3PortalDescent({ section2Ref }: Concept3PortalDescentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const logoMeshRef = useRef<HTMLDivElement>(null);
  const portalRingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pinContainerRef.current || !logoMeshRef.current || !portalRingsRef.current) return;

    const heroSection = containerRef.current;
    const pinContainer = pinContainerRef.current;
    const logoMesh = logoMeshRef.current;
    const portalRings = portalRingsRef.current;

    // Interactive 3D Cursor Parallax Tilt
    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(logoMesh, {
        rotateY: x * 35,
        rotateX: -y * 35,
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

    // Responsive GSAP ScrollTrigger Timeline
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };

        // Shorter scroll distance (+=60%) with immediate responsive portal suction
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            pin: pinContainer,
            start: 'top top',
            end: isDesktop ? '+=65%' : '+=50%',
            scrub: 0.3, // Ultra-responsive immediate scroll reaction
            anticipatePin: 1,
          },
        });

        // Vortex Portal Suction: Begins IMMEDIATELY at scroll 0
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 180 : 90,
            rotateX: isDesktop ? 55 : 30,
            rotateZ: isDesktop ? 180 : 90,
            scale: isDesktop ? 0.08 : 0.20, // Gravitational compression as it gets sucked in
            z: isDesktop ? -750 : -350,
            y: isDesktop ? 560 : 360, // Sucked directly into Section 2 z-30 top border
            opacity: 1.0, // Retain full 1.0 opacity
            ease: 'power2.in',
          },
          0
        );

        tl.to(
          portalRings,
          {
            scale: isDesktop ? 1.2 : 1.1,
            opacity: 0.9,
            ease: 'power1.inOut',
          },
          0
        );
      }
    );

    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [section2Ref]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen bg-transparent select-none z-10"
    >
      <div
        ref={pinContainerRef}
        className="w-full min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Volumetric Muted Green & Platinum Silver Spotlight Glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(82,122,105,0.30)_0%,rgba(226,232,240,0.08)_50%,transparent_75%)] filter blur-[120px] pointer-events-none z-0" />

        {/* Concentric Energy Portal Singularity Rings at Section 2 Top Border */}
        <div
          ref={portalRingsRef}
          className="absolute bottom-16 right-1/4 -translate-x-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full border border-muted-green/50 pointer-events-none z-0 opacity-0 flex items-center justify-center"
        >
          <div className="w-3/4 h-3/4 rounded-full border border-muted-green/60 animate-ping opacity-30" />
          <div className="w-1/2 h-1/2 rounded-full border border-bright-snow/70 shadow-[0_0_35px_rgba(82,122,105,0.9)]" />
        </div>

        {/* Hero Content Grid */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Column Fixed Copy */}
          <div className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-muted-green/40 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-muted-green animate-pulse" />
              <span className="tracking-widest text-muted-green uppercase">
                VARIATION 3: VORTEX PORTAL SUCTION
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
              DASI GAMES
            </h1>

            <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
              Crafting unique gaming experiences
            </p>

            <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
              Title stays completely stationary. The 3D logo responds immediately on scroll, getting sucked into the Section 2 portal singularity.
            </p>

            <div className="pt-2">
              <button className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-wider">
                EXPLORE SHOWCASE
              </button>
            </div>
          </div>

          {/* Right Column: 3D Vortex Portal Suction Logo */}
          <div className="flex-1 flex items-center justify-center relative w-full h-[350px] md:h-[500px] perspective-[1200px] z-10">
            <div
              ref={logoMeshRef}
              className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Image
                src="/Logo_White_PNG.png"
                alt="Dasi Games 3D Logo"
                width={400}
                height={400}
                priority
                className="w-full h-full object-contain filter drop-shadow-[0_0_60px_rgba(82,122,105,0.9)] pointer-events-none select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
