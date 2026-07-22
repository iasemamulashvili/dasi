'use client';

import { useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import HeroConceptSelector, { ConceptId } from '@/components/sandbox/HeroConceptSelector';
import Concept1PureFrameless from '@/components/sandbox/Concept1PureFrameless';
import Concept2GlassMonolith from '@/components/sandbox/Concept2GlassMonolith';
import Concept3PortalDescent from '@/components/sandbox/Concept3PortalDescent';

const WebGLFeaturedSlider = dynamic(() => import('@/components/WebGLFeaturedSlider'), { ssr: false });

export default function HeroConceptsSandboxPage() {
  const [activeConcept, setActiveConcept] = useState<ConceptId>('concept1');
  const section2Ref = useRef<HTMLDivElement>(null);

  return (
    <main className="relative min-h-screen w-full bg-carbon-black text-bright-snow overflow-x-hidden selection:bg-slate-violet/30">
      {/* Floating Top UI Concept Selector & Performance HUD */}
      <HeroConceptSelector
        activeConcept={activeConcept}
        onSelectConcept={setActiveConcept}
      />

      {/* Hero Section Container */}
      <div className="relative w-full min-h-screen flex flex-col justify-between">
        {activeConcept === 'concept1' && <Concept1PureFrameless section2Ref={section2Ref} />}
        {activeConcept === 'concept2' && <Concept2GlassMonolith section2Ref={section2Ref} />}
        {activeConcept === 'concept3' && <Concept3PortalDescent section2Ref={section2Ref} />}
      </div>

      {/* Section 2 Production Featured Showcase (z-30 so 3D logo dives physically behind it) */}
      <div
        ref={section2Ref}
        className="relative z-30 w-full border-t border-white/10 bg-carbon-black shadow-[0_-25px_60px_rgba(0,0,0,0.95)] -mt-24 md:-mt-36"
      >
        <WebGLFeaturedSlider />
      </div>
    </main>
  );
}
