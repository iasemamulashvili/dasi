'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Crosshair, Target } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Concept2GlassMonolithProps {
  section2Ref: React.RefObject<HTMLDivElement | null>;
}

export default function Concept2GlassMonolith({ section2Ref }: Concept2GlassMonolithProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);
  const logoMeshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pinContainerRef.current || !logoMeshRef.current || !outerRingRef.current || !innerRingRef.current) return;

    const heroSection = containerRef.current;
    const pinContainer = pinContainerRef.current;
    const logoMesh = logoMeshRef.current;
    const outerRing = outerRingRef.current;
    const innerRing = innerRingRef.current;

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
            end: isDesktop ? '+=160%' : '+=100%',
            scrub: 1.0,
            anticipatePin: 1,
          },
        });

        // Phase 1: Dual 3D Gimbal Ring Alignment
        tl.to(outerRing, { rotateZ: 180, rotateX: 45, scale: 1.15, opacity: 0.9, ease: 'none' }, 0);
        tl.to(innerRing, { rotateZ: -270, rotateY: -55, scale: 1.25, opacity: 0.9, ease: 'none' }, 0);
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 180 : 90,
            rotateX: isDesktop ? -35 : -15,
            z: isDesktop ? 80 : 30,
            scale: isDesktop ? 1.1 : 1.05,
            opacity: 1.0,
            ease: 'none',
          },
          0
        );

        // Phase 2: Cybernetic Target Lock Flip & Plunge BEHIND Section 2 Boundary
        tl.to(outerRing, { rotateZ: 360, rotateX: 75, scale: 1.3, opacity: 0.2, ease: 'none' }, 0.5);
        tl.to(innerRing, { rotateZ: -540, rotateY: -85, scale: 1.5, opacity: 0.2, ease: 'none' }, 0.5);
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 540 : 360,
            rotateX: isDesktop ? 90 : 60,
            rotateZ: 0,
            scale: isDesktop ? 0.25 : 0.35,
            z: isDesktop ? -800 : -400,
            y: isDesktop ? 650 : 380, // Plunges beneath Section 2 z-30 surface
            opacity: 1.0, // Retain full 1.0 opacity until hidden behind Section 2
            ease: 'none',
          },
          0.5
        );
      }
    );

    return () => {
      mm.revert();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [section2Ref]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[85vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent select-none pt-24 md:pt-0 z-10"
    >
      <div ref={pinContainerRef} className="w-full h-full flex items-center justify-center">
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Column */}
          <div className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-slate-violet/30 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-slate-violet-light animate-pulse" />
              <span className="tracking-widest text-slate-violet-light uppercase">
                VARIATION 2: CYBERNETIC GIMBAL MATRIX
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
              DASI GAMES
            </h1>

            <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
              Crafting unique gaming experiences
            </p>

            <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
              Precision 3D cybernetic gyroscope matrix. Outer and inner telemetry rings lock target coordinates on scroll, executing a 3D flip as the logo plunges behind Section 2.
            </p>

            <div className="pt-2">
              <button className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-wider">
                EXPLORE RELEASES
              </button>
            </div>
          </div>

          {/* Right Column: Cybernetic 3D Gimbal & Logo Mesh */}
          <div
            className="w-full md:w-[48%] flex items-center justify-center order-first md:order-last py-8 md:py-0 relative z-10"
            style={{ perspective: 1200 }}
          >
            {/* Outer Cybernetic Reticle Ring */}
            <div
              ref={outerRingRef}
              className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-slate-violet-light/30 border-dashed flex items-center justify-between p-4 pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute top-2 left-2 flex items-center gap-1 font-mono text-[8px] text-slate-violet-light">
                <Target size={10} />
                <span>SYS_ALIGN // 01</span>
              </div>
              <div className="absolute bottom-2 right-2 flex items-center gap-1 font-mono text-[8px] text-alabaster-grey/50">
                <Crosshair size={10} />
                <span>TARGET_LOCKED</span>
              </div>
            </div>

            {/* Inner Gyroscope Ring */}
            <div
              ref={innerRingRef}
              className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border-2 border-purple-400/25 border-dotted pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            />

            {/* Center Logo Mesh */}
            <div
              ref={logoMeshRef}
              className="relative z-20 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center p-8"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Image
                src="/Images/dasigames_logo.png"
                alt="Dasi Games Gimbal Logo"
                width={280}
                height={280}
                priority
                className="w-48 h-48 md:w-64 md:h-64 object-contain filter drop-shadow-[0_0_45px_rgba(168,85,247,0.7)] select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none opacity-60">
          <span className="text-[9px] tracking-widest text-alabaster-grey/70 font-silkscreen uppercase">
            SCROLL TO LOCK TARGET & PLUNGE BEHIND SECTION 2
          </span>
          <div className="w-[1.5px] h-8 bg-gradient-to-b from-slate-violet-light to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
