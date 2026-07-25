'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface DasiHeroLogoSiphonProps {
  heroContainerRef: React.RefObject<HTMLDivElement | null>;
  section2Ref: React.RefObject<HTMLDivElement | null>;
}

/**
 * DasiHeroLogoSiphon Component
 * Perfected single logo scroll-driven siphon component.
 * Combines 3D liquid rubber vertical stretch (scaleY: 1.75 / scaleX: 0.35) with true physical DOM layer stacking (z-10).
 * Glides seamlessly behind the z-20 "SCROLL TO EXPLORE" HUD badge on mobile and z-30 Section 2 on desktop.
 */
export default function DasiHeroLogoSiphon({
  heroContainerRef,
  section2Ref,
}: DasiHeroLogoSiphonProps) {
  const logoMeshRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!heroContainerRef.current || !logoMeshRef.current) return;

    const heroSection = heroContainerRef.current;
    const logoMesh = logoMeshRef.current;

    // 3D Cursor Parallax Tilt (Desktop only)
    const handleMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 1024) return;
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

    // Anchor transformOrigin to bottom center for liquid siphon stretch
    gsap.set(logoMesh, { transformOrigin: '50% 100%' });

    // Responsive GSAP ScrollTrigger Siphon Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: isMobile ? 'top+=280 top' : 'top+=500 top',
        scrub: 0.2,
      },
    });

    if (isMobile) {
      // Mobile: Swift, elegant liquid stretch that glides behind z-20 "SCROLL TO EXPLORE" & z-30 Section 2
      tl.to(
        logoMesh,
        {
          rotateY: 0,
          rotateZ: 0,
          rotateX: 18,
          scaleY: 1.45,
          scaleX: 0.45,
          y: 280, // Physical descent past z-20 Scroll to Explore into z-30 Section 2
          ease: 'power2.in',
        },
        0
      );
    } else {
      // Desktop: Ultra-smooth liquid siphon plunge behind z-30 Section 2
      tl.to(
        logoMesh,
        {
          rotateY: 0,
          rotateZ: 0,
          rotateX: 26,
          scaleY: 1.75,
          scaleX: 0.35,
          y: 600,
          ease: 'power2.in',
        },
        0
      );
    }

    return () => {
      heroSection.removeEventListener('mousemove', handleMouseMove);
      heroSection.removeEventListener('mouseleave', handleMouseLeave);
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, [heroContainerRef, isMobile, section2Ref]);

  return (
    <div className="w-full h-full flex items-center justify-center relative perspective-[1200px] pointer-events-auto select-none">
      <div
        ref={logoMeshRef}
        className="relative w-40 h-40 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-[320px] lg:h-[320px] flex items-center justify-center cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Image
          src="/Logo_White_PNG.png"
          alt="Dasi Games 3D Logo"
          width={360}
          height={360}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(167,139,250,0.35)] pointer-events-none select-none"
        />
      </div>
    </div>
  );
}
