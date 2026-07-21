'use client';

import Link from 'next/link';
import { Compass, Compass as OrbitIcon, ArrowRight } from 'lucide-react';

export default function ErrorVariant3Space() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 relative overflow-hidden select-none bg-carbon-black text-bright-snow font-mono">
      {/* Deep Space Black Hole Gradient & Orbit Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15)_0%,rgba(168,85,247,0.1)_40%,transparent_70%)] filter blur-3xl pointer-events-none" />

      {/* Orbit ring visual */}
      <div className="absolute w-[360px] h-[360px] rounded-full border border-blue-500/20 border-dashed animate-[spin_30s_linear_infinite] pointer-events-none z-0" />
      <div className="absolute w-[240px] h-[240px] rounded-full border border-purple-500/20 border-dotted animate-[spin_20s_linear_infinite_reverse] pointer-events-none z-0" />

      <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center gap-6 p-8 bg-carbon-black-2/70 border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-blue-500/10 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-[0_0_25px_rgba(59,130,246,0.3)]">
          <Compass size={28} className="animate-spin" />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-mono text-blue-400 tracking-widest uppercase">
            SIGNAL LOST // OUT OF RANGE (404)
          </span>
          <h1 className="text-xl md:text-2xl font-russo-one tracking-wider text-bright-snow">
            Lost in Deep Space Orbit
          </h1>
        </div>

        <p className="text-xs text-alabaster-grey/80 font-outfit leading-relaxed max-w-xs">
          Your telemetry lost link with the studio station. Teleporting back to main warp coordinates.
        </p>

        <div className="pt-2 w-full">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-blue-500/20 border border-blue-400/40 text-bright-snow font-bold text-xs uppercase tracking-wider hover:bg-blue-500/30 transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <span>Hyperspace Jump Home</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <div className="mt-8 font-mono text-[9px] text-alabaster-grey/40 tracking-widest uppercase pointer-events-none">
        VARIANT_3: DEEP_SPACE_OUT_OF_RANGE
      </div>
    </div>
  );
}
