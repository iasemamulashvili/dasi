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
  const portalRingsRef = useRef<HTMLDivElement>(null);
  const logoMeshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !logoMeshRef.current || !portalRingsRef.current) return;

    const heroSection = containerRef.current;
    const logoMesh = logoMeshRef.current;
    const portalRings = portalRingsRef.current;

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

        // 1. Expand portal energy rings outward on scroll
        tl.to(portalRings, { scale: isDesktop ? 2.5 : 1.8, opacity: 0.3, ease: 'power2.out' }, 0);

        // 2. Drive logo down through the portal center into Section 2
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 360 : 180,
            rotateX: isDesktop ? 40 : 20,
            scale: isDesktop ? 0.3 : 0.45,
            z: isDesktop ? -600 : -300,
            y: isDesktop ? 260 : 140,
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
              VARIATION 3: VOLUMETRIC PORTAL DESCENT
            </span>
          </div>

          <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
            DASI GAMES
          </h1>

          <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
            Crafting unique gaming experiences
          </p>

          <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
            Concentric glowing 3D energy rings behind the logo. As user scrolls down, the portal rings expand outward while the logo drives through the center into Section 2.
          </p>

          <div className="pt-2">
            <button className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-wider">
              EXPLORE RELEASES
            </button>
          </div>
        </div>

        {/* Right Column: Volumetric Portal & Logo Mesh */}
        <div
          className="w-full md:w-[48%] flex items-center justify-center order-first md:order-last py-8 md:py-0 relative"
          style={{ perspective: 1000 }}
        >
          {/* Concentric Spinning Portal Energy Rings */}
          <div
            ref={portalRingsRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-72 h-72 md:w-96 md:h-96 rounded-full border-2 border-slate-violet-light/30 border-dashed animate-[spin_18s_linear_infinite]" />
            <div className="absolute w-56 h-56 md:w-72 md:h-72 rounded-full border border-purple-400/20 border-dotted animate-[spin_12s_linear_infinite_reverse]" />
            <div className="absolute w-40 h-40 md:w-52 md:h-52 rounded-full bg-slate-violet-light/10 filter blur-2xl animate-pulse" />
          </div>

          {/* Logo Mesh Diving Through Portal Center */}
          <div
            ref={logoMeshRef}
            className="relative z-20 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center p-8"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Image
              src="/Images/dasigames_logo.png"
              alt="Dasi Games Portal Logo"
              width={280}
              height={280}
              priority
              className="w-48 h-48 md:w-64 md:h-64 object-contain filter drop-shadow-[0_0_45px_rgba(168,85,247,0.7)] select-none pointer-events-none"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none opacity-60">
        <span className="text-[9px] tracking-widest text-alabaster-grey/70 font-silkscreen uppercase">
          SCROLL TO PASS THROUGH PORTAL
        </span>
        <div className="w-[1.5px] h-8 bg-gradient-to-b from-slate-violet-light to-transparent animate-pulse" />
      </div>
    </div>
  );
}
