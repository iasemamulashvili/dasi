'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import HeroConceptSelector, { ConceptId } from '@/components/sandbox/HeroConceptSelector';
import Concept1PureFrameless from '@/components/sandbox/Concept1PureFrameless';
import Concept2GlassMonolith from '@/components/sandbox/Concept2GlassMonolith';
import Concept3PortalDescent from '@/components/sandbox/Concept3PortalDescent';
import { ArrowUpRight, Sparkles } from 'lucide-react';

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
      <div className="relative w-full min-h-[90vh] md:min-h-screen flex items-center justify-center">
        {activeConcept === 'concept1' && <Concept1PureFrameless section2Ref={section2Ref} />}
        {activeConcept === 'concept2' && <Concept2GlassMonolith section2Ref={section2Ref} />}
        {activeConcept === 'concept3' && <Concept3PortalDescent section2Ref={section2Ref} />}
      </div>

      {/* Section 2 Seam Preview (Featured Releases) to evaluate scroll story transitions */}
      <section
        ref={section2Ref}
        id="featured-showcase"
        className="relative z-30 w-full py-24 px-6 max-w-7xl mx-auto border-t border-white/10 mt-12 bg-carbon-black"
      >
        <div className="flex flex-col gap-10">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-[10px] font-silkscreen text-slate-violet-light tracking-widest uppercase">
                <Sparkles size={12} />
                <span>SPOTLIGHT SHOWCASE</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-russo-one tracking-wider uppercase">
                FEATURED RELEASES
              </h2>
            </div>
            <p className="text-sm font-outfit text-alabaster-grey/70 max-w-md">
              Evaluating how each 3D scroll descent variation seamlessly ushers visitors into our primary game portfolio showcase.
            </p>
          </div>

          {/* Cards Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Crown Quest: Royal Tycoon',
                category: 'Arcade Strategy',
                img: '/crown-quest.webp',
                stats: '4.9★ • 500K+ Downloads',
              },
              {
                title: 'Hotel Manager 3D',
                category: 'Management Simulation',
                img: '/hotel-manager.webp',
                stats: '4.8★ • 1M+ Downloads',
              },
              {
                title: 'Lumber Chopper Idle',
                category: 'Hyper-Casual Arcade',
                img: '/lumber-chopper.webp',
                stats: '4.7★ • 250K+ Downloads',
              },
            ].map((game, idx) => (
              <div
                key={idx}
                className="group relative bg-carbon-black-2/60 border border-white/10 rounded-2xl overflow-hidden hover:border-slate-violet/50 transition-all duration-300 shadow-xl flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                  <Image
                    src={game.img}
                    alt={game.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-carbon-black-2 via-transparent to-transparent" />
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <span className="text-[10px] font-mono text-slate-violet-light uppercase tracking-wider">
                    {game.category}
                  </span>
                  <h3 className="text-lg font-russo-one text-bright-snow flex items-center justify-between">
                    <span>{game.title}</span>
                    <ArrowUpRight size={16} className="text-alabaster-grey/40 group-hover:text-bright-snow group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </h3>
                  <span className="text-xs font-outfit text-alabaster-grey/60 pt-2 border-t border-white/5">
                    {game.stats}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
