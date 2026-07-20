'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Concept3ScrollDescentProps {
  section2Ref: React.RefObject<HTMLDivElement | null>;
}

export default function Concept3ScrollDescent({ section2Ref }: Concept3ScrollDescentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoMeshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !logoMeshRef.current || !logoWrapperRef.current) return;

    const heroSection = containerRef.current;
    const logoMesh = logoMeshRef.current;
    const logoWrapper = logoWrapperRef.current;

    // Responsive ScrollTrigger 3D Descent Timeline
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };

        // 1. Logo 3D Rotation & Z-Depth Descent Timeline
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: isDesktop ? '+=120%' : 'bottom top',
            pin: isDesktop,
            scrub: 1.2, // Momentum inertia scroll
            anticipatePin: 1,
          },
        });

        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 360 : 180,
            rotateX: isDesktop ? 25 : 15,
            scale: isDesktop ? 0.45 : 0.6,
            z: isDesktop ? -400 : -200,
            y: isDesktop ? 220 : 120,
            opacity: 0,
            ease: 'power2.inOut',
          },
          0
        );

        // 2. Open up the seam to Section 2
        if (section2Ref && section2Ref.current) {
          tl.fromTo(
            section2Ref.current,
            {
              y: 80,
              opacity: 0.8,
            },
            {
              y: 0,
              opacity: 1,
              ease: 'power1.out',
            },
            0.4
          );
        }
      }
    );

    return () => {
      mm.revert(); // Reverts GSAP matchMedia & kills all created ScrollTriggers cleanly
    };
  }, [section2Ref]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[85vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent select-none pt-24 md:pt-0"
    >
      {/* Hero Content Container */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Column Text Content */}
        <div className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-2xl">
          {/* Cyberpunk Status Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-slate-violet/30 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span className="w-2 h-2 rounded-full bg-slate-violet-light animate-pulse" />
            <span className="tracking-widest text-slate-violet-light uppercase">
              CONCEPT 3: 3D DESCENT ANCHOR
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
            DASI GAMES
          </h1>

          <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
            Crafting unique gaming experiences
          </p>

          <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
            Dasi Games bridges art, logic, and high performance to build addictive mobile, hybrid arcade RPG, and tycoon titles. Scroll down to experience the seamless 3D section transition.
          </p>

          {/* CTA Button */}
          <div className="pt-2">
            <button className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-wider">
              EXPLORE RELEASES
            </button>
          </div>
        </div>

        {/* Right Column: 3D Anchor Logo Mesh (Right on desktop, centered top on mobile) */}
        <div
          ref={logoWrapperRef}
          className="w-full md:w-[48%] flex items-center justify-center order-first md:order-last py-8 md:py-0"
          style={{ perspective: 1000 }}
        >
          <div
            ref={logoMeshRef}
            className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center rounded-3xl bg-carbon-black-2/40 border border-white/10 backdrop-blur-xl p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.1)]"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Outer Spinning Holographic Accent Ring */}
            <div className="absolute inset-4 rounded-full border border-slate-violet/30 border-dashed animate-[spin_20s_linear_infinite] pointer-events-none" />

            <Image
              src="/Images/dasigames_logo.png"
              alt="Dasi Games 3D Anchor Logo"
              width={240}
              height={240}
              priority
              className="w-44 h-44 md:w-56 md:h-56 object-contain filter drop-shadow-[0_0_35px_rgba(168,85,247,0.5)] select-none pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none opacity-60">
        <span className="text-[9px] tracking-widest text-alabaster-grey/70 font-silkscreen uppercase">
          SCROLL TO UNLOCK SECTION 2
        </span>
        <div className="w-[1.5px] h-8 bg-gradient-to-b from-slate-violet-light to-transparent animate-pulse" />
      </div>
    </div>
  );
}
