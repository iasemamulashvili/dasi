'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function ErrorVariant0Fog() {
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 600);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

  const smoothX = useSpring(mouseX, { stiffness: 85, damping: 22 });
  const smoothY = useSpring(mouseY, { stiffness: 85, damping: 22 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 relative overflow-hidden select-none bg-carbon-black text-bright-snow">
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.96); opacity: 0.15; }
          50% { transform: scale(1.05); opacity: 0.4; }
          100% { transform: scale(0.96); opacity: 0.15; }
        }
        .fog-overlay {
          background: radial-gradient(
            circle 260px at calc(1px * var(--x, 50%)) calc(1px * var(--y, 50%)),
            rgba(24, 24, 27, 0.0) 0%,
            rgba(9, 9, 11, 0.88) 55%,
            rgba(9, 9, 11, 0.99) 100%
          );
        }
      `}</style>

      {/* Fog of War Spotlight Mask */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none fog-overlay mix-blend-multiply"
        style={{
          // @ts-ignore
          '--x': smoothX,
          // @ts-ignore
          '--y': smoothY,
        }}
      />

      {/* Center Radar Backdrop */}
      <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-slate-violet/20 flex items-center justify-center pointer-events-none z-0">
        <div className="absolute w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full border border-slate-violet/10 animate-pulse" />
        <div className="absolute w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full border border-slate-violet/5" />
        <div className="absolute h-full w-[0.5px] bg-slate-violet/5 rotate-45" />
        <div className="absolute h-full w-[0.5px] bg-slate-violet/5 -rotate-45" />
      </div>

      {/* Centered HUD container */}
      <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center gap-8">
        <div className="relative flex items-center justify-center w-24 h-24 bg-zinc-900/80 border border-slate-violet/30 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <div className="absolute inset-0 rounded-2xl bg-slate-violet/10 border border-slate-violet/20 animate-pulse" />
          <Lock size={32} className="text-slate-violet-light drop-shadow-[0_0_8px_rgba(167,139,250,0.4)]" />
        </div>

        <div className="w-full p-8 bg-zinc-950/75 border border-white/10 rounded-2xl relative shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldAlert size={14} className="text-slate-violet-light" />
            <span className="text-[10px] font-mono text-slate-violet-light tracking-widest uppercase">
              ERROR_MAP_RESTRICTED (404)
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-normal text-bright-snow uppercase tracking-wider font-russo-one mb-8">
            Looks like this part of the map is still locked.
          </h1>

          <div className="flex justify-center">
            <Link
              href="/"
              className="inset-pixel-btn-primary group inline-flex items-center gap-2 py-3 px-6 text-xs"
            >
              <span>Fast Travel to Homepage</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="font-mono text-[8px] text-alabaster-grey/40 tracking-wider flex items-center gap-4 pointer-events-none">
          <span>SYS_STATUS: MAP_BLOCKED</span>
          <span>•</span>
          <span>VARIANT_0: FOG_RADAR</span>
        </div>
      </div>
    </div>
  );
}
