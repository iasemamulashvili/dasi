'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import DasiHeroLogoSiphon from '@/components/sandbox/DasiHeroLogoSiphon';

const WebGLFeaturedSlider = dynamic(() => import('@/components/WebGLFeaturedSlider'), { ssr: false });

export default function HeroConceptsSandboxPage() {
  const section2Ref = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* 1:1 Production Header */}
      <Header />

      <main className="flex-1">
        {/* 1:1 Production Hero Section with Perfected Dasi Logo Siphon */}
        <Hero
          logoComponent={(heroRef: React.RefObject<HTMLDivElement | null>) => (
            <DasiHeroLogoSiphon heroContainerRef={heroRef} section2Ref={section2Ref} />
          )}
        />

        {/* 1:1 Production Section 2 (Featured Releases Showcase) */}
        <div
          ref={section2Ref}
          className="relative z-30 w-full bg-carbon-black border-t border-white/10 shadow-[0_-25px_60px_rgba(0,0,0,0.95)]"
        >
          <WebGLFeaturedSlider />
        </div>
      </main>

      {/* 1:1 Production Footer */}
      <Footer />
    </>
  );
}
