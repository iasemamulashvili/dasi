'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Concept3PortalDescentProps {
  heroContainerRef: React.RefObject<HTMLDivElement | null>;
  section2Ref: React.RefObject<HTMLDivElement | null>;
}

/**
 * VARIANT 3: KINETIC VACUUM DROP (Exponential Vacuum Plunge with Bottom-to-Top Clip Wipe)
 * Uses official Dasi Logo (/Logo_White_PNG.png). Zero particle trails.
 * On scroll, animates clipPath from inset(0% 0% 0% 0%) to inset(0% 0% 100% 0%), wiping the logo away
 * from bottom to top as it descends below the next element (Section 2 on desktop / Scroll to Explore on mobile).
 */
export default function Concept3PortalDescent({
  heroContainerRef,
  section2Ref,
}: Concept3PortalDescentProps) {
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

    gsap.set(logoMesh, {
      transformOrigin: '50% 100%',
      clipPath: 'inset(0% 0% 0% 0%)',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: heroSection,
        start: 'top top',
        end: isMobile ? 'top+=180 top' : 'top+=400 top',
        scrub: 0.15,
      },
    });

    if (isMobile) {
      // Mobile: Bottom-to-top wipe (inset 0% -> 100% at bottom) before reaching "SCROLL TO EXPLORE"
      tl.to(
        logoMesh,
        {
          rotateX: 20,
          scaleY: 1.10,
          scaleX: 0.52,
          y: 65,
          clipPath: 'inset(0% 0% 100% 0%)',
          ease: 'power4.in',
        },
        0
      );
    } else {
      // Desktop: Steep 3D wedge pitch & exponential vacuum plunge with bottom-to-top wipe behind Section 2 border
      tl.to(
        logoMesh,
        {
          rotateY: 0,
          rotateZ: 0,
          rotateX: 44,
          scaleY: 1.15,
          scaleX: 0.44,
          y: 540,
          clipPath: 'inset(0% 0% 100% 0%)',
          ease: 'power4.in',
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
        className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-64 md:h-64 lg:w-[320px] lg:h-[320px] flex items-center justify-center cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <Image
          src="/Logo_White_PNG.png"
          alt="Dasi Games 3D Logo"
          width={360}
          height={360}
          priority
          className="w-full h-full object-contain filter drop-shadow-[0_0_35px_rgba(167,139,250,0.30)] pointer-events-none select-none"
        />
      </div>
    </div>
  );
}
