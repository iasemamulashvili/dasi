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
  const leftContentRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoMeshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pinContainerRef.current || !logoMeshRef.current || !logoWrapperRef.current || !leftContentRef.current) return;

    const heroSection = containerRef.current;
    const pinContainer = pinContainerRef.current;
    const leftContent = leftContentRef.current;
    const logoMesh = logoMeshRef.current;

    // Interactive 3D Cursor Parallax Tilt (strictly on the 3D logo mesh)
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
            end: isDesktop ? '+=180%' : '+=120%',
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        // Ensure left content (Title & Headlines) stays 100% stationary and pinned
        tl.to(
          leftContent,
          {
            y: 0,
            opacity: 1.0,
            ease: 'none',
          },
          0
        );

        // Phase 1 (0% - 60% scroll): Rapid dual-axis continuous corkscrew twist with scale surge
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 270 : 135,
            rotateX: isDesktop ? 45 : 30,
            rotateZ: isDesktop ? 25 : 12,
            scale: isDesktop ? 1.30 : 1.12,
            z: isDesktop ? 120 : 45,
            y: isDesktop ? 120 : 70,
            opacity: 1.0,
            ease: 'power1.inOut',
          },
          0
        );

        // Phase 2 (60% - 100% scroll): Quantum Gimbal Twist plunging deep into negative Z depth behind Section 2
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 480 : 290,
            rotateX: isDesktop ? 80 : 60,
            rotateZ: isDesktop ? 35 : 18,
            scale: isDesktop ? 0.22 : 0.38,
            z: isDesktop ? -900 : -450,
            y: isDesktop ? 780 : 450, // Plunges fully behind Section 2's top edge boundary
            opacity: 1.0, // Retain full 1.0 opacity throughout descent
            ease: 'power2.in',
          },
          0.6
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
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent select-none pt-24 md:pt-0 z-10"
    >
      <div ref={pinContainerRef} className="w-full h-full min-h-screen flex items-center justify-center relative">
        {/* Volumetric Cyan Cyber Spotlight Glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[650px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.25)_0%,rgba(14,165,233,0.08)_50%,transparent_75%)] filter blur-[120px] pointer-events-none z-0" />

        {/* Hero Content Grid */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Column Fixed Copy - Completely stationary & independent of logo movement */}
          <div ref={leftContentRef} className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-cyan-500/30 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="tracking-widest text-cyan-300 uppercase">
                VARIATION 2: QUANTUM GIMBAL TWIST
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
              DASI GAMES
            </h1>

            <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
              Crafting unique gaming experiences
            </p>

            <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
              Title stays completely stationary while the 3D logo executes a dual-axis corkscrew twist, diving deep behind Section 2.
            </p>

            <div className="pt-2">
              <button className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-wider">
                EXPLORE SHOWCASE
              </button>
            </div>
          </div>

          {/* Right Column: 3D Quantum Gimbal Twist Logo */}
          <div
            ref={logoWrapperRef}
            className="flex-1 flex items-center justify-center relative w-full h-[350px] md:h-[500px] perspective-[1200px]"
          >
            <div
              ref={logoMeshRef}
              className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center cursor-pointer transition-shadow duration-300"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Image
                src="/Logo_White_PNG.png"
                alt="Dasi Games 3D Logo"
                width={400}
                height={400}
                priority
                className="w-full h-full object-contain filter drop-shadow-[0_0_55px_rgba(6,182,212,0.85)] pointer-events-none select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
