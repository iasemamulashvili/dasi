'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Box, Disc, Cpu } from 'lucide-react';

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
      name: 'Variation 1: Pure Frameless 3D',
      shortName: '1. Pure Frameless',
      icon: Sparkles,
      tag: 'Native 3D Floating Mesh',
      desc: 'No card or container. Pure logo floating natively in 3D space with ambient volumetric lighting, cursor tilt, and a deep Z-axis descent into Section 2.',
    },
    {
      id: 'concept2' as ConceptId,
      name: 'Variation 2: Cyber Glass Monolith',
      shortName: '2. Glass Monolith',
      icon: Box,
      tag: 'Split Seam Transition',
      desc: 'Ultra-sleek glassmorphic HUD panel with corner reticles. On scroll, the glass monolith splits open horizontally as the logo dives into the seam.',
    },
    {
      id: 'concept3' as ConceptId,
      name: 'Variation 3: Volumetric Energy Portal',
      shortName: '3. Energy Portal',
      icon: Disc,
      tag: 'Concentric Ring Mask',
      desc: 'Concentric glowing 3D energy rings behind the logo. As user scrolls down, the portal rings expand outward while the logo drives through the center into Section 2.',
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
                      ? 'bg-slate-violet-light/20 text-bright-snow border border-slate-violet/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]'
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
            </div>
            <div className="flex items-center gap-1">
              <span className={`font-bold ${fps >= 55 ? 'text-emerald-400' : fps >= 30 ? 'text-amber-400' : 'text-rose-400'}`}>
                {fps}
              </span>
              <span className="text-[8px] text-alabaster-grey/50">FPS</span>
            </div>
          </div>
        </div>
      </header>

      {/* Floating Info Pill at Bottom Left */}
      <aside className="fixed bottom-6 left-6 z-40 max-w-sm w-[calc(100vw-3rem)] pointer-events-none select-none">
        <div className="bg-carbon-black-2/85 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl text-xs flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-silkscreen text-slate-violet-light tracking-widest uppercase">
              {currentConcept.tag}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/5 border border-white/10 text-bright-snow">
              Interactive Sandbox
            </span>
          </div>
          <h3 className="text-sm font-russo-one text-bright-snow tracking-wide">
            {currentConcept.name}
          </h3>
          <p className="text-alabaster-grey/80 leading-relaxed font-outfit text-[11px]">
            {currentConcept.desc}
          </p>
        </div>
      </aside>
    </>
  );
}
