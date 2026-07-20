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
  const monolithTopRef = useRef<HTMLDivElement>(null);
  const monolithBottomRef = useRef<HTMLDivElement>(null);
  const logoMeshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !logoMeshRef.current || !monolithTopRef.current || !monolithBottomRef.current) return;

    const heroSection = containerRef.current;
    const logoMesh = logoMeshRef.current;
    const topPanel = monolithTopRef.current;
    const bottomPanel = monolithBottomRef.current;

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
            end: isDesktop ? '+=120%' : 'bottom top',
            pin: isDesktop,
            scrub: 1.2,
            anticipatePin: 1,
          },
        });

        // 1. Split top and bottom glass monolith panels apart on scroll
        tl.to(topPanel, { y: isDesktop ? -120 : -60, opacity: 0.2, ease: 'power2.inOut' }, 0);
        tl.to(bottomPanel, { y: isDesktop ? 120 : 60, opacity: 0.2, ease: 'power2.inOut' }, 0);

        // 2. Drive logo down through the opened seam into Section 2
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 360 : 180,
            rotateX: isDesktop ? 30 : 15,
            scale: isDesktop ? 0.4 : 0.55,
            z: isDesktop ? -450 : -200,
            y: isDesktop ? 240 : 130,
            opacity: 0,
            ease: 'power2.inOut',
          },
          0
        );

        if (section2Ref && section2Ref.current) {
          tl.fromTo(
            section2Ref.current,
            { y: 80, opacity: 0.8 },
            { y: 0, opacity: 1, ease: 'power1.out' },
            0.4
          );
        }
      }
    );

    return () => {
      mm.revert();
    };
  }, [section2Ref]);

  return (
    <div
      ref={containerRef}
      className="relative min-h-[85vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent select-none pt-24 md:pt-0"
    >
      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Column */}
        <div className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-slate-violet/30 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <span className="w-2 h-2 rounded-full bg-slate-violet-light animate-pulse" />
            <span className="tracking-widest text-slate-violet-light uppercase">
              VARIATION 2: CYBER GLASS MONOLITH SPLIT
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
            DASI GAMES
          </h1>

          <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
            Crafting unique gaming experiences
          </p>

          <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
            Ultra-sleek glassmorphic HUD panel with corner reticles. On scroll, the glass monolith splits open horizontally as the logo dives into the seam.
          </p>

          <div className="pt-2">
            <button className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-wider">
              EXPLORE RELEASES
            </button>
          </div>
        </div>

        {/* Right Column: Split Glass Monolith Frame */}
        <div
          className="w-full md:w-[48%] flex items-center justify-center order-first md:order-last py-8 md:py-0 relative"
          style={{ perspective: 1000 }}
        >
          {/* Top Glass Half Panel */}
          <div
            ref={monolithTopRef}
            className="absolute top-0 left-1/2 -translate-x-1/2 w-72 h-36 md:w-96 md:h-44 bg-carbon-black-2/60 border-t border-x border-white/15 rounded-t-3xl backdrop-blur-xl pointer-events-none z-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)] flex items-start justify-between p-4"
          >
            <span className="text-[9px] font-mono text-slate-violet-light">HUD_FRAME_TOP // 01</span>
            <span className="w-2 h-2 border-t-2 border-r-2 border-slate-violet-light" />
          </div>

          {/* Center Logo Mesh Plunging Through Seam */}
          <div
            ref={logoMeshRef}
            className="relative z-20 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center p-8"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Image
              src="/Images/dasigames_logo.png"
              alt="Dasi Games Monolith Logo"
              width={260}
              height={260}
              priority
              className="w-48 h-48 md:w-64 md:h-64 object-contain filter drop-shadow-[0_0_40px_rgba(168,85,247,0.6)] select-none pointer-events-none"
            />
          </div>

          {/* Bottom Glass Half Panel */}
          <div
            ref={monolithBottomRef}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-72 h-36 md:w-96 md:h-44 bg-carbon-black-2/60 border-b border-x border-white/15 rounded-b-3xl backdrop-blur-xl pointer-events-none z-10 shadow-[inset_0_-1px_0_rgba(255,255,255,0.15)] flex items-end justify-between p-4"
          >
            <span className="w-2 h-2 border-b-2 border-l-2 border-slate-violet-light" />
            <span className="text-[9px] font-mono text-alabaster-grey/60">SYS_SEAM // SPLIT_READY</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none opacity-60">
        <span className="text-[9px] tracking-widest text-alabaster-grey/70 font-silkscreen uppercase">
          SCROLL TO SPLIT MONOLITH SEAM
        </span>
        <div className="w-[1.5px] h-8 bg-gradient-to-b from-slate-violet-light to-transparent animate-pulse" />
      </div>
    </div>
  );
}
