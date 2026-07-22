'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Concept2GlassMonolithProps {
  section2Ref: React.RefObject<HTMLDivElement | null>;
}

export default function Concept2GlassMonolith({ section2Ref }: Concept2GlassMonolithProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const logoMeshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pinContainerRef.current || !logoMeshRef.current) return;

    const heroSection = containerRef.current;
    const pinContainer = pinContainerRef.current;
    const logoMesh = logoMeshRef.current;

    // Interactive 3D Cursor Parallax Tilt
    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroSection.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(logoMesh, {
        rotateY: x * 40,
        rotateX: -y * 40,
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

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            pin: pinContainer,
            start: 'top top',
            end: '+=130%',
            scrub: 0.5,
            anticipatePin: 1,
          },
        });

        // Phase 1 (0% - 50% scroll): Wide sweeping orbital corkscrew arc
        tl.to(
          logoMesh,
          {
            x: isDesktop ? 140 : 40,
            rotateY: isDesktop ? 360 : 180,
            rotateX: isDesktop ? 55 : 30,
            rotateZ: isDesktop ? -35 : -15,
            scale: isDesktop ? 1.25 : 1.10,
            z: isDesktop ? 120 : 45,
            y: isDesktop ? 90 : 45,
            opacity: 1.0,
            ease: 'power1.inOut',
          },
          0
        );

        // Phase 2 (50% - 100% scroll): Curves down towards bottom center, diving physically BEHIND Section 2's z-30 top border
        tl.to(
          logoMesh,
          {
            x: 0,
            rotateY: isDesktop ? 540 : 360,
            rotateX: isDesktop ? 80 : 60,
            rotateZ: isDesktop ? 45 : 20,
            scale: isDesktop ? 0.28 : 0.40,
            z: isDesktop ? -600 : -350,
            y: isDesktop ? 580 : 380, // Plunges physically behind Section 2's z-30 top border
            opacity: 1.0, // Retain full 1.0 opacity so it hides cleanly behind Section 2
            ease: 'power2.in',
          },
          0.5
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
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(82,122,105,0.25)_0%,rgba(226,232,240,0.06)_50%,transparent_75%)] filter blur-[120px] pointer-events-none z-0" />

        {/* Hero Content Grid */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Column Fixed Copy */}
          <div className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-muted-green/40 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-muted-green animate-pulse" />
              <span className="tracking-widest text-muted-green uppercase">
                VARIATION 2: ORBITAL CORKSCREW DESCENT
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
              DASI GAMES
            </h1>

            <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
              Crafting unique gaming experiences
            </p>

            <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
              Title stays completely stationary. The 3D logo sweeps in an orbital corkscrew arc before diving physically behind Section 2's top border.
            </p>

            <div className="pt-2">
              <button className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-wider">
                EXPLORE SHOWCASE
              </button>
            </div>
          </div>

          {/* Right Column: 3D Orbital Corkscrew Logo */}
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
                className="w-full h-full object-contain filter drop-shadow-[0_0_55px_rgba(82,122,105,0.85)] pointer-events-none select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
