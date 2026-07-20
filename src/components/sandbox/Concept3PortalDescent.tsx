'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, Radio } from 'lucide-react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Concept3PortalDescentProps {
  section2Ref: React.RefObject<HTMLDivElement | null>;
}

export default function Concept3PortalDescent({ section2Ref }: Concept3PortalDescentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const portalRingsRef = useRef<HTMLDivElement>(null);
  const coreGlowRef = useRef<HTMLDivElement>(null);
  const logoMeshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !pinContainerRef.current ||
      !logoMeshRef.current ||
      !portalRingsRef.current ||
      !coreGlowRef.current
    )
      return;

    const heroSection = containerRef.current;
    const pinContainer = pinContainerRef.current;
    const logoMesh = logoMeshRef.current;
    const portalRings = portalRingsRef.current;
    const coreGlow = coreGlowRef.current;

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
            pin: isDesktop ? pinContainer : false,
            start: 'top top',
            end: isDesktop ? '+=140%' : 'bottom top',
            scrub: 1.2,
            anticipatePin: 1,
          },
        });

        // Phase 1: Portal Energy Activation & 3D Logo Camera Surge
        tl.to(portalRings, { scale: isDesktop ? 1.4 : 1.2, opacity: 0.9, ease: 'power1.inOut' }, 0);
        tl.to(coreGlow, { scale: isDesktop ? 1.6 : 1.3, opacity: 0.6, ease: 'power1.inOut' }, 0);
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? -60 : -30,
            rotateX: isDesktop ? -20 : -10,
            z: isDesktop ? 140 : 60,
            scale: isDesktop ? 1.2 : 1.1,
            y: isDesktop ? -15 : -8,
            ease: 'power1.inOut',
          },
          0
        );

        // Phase 2: Quantum Vortex Corkscrew & Ring Dilation
        tl.to(portalRings, { scale: isDesktop ? 2.4 : 1.7, opacity: 0.5, rotateZ: 180, ease: 'power1.inOut' }, 0.35);
        tl.to(coreGlow, { scale: isDesktop ? 2.8 : 1.9, opacity: 0.3, ease: 'power1.inOut' }, 0.35);
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 270 : 180,
            rotateX: isDesktop ? 60 : 35,
            rotateZ: isDesktop ? -25 : -12,
            scale: isDesktop ? 0.65 : 0.75,
            z: isDesktop ? -250 : -120,
            y: isDesktop ? 160 : 90,
            ease: 'power1.inOut',
          },
          0.35
        );

        // Phase 3: Hyper-speed Warp Plunge BEHIND Section 2 Top Edge Seam
        tl.to(portalRings, { scale: isDesktop ? 3.5 : 2.2, opacity: 0, ease: 'power2.in' }, 0.7);
        tl.to(coreGlow, { scale: isDesktop ? 4.0 : 2.5, opacity: 0, ease: 'power2.in' }, 0.7);
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 540 : 360,
            rotateX: isDesktop ? 90 : 65,
            rotateZ: 0,
            scale: isDesktop ? 0.2 : 0.35,
            z: isDesktop ? -900 : -450,
            y: isDesktop ? 440 : 230, // Drives cleanly under Section 2 z-30 surface
            opacity: 0,
            ease: 'power2.in',
          },
          0.7
        );

        if (section2Ref && section2Ref.current) {
          tl.fromTo(
            section2Ref.current,
            { y: 100, opacity: 0.7 },
            { y: 0, opacity: 1, ease: 'power1.out' },
            0.5
          );
        }
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
          {/* Left Column Text */}
          <div className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-slate-violet/30 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <Sparkles size={12} className="text-slate-violet-light animate-spin" />
              <span className="tracking-widest text-slate-violet-light uppercase">
                VARIATION 3: QUANTUM ENERGY PORTAL WARP
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
              DASI GAMES
            </h1>

            <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
              Crafting unique gaming experiences
            </p>

            <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
              Multi-tier quantum energy portal. Dynamic 3D camera surge, corkscrew rotation, and a hyper-speed warp plunge through the portal center behind Section 2.
            </p>

            <div className="pt-2">
              <button className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-wider">
                EXPLORE RELEASES
              </button>
            </div>
          </div>

          {/* Right Column: Multi-Tier Quantum Energy Portal */}
          <div
            className="w-full md:w-[48%] flex items-center justify-center order-first md:order-last py-8 md:py-0 relative z-10"
            style={{ perspective: 1200 }}
          >
            {/* Core Volumetric Energy Blur Node */}
            <div
              ref={coreGlowRef}
              className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full bg-[radial-gradient(circle_at_center,oklch(0.68_0.26_305_/_0.35)_0%,oklch(0.45_0.22_280_/_0.15)_50%,transparent_100%)] filter blur-3xl pointer-events-none"
            />

            {/* 3-Tier Multi-Ring Energy Portal */}
            <div
              ref={portalRingsRef}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Outer Energy Ring */}
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full border-2 border-slate-violet-light/35 border-dashed animate-[spin_24s_linear_infinite]" />

              {/* Middle Gyroscope Counter-Ring */}
              <div className="absolute w-60 h-60 md:w-76 md:h-76 rounded-full border border-purple-300/30 border-dotted animate-[spin_14s_linear_infinite_reverse]" />

              {/* Inner Focus Telemetry Ring with Orbit Vents */}
              <div className="absolute w-44 h-44 md:w-56 md:h-56 rounded-full border border-slate-violet-light/40 flex items-center justify-center p-2 animate-[spin_30s_linear_infinite]">
                <div className="w-full h-full rounded-full border border-white/10 border-dashed" />
                <div className="absolute top-0 w-2 h-2 rounded-full bg-slate-violet-light shadow-[0_0_10px_#a855f7]" />
                <div className="absolute bottom-0 w-2 h-2 rounded-full bg-purple-300 shadow-[0_0_10px_#c084fc]" />
              </div>
            </div>

            {/* Center Logo Mesh Diving Through Quantum Portal */}
            <div
              ref={logoMeshRef}
              className="relative z-20 w-64 h-64 md:w-80 md:h-80 flex items-center justify-center p-8"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <Image
                src="/Images/dasigames_logo.png"
                alt="Dasi Games Quantum Portal Logo"
                width={300}
                height={300}
                priority
                className="w-52 h-52 md:w-68 md:h-68 object-contain filter drop-shadow-[0_0_55px_rgba(168,85,247,0.75)] select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none opacity-60">
          <span className="text-[9px] tracking-widest text-alabaster-grey/70 font-silkscreen uppercase">
            SCROLL TO WARP THROUGH QUANTUM PORTAL
          </span>
          <div className="w-[1.5px] h-8 bg-gradient-to-b from-slate-violet-light to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
