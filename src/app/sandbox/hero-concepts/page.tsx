'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import HeroConceptSelector, { ConceptId } from '@/components/sandbox/HeroConceptSelector';
import Concept1PureFrameless from '@/components/sandbox/Concept1PureFrameless';
import Concept2GlassMonolith from '@/components/sandbox/Concept2GlassMonolith';
import Concept3PortalDescent from '@/components/sandbox/Concept3PortalDescent';

const WebGLFeaturedSlider = dynamic(() => import('@/components/WebGLFeaturedSlider'), { ssr: false });

export default function HeroConceptsSandboxPage() {
  const [activeConcept, setActiveConcept] = useState<ConceptId>('concept1');
  const section2Ref = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Exact 1:1 Production Header */}
      <Header />

      <main className="relative min-h-screen w-full bg-carbon-black text-bright-snow overflow-x-hidden selection:bg-slate-violet/30 flex-1">
        {/* Floating Mobile-Responsive Concept Selector */}
        <HeroConceptSelector
          activeConcept={activeConcept}
          onSelectConcept={setActiveConcept}
        />

        {/* 1:1 Production Hero Section with Injected SVG Concept Logo */}
        <Hero
          logoComponent={(heroRef: React.RefObject<HTMLDivElement | null>) => (
            <>
              {activeConcept === 'concept1' && (
                <Concept1PureFrameless heroContainerRef={heroRef} section2Ref={section2Ref} />
              )}
              {activeConcept === 'concept2' && (
                <Concept2GlassMonolith heroContainerRef={heroRef} section2Ref={section2Ref} />
              )}
              {activeConcept === 'concept3' && (
                <Concept3PortalDescent heroContainerRef={heroRef} section2Ref={section2Ref} />
              )}
            </>
          )}
        />

        {/* 1:1 Production Section 2 (Featured Releases Showcase) */}
        <div
          ref={section2Ref}
          className="relative z-30 w-full border-t border-white/10 bg-carbon-black shadow-[0_-25px_60px_rgba(0,0,0,0.95)] -mt-16 md:-mt-28"
        >
          <WebGLFeaturedSlider />
        </div>
      </main>

      {/* Exact 1:1 Production Footer */}
      <Footer />
    </>
  );
}
