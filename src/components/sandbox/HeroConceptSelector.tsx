'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Waves, Zap, Cpu } from 'lucide-react';

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
      name: 'Variant 1: Linear Gravitational Siphon',
      shortName: 'Variant 1 (Linear Siphon)',
      icon: Sparkles,
      tag: 'Linear Siphon',
      desc: 'Bottom stretches downward (scaleY: 1.45) while logo width shrinks (scaleX: 0.48) during pinned hero scroll.',
    },
    {
      id: 'concept2' as ConceptId,
      name: 'Variant 2: Fluid Funnel Stretch',
      shortName: 'Variant 2 (Fluid Funnel)',
      icon: Waves,
      tag: 'Fluid Funnel',
      desc: 'Hyper-extended vertical elongation (scaleY: 1.70) with a narrow funnel taper (scaleX: 0.40) and subtle downward skew.',
    },
    {
      id: 'concept3' as ConceptId,
      name: 'Variant 3: Kinetic Vacuum Drop',
      shortName: 'Variant 3 (Kinetic Vacuum)',
      icon: Zap,
      tag: 'Kinetic Vacuum',
      desc: 'Deeper 3D downward pitch perspective (rotateX: 34deg) with an accelerating vacuum curve (power3.in).',
    },
  ];

  const currentConcept = concepts.find((c) => c.id === activeConcept) || concepts[0];

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] w-[92vw] max-w-2xl pointer-events-none select-none">
      <div className="pointer-events-auto bg-carbon-black-2/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-between gap-3">
        
        {/* Tab Switchers */}
        <div className="flex items-center gap-1.5 w-full overflow-x-auto no-scrollbar py-0.5">
          {concepts.map((concept) => {
            const Icon = concept.icon;
            const isActive = activeConcept === concept.id;
            return (
              <button
                key={concept.id}
                onClick={() => onSelectConcept(concept.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-slate-violet/40 text-bright-snow border border-slate-violet-light/60 shadow-[0_0_20px_rgba(167,139,250,0.4)]'
                    : 'text-alabaster-grey/70 hover:text-bright-snow hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={14} className={isActive ? 'text-slate-violet-light animate-pulse' : 'opacity-60'} />
                <span className="font-outfit text-xs">{concept.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* FPS & Performance HUD */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 bg-carbon-black/80 border border-white/10 rounded-xl text-[10px] font-mono text-alabaster-grey/80 shrink-0">
          <Cpu size={12} className="text-slate-violet-light" />
          <span className="text-emerald-400 font-bold">{fps} FPS</span>
        </div>
      </div>
    </div>
  );
}
