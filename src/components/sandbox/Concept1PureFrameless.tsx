'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Concept1PureFramelessProps {
  section2Ref: React.RefObject<HTMLDivElement | null>;
}

export default function Concept1PureFrameless({ section2Ref }: Concept1PureFramelessProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const logoMeshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pinContainerRef.current || !logoMeshRef.current) return;

    const heroSection = containerRef.current;
    const logoMesh = logoMeshRef.current;

    // Interactive 3D Cursor Parallax Tilt (strictly on the 3D logo mesh)
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

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.5,
          },
        });

        // Phase 1 (0% - 55% scroll): Cyber-Gimbal Surge forward into camera space
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 180 : 90,
            rotateX: isDesktop ? 45 : 25,
            rotateZ: isDesktop ? 15 : 5,
            z: isDesktop ? 160 : 60,
            scale: isDesktop ? 1.20 : 1.08,
            y: isDesktop ? 160 : 90,
            opacity: 1.0,
            ease: 'power1.inOut',
          },
          0
        );

        // Phase 2 (55% - 100% scroll): Steep angular pitch plunge diving completely behind Section 2
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 310 : 200,
            rotateX: isDesktop ? 75 : 55,
            rotateZ: isDesktop ? -20 : -10,
            scale: isDesktop ? 0.30 : 0.40,
            z: isDesktop ? -650 : -300,
            y: isDesktop ? 780 : 450, // Plunges fully behind Section 2's top edge boundary
            opacity: 1.0, // Retain full 1.0 opacity throughout descent
            ease: 'power2.in',
          },
          0.55
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
      className="relative w-full h-[220vh] bg-transparent select-none z-10"
    >
      {/* Sticky Pin Container: Keeps Title & Left Content 100% STATIONARY while logo moves */}
      <div
        ref={pinContainerRef}
        className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Volumetric Slate-Violet & Platinum Silver Spotlight Glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.22)_0%,rgba(226,232,240,0.06)_50%,transparent_75%)] filter blur-[120px] pointer-events-none z-0" />

        {/* Hero Content Grid */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Column Fixed Copy - Completely stationary in viewport space */}
          <div className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-slate-violet/30 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-slate-violet-light animate-pulse" />
              <span className="tracking-widest text-slate-violet-light uppercase">
                VARIATION 1: CYBER-GIMBAL SURGE
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
              DASI GAMES
            </h1>

            <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
              Crafting unique gaming experiences
            </p>

            <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
              Title stays completely stationary. The 3D logo executes an independent multi-axis gimbal surge before plunging behind Section 2.
            </p>

            <div className="pt-2">
              <button className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-wider">
                EXPLORE SHOWCASE
              </button>
            </div>
          </div>

          {/* Right Column: 3D Gimbal Surge Logo */}
          <div className="flex-1 flex items-center justify-center relative w-full h-[350px] md:h-[500px] perspective-[1200px]">
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
                className="w-full h-full object-contain filter drop-shadow-[0_0_50px_rgba(168,85,247,0.85)] pointer-events-none select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
