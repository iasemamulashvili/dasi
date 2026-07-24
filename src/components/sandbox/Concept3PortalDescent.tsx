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
  const eventHorizonRef = useRef<HTMLDivElement>(null);
  const siphonParticlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pinContainerRef.current || !logoMeshRef.current) return;

    const heroSection = containerRef.current;
    const pinContainer = pinContainerRef.current;
    const logoMesh = logoMeshRef.current;
    const eventHorizon = eventHorizonRef.current;
    const siphonParticles = siphonParticlesRef.current;

    // Subtle 3D Cursor Parallax Tilt (Strictly forward-facing, capped at 6deg max)
    const handleMouseMove = (e: MouseEvent) => {
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
            end: isDesktop ? '+=65%' : '+=50%',
            scrub: 0.3, // Responsive 1:1 scroll reaction
            anticipatePin: 1,
          },
        });

        // Variant 3: Gravitational Void Siphon
        // Forward-facing downward compression + event horizon seam suction
        tl.to(
          logoMesh,
          {
            rotateY: 0,
            rotateZ: 0,
            rotateX: isDesktop ? 25 : 18,
            scale: isDesktop ? 0.38 : 0.44, // Gravitational compression as base is siphoned
            y: isDesktop ? 560 : 360,
            opacity: 1.0,
            ease: 'power2.in',
          },
          0
        );

        if (eventHorizon) {
          tl.to(
            eventHorizon,
            {
              opacity: 1.0,
              scaleX: 1.2,
              ease: 'power1.inOut',
            },
            0
          );
        }

        if (siphonParticles) {
          tl.to(
            siphonParticles,
            {
              opacity: 0.7,
              y: 80,
              ease: 'power2.in',
            },
            0
          );
        }
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
      className="relative w-full min-h-screen bg-transparent select-none z-10 font-outfit"
    >
      <div
        ref={pinContainerRef}
        className="w-full min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Volumetric Dark Background Halo */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.20)_0%,rgba(226,232,240,0.05)_50%,transparent_75%)] filter blur-[110px] pointer-events-none z-0" />

        {/* Glass-Etched Horizon Event Seam at Section 2 Top Border */}
        <div
          ref={eventHorizonRef}
          className="absolute bottom-0 right-1/4 -translate-x-1/2 w-[450px] h-2 bg-gradient-to-r from-transparent via-slate-violet-light/70 to-transparent pointer-events-none z-0 opacity-0 filter drop-shadow-[0_0_15px_rgba(167,139,250,0.9)]"
        />

        {/* Vertical Particle Siphon Streaks */}
        <div
          ref={siphonParticlesRef}
          className="absolute bottom-4 right-1/4 -translate-x-1/2 w-48 h-32 pointer-events-none z-0 opacity-0 flex justify-around"
        >
          <div className="w-[1.5px] h-full bg-gradient-to-b from-transparent via-slate-violet-light/60 to-transparent animate-pulse" />
          <div className="w-[2px] h-full bg-gradient-to-b from-transparent via-bright-snow/70 to-transparent animate-pulse delay-100" />
          <div className="w-[1.5px] h-full bg-gradient-to-b from-transparent via-slate-violet-light/60 to-transparent animate-pulse delay-200" />
        </div>

        {/* Hero Content Grid - Copy stays 100% stationary */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Column Fixed Copy */}
          <div className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-slate-violet/40 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-slate-violet-light animate-pulse" />
              <span className="tracking-widest text-slate-violet-light uppercase">
                VARIANT 3: GRAVITATIONAL VOID SIPHON
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
              DASI GAMES
            </h1>

            <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
              Crafting unique gaming experiences
            </p>

            <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
              Alternate visual treatment. The forward-facing logo undergoes sleek gravitational compression as its narrow apex is siphoned into the event horizon seam.
            </p>

            <div className="pt-2">
              <button className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-wider">
                EXPLORE SHOWCASE
              </button>
            </div>
          </div>

          {/* Right Column: 3D Void Siphon Logo */}
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
                className="w-full h-full object-contain filter drop-shadow-[0_0_60px_rgba(167,139,250,0.7)] pointer-events-none select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
