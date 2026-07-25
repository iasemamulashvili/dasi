'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Concept1PureFramelessProps {
  heroContainerRef: React.RefObject<HTMLDivElement | null>;
  section2Ref: React.RefObject<HTMLDivElement | null>;
}

export default function Concept1PureFrameless({
  heroContainerRef,
  section2Ref,
}: Concept1PureFramelessProps) {
  const logoMeshRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroContainerRef.current || !logoMeshRef.current) return;

    const heroSection = heroContainerRef.current;
    const logoMesh = logoMeshRef.current;

    // Subtle 3D Cursor Parallax Tilt (Strictly forward-facing, capped at 6deg max)
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
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
        isDesktop: '(min-width: 768px)',
        isMobile: '(max-width: 767px)',
      },
      (context) => {
        const { isDesktop } = context.conditions as { isDesktop: boolean };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.3,
          },
        });

        // Set transformOrigin to bottom center so the bottom edge stretches downward into Section 2
        gsap.set(logoMesh, { transformOrigin: '50% 100%' });

        // VARIANT 1: LINEAR GRAVITATIONAL SIPHON (Benchmark Sucking Stretch)
        // Bottom stretches downwards (scaleY 1.45) while horizontal width shrinks (scaleX 0.48)
        tl.to(
          logoMesh,
          {
            rotateY: 0,
            rotateZ: 0,
            rotateX: isDesktop ? 22 : 16,
            scaleY: isDesktop ? 1.45 : 1.30, // Elastic vertical downward stretch
            scaleX: isDesktop ? 0.48 : 0.54, // Logo width shrinks
            y: isDesktop ? 540 : 380, // Plunges beneath Section 2's z-30 top border
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
    };
  }, [heroContainerRef, section2Ref]);

  return (
    <div className="w-full h-full flex items-center justify-center relative perspective-[1200px] pointer-events-auto select-none">
      <div
        ref={logoMeshRef}
        className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-[380px] lg:h-[380px] flex items-center justify-center cursor-pointer"
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
  );
}
