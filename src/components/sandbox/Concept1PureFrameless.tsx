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
  const logoWrapperRef = useRef<HTMLDivElement>(null);
  const logoMeshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !pinContainerRef.current || !logoMeshRef.current || !logoWrapperRef.current) return;

    const heroSection = containerRef.current;
    const pinContainer = pinContainerRef.current;
    const logoMesh = logoMeshRef.current;

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

    // Responsive GSAP ScrollTrigger Descent Timeline
    const mm = gsap.matchMedia();

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isMobile: '(max-width: 1023px)',
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };

        // Scroll-lock pins the hero container while initial scroll exclusively translates the logo
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            pin: pinContainer,
            start: 'top top',
            end: isDesktop ? '+=160%' : '+=100%',
            scrub: 1.0, // Tight responsive scrub
            anticipatePin: 1,
          },
        });

        // 3D Motion Timeline maintaining full 1.0 opacity until hidden behind Section 2
        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 180 : 90,
            rotateX: isDesktop ? 35 : 20,
            z: isDesktop ? 80 : 30,
            scale: isDesktop ? 1.05 : 1.0,
            y: isDesktop ? 180 : 100,
            opacity: 1.0, // Retain full opacity
            ease: 'none',
          },
          0
        );

        tl.to(
          logoMesh,
          {
            rotateY: isDesktop ? 360 : 180,
            rotateX: isDesktop ? 70 : 45,
            scale: isDesktop ? 0.35 : 0.45,
            z: isDesktop ? -500 : -250,
            y: isDesktop ? 650 : 380, // Plunges completely behind Section 2 z-30 boundary before lock release
            opacity: 1.0, // Retain full 1.0 opacity throughout descent
            ease: 'none',
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
      className="relative min-h-[85vh] md:min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent select-none pt-24 md:pt-0 z-10"
    >
      <div ref={pinContainerRef} className="w-full h-full flex items-center justify-center">
        {/* Background Volumetric Ambient Radial Glow */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-slate-violet-light/15 filter blur-[140px] pointer-events-none z-0" />

        {/* Hero Content Grid - Headlines and text copy stay completely stationary */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Column Fixed Headline Copy */}
          <div className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-slate-violet/30 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-slate-violet-light animate-pulse" />
              <span className="tracking-widest text-slate-violet-light uppercase">
                VARIATION 1: PURE FRAMELESS 3D SURGE
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
              DASI GAMES
            </h1>

            <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
              Crafting unique gaming experiences
            </p>

            <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
              Pure logo performing an intricate 3D multi-axis corkscrew flight, surging into camera space before plunging deep behind Section 2.
            </p>

            <div className="pt-2">
              <button className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-wider">
                EXPLORE RELEASES
              </button>
            </div>
          </div>

          {/* Right Column: 3D Logo (Z-10 so it passes under Section 2 Z-30 surface) */}
          <div
            ref={logoWrapperRef}
            className="w-full md:w-[48%] flex items-center justify-center order-first md:order-last py-8 md:py-0 z-10"
            style={{ perspective: 1200 }}
          >
            <div
              ref={logoMeshRef}
              className="relative flex items-center justify-center cursor-grab active:cursor-grabbing p-4"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 rounded-full bg-slate-violet/25 filter blur-3xl scale-125 pointer-events-none" />

              <Image
                src="/Images/dasigames_logo.png"
                alt="Dasi Games Pure 3D Logo"
                width={340}
                height={340}
                priority
                className="w-56 h-56 md:w-80 md:h-80 object-contain filter drop-shadow-[0_0_50px_rgba(168,85,247,0.7)] select-none pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Floating Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none opacity-60">
          <span className="text-[9px] tracking-widest text-alabaster-grey/70 font-silkscreen uppercase">
            SCROLL TO DRIVE LOGO BEHIND SECTION 2
          </span>
          <div className="w-[1.5px] h-8 bg-gradient-to-b from-slate-violet-light to-transparent animate-pulse" />
        </div>
      </div>
    </div>
  );
}
