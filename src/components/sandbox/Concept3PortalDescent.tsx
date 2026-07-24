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
            scrub: 0.25, // Snappier 1:1 scroll reaction
            anticipatePin: 1,
          },
        });

        gsap.set(logoMesh, { transformOrigin: '50% 100%' });

        // VARIANT 3: KINETIC VACUUM DROP (Snap Pull)
        // Deeper 3D pitch perspective (rotateX 34) with sharp exponential acceleration (power3.in) as if sucked by vacuum force
        tl.to(
          logoMesh,
          {
            rotateY: 0,
            rotateZ: 0,
            rotateX: isDesktop ? 34 : 22, // Deeper downward pitch perspective
            scaleY: isDesktop ? 1.35 : 1.25, // Controlled kinetic stretch
            scaleX: isDesktop ? 0.50 : 0.54, // Proportional size shrink
            y: isDesktop ? 550 : 360,
            opacity: 0.95,
            ease: 'power3.in', // Accelerating vacuum pull
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
        {/* Subtle Ambient Background Halo */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[550px] h-[550px] rounded-full bg-[radial-gradient(circle_at_center,rgba(167,139,250,0.12)_0%,rgba(24,24,27,0.04)_60%,transparent_80%)] filter blur-[100px] pointer-events-none z-0" />

        {/* Hero Content Grid - Copy stays 100% stationary */}
        <div className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left Column Fixed Copy */}
          <div className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-slate-violet/40 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <span className="w-2 h-2 rounded-full bg-slate-violet-light animate-pulse" />
              <span className="tracking-widest text-slate-violet-light uppercase">
                VARIANT 3: KINETIC VACUUM DROP
              </span>
            </div>

            <h1 className="text-4xl md:text-7xl font-normal tracking-wider font-russo-one text-bright-snow leading-tight">
              DASI GAMES
            </h1>

            <p className="text-lg md:text-2xl font-light tracking-wide text-bright-snow/90 font-outfit">
              Crafting unique gaming experiences
            </p>

            <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-outfit font-light max-w-xl">
              <strong className="text-bright-snow font-semibold">Snap Vacuum Flavor:</strong> Combines a deeper 3D downward pitch (<code className="text-slate-violet-light">rotateX: 34deg</code>) with an accelerating vacuum curve (<code className="text-slate-violet-light">power3.in</code>) for a snappy, high-energy suction plunge into Section 2.
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
