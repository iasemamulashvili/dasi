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
            scrub: 0.3,
            anticipatePin: 1,
          },
        });

        // Set transformOrigin to lower 90% for a funnel vortex stretch
        gsap.set(logoMesh, { transformOrigin: '50% 90%' });

        // VARIANT 2: FLUID FUNNEL STRETCH (Vortex Taper)
        // More exaggerated vertical elongation (scaleY 1.70) with a narrow funnel taper (scaleX 0.40) & subtle skew
        tl.to(
          logoMesh,
          {
            rotateY: 0,
            rotateZ: 0,
            rotateX: isDesktop ? 26 : 18,
            skewY: isDesktop ? -6 : -3, // Subtle downward skew pull
            scaleY: isDesktop ? 1.70 : 1.45, // Hyper-extended vertical stretch
            scaleX: isDesktop ? 0.40 : 0.46, // Tapered funnel width
            y: isDesktop ? 580 : 380,
            opacity: 0.95,
            ease: 'power2.in',
          },
          0
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
      className="relative w-full min-h-screen bg-transparent select-none z-10 font-outfit"
    >
      <div
        ref={pinContainerRef}
        className="w-full min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        {/* Ambient Subtle Halo - Matching V1 non-glowing aesthetic */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.15)_0%,rgba(24,24,27,0.04)_60%,transparent_80%)] filter blur-[100px] pointer-events-none z-0" />

        {/* Hero Content Grid - Copy stays 100% stationary */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Column Fixed Copy */}
          <div className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-slate-violet/40 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-slate-violet-light animate-pulse" />
              <span className="tracking-widest text-slate-violet-light uppercase">
                VARIANT 2: FLUID FUNNEL STRETCH
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
              DASI GAMES
            </h1>

            <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
              Crafting unique gaming experiences
            </p>

            <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
              <strong className="text-bright-snow font-semibold">Funnel Vortex Flavor:</strong> Features an ultra-fluid vertical stretch (<code className="text-slate-violet-light">scaleY: 1.70</code>) with narrow funnel tapering (<code className="text-slate-violet-light">scaleX: 0.40</code>) and subtle downward skew as it enters Section 2. Uses clean Variation 1 colors without harsh over-glow.
            </p>

            <div className="pt-2">
              <button className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-xs tracking-wider">
                EXPLORE SHOWCASE
              </button>
            </div>
          </div>

          {/* Right Column: 3D Logo with Crisp V1 Colors */}
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
                className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(167,139,250,0.30)] pointer-events-none select-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
