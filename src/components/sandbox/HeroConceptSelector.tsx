'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Sun, Flame, Cpu } from 'lucide-react';

export type ConceptId = 'concept1' | 'concept2' | 'concept3';

interface HeroConceptSelectorProps {
  activeConcept: ConceptId;
  onSelectConcept: (concept: ConceptId) => void;
}

export default function HeroConceptSelector({
  activeConcept,
  onSelectConcept,
}: HeroConceptSelectorProps) {
  const [fps, setFps] = useState<number>(60);

  // Measure active FPS accurately
  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animId: number;

    const measureFps = (now: number) => {
      frameCount++;
      if (now >= lastTime + 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastTime)));
        frameCount = 0;
        lastTime = now;
      }
      animId = requestAnimationFrame(measureFps);
    };

    animId = requestAnimationFrame(measureFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  const concepts = [
    {
      id: 'concept1' as ConceptId,
      name: 'Variant 1: Pure Gravitational Descent',
      shortName: '1. Pure Gravitational Descent',
      icon: Sparkles,
      tag: 'Clean Baseline',
      desc: 'Strictly forward-facing logo with narrow axis pointing downward. Fluid gravitational pull sucking the base beneath Section 2 with zero visual noise.',
    },
    {
      id: 'concept2' as ConceptId,
      name: 'Variant 2: Volumetric Aura Pull',
      shortName: '2. Volumetric Aura Pull',
      icon: Sun,
      tag: 'Ambient Lighting',
      desc: 'Sophisticated volumetric aura and floor light streaks enhancing the forward-facing downward suction into Section 2.',
    },
    {
      id: 'concept3' as ConceptId,
      name: 'Variant 3: Gravitational Void Siphon',
      shortName: '3. Gravitational Void Siphon',
      icon: Flame,
      tag: 'Alternate Visual',
      desc: 'Sleek horizon event seam with particle siphon trails pulling the forward-facing logo smoothly beneath Section 2.',
    },
  ];

  const currentConcept = concepts.find((c) => c.id === activeConcept) || concepts[0];

  return (
    <>
      {/* Top Floating Glassmorphic Control Bar */}
      <header className="fixed top-20 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4 pointer-events-none select-none">
        <div className="pointer-events-auto bg-carbon-black-2/80 backdrop-blur-xl border border-white/10 rounded-2xl p-2 shadow-[0_16px_40px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Tab Switchers */}
          <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto no-scrollbar py-0.5">
            {concepts.map((concept) => {
              const Icon = concept.icon;
              const isActive = activeConcept === concept.id;
              return (
                <button
                  key={concept.id}
                  onClick={() => onSelectConcept(concept.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-300 whitespace-nowrap ${
                    isActive
                      ? 'bg-slate-violet/30 text-bright-snow border border-slate-violet-light/50 shadow-[0_0_20px_rgba(167,139,250,0.3)]'
                      : 'text-alabaster-grey/70 hover:text-bright-snow hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <Icon size={14} className={isActive ? 'text-slate-violet-light' : 'opacity-60'} />
                  <span className="font-outfit">{concept.shortName}</span>
                </button>
              );
            })}
          </div>

          {/* FPS & Performance HUD */}
          <div className="flex items-center gap-3 px-3 py-1.5 bg-carbon-black/60 border border-white/5 rounded-xl text-[10px] font-mono text-alabaster-grey/80 shrink-0 self-end md:self-auto">
            <div className="flex items-center gap-1.5">
              <Cpu size={12} className="text-slate-violet-light" />
              <span>PERF:</span>
              <span className="text-emerald-400 font-bold">{fps} FPS</span>
            </div>
            <span className="opacity-30">|</span>
            <span className="text-slate-violet-light font-bold">FORWARD-FACING GRAVITATIONAL PULL</span>
          </div>
        </div>

        {/* Concept Description Sub-Bar */}
        <div className="pointer-events-auto mt-2 px-4 py-2 bg-carbon-black-2/60 backdrop-blur-md border border-white/5 rounded-xl text-xs font-outfit text-alabaster-grey/90 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <span className="text-slate-violet-light font-bold font-mono text-[11px] uppercase">
              [{currentConcept.tag}]
            </span>
            <span className="line-clamp-1">{currentConcept.desc}</span>
          </div>
        </div>
      </header>
    </>
  );
}
