'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Concept1Page() {
  // Track mouse coordinates outside React render loop to avoid frame drops
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 600);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

  // Smooth springs for the spotlight movement
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
    <div 
      className="flex-1 flex flex-col md:flex-row items-center md:items-stretch justify-center md:justify-start min-h-screen w-full relative overflow-hidden select-none bg-transparent text-bright-snow"
    >
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.96); opacity: 0.15; }
          50% { transform: scale(1.05); opacity: 0.4; }
          100% { transform: scale(0.96); opacity: 0.15; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes glitch-text {
          0%, 100% { transform: none; }
          93% { transform: skewX(-1.5deg) skewY(0.5deg); filter: hue-rotate(45deg); }
          95% { transform: skewX(2.5deg); filter: hue-rotate(90deg); }
          97% { transform: skewX(-0.5deg) skewY(-1deg); filter: hue-rotate(180deg); }
        }
        .animate-pulse-ring {
          animation: pulse-ring 4s infinite ease-in-out;
        }
        .animate-scan {
          animation: scanline 8s linear infinite;
        }
        .animate-glitch-text {
          animation: glitch-text 5s infinite ease-in-out;
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

      {/* LEFT PANEL: Asymmetric Tactical Game Overlay */}
      <div className="relative z-10 w-full md:w-[440px] px-8 md:px-12 py-16 flex flex-col justify-between bg-zinc-950/75 border border-white/5 md:border-y-0 md:border-l-0 md:border-r md:border-white/10 shadow-[20px_0_50px_rgba(0,0,0,0.7)] backdrop-blur-lg">
        {/* Top Indicators */}
        <div className="flex items-center gap-2.5 opacity-80">
          <ShieldAlert size={14} className="text-amber-500 animate-pulse" />
          <span className="text-[10px] font-silkscreen text-amber-400 tracking-widest uppercase">
            SEC_RESTRICTED // AREA_LOCKED
          </span>
        </div>

        {/* Center Content */}
        <div className="flex flex-col gap-8 my-auto py-10">
          <div className="relative flex items-center justify-center w-20 h-20 bg-zinc-900/80 border border-white/10 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="absolute inset-0 rounded-2xl bg-amber-500/10 border border-amber-500/20 animate-pulse-ring" />
            <Lock size={32} className="text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.4)]" />
          </div>

          <h1 className="text-3xl md:text-4xl font-normal leading-tight tracking-wide text-bright-snow uppercase font-russo-one animate-glitch-text">
            Looks like this part of the map is still locked.
          </h1>

          <div>
            <Link
              href="/"
              className="inset-pixel-btn-primary group inline-flex items-center gap-3 py-3.5 px-6 text-xs transition-transform duration-200 active:scale-[0.97]"
            >
              <span>Fast Travel to Homepage</span>
              <ArrowRight size={13} className="group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* HUD Data Readout */}
        <div className="font-mono text-[8px] text-alabaster-grey/40 tracking-wider flex items-center justify-between">
          <span>SYS_STATUS: MAP_BLOCKED</span>
          <span>404_SEC_VER: 0x2A9F</span>
        </div>
      </div>

      {/* RIGHT AREA: Interactive Radar Circle follow cursor */}
      <div className="flex-1 hidden md:flex items-center justify-center pointer-events-none relative overflow-hidden">
        {/* Dynamic target HUD tracking spotlight position */}
        <motion.div 
          className="absolute w-[360px] h-[360px] rounded-full border border-amber-500/10 flex items-center justify-center"
          style={{ x: useSpring(useMotionValue(0), { stiffness: 60, damping: 18 }), y: useSpring(useMotionValue(0), { stiffness: 60, damping: 18 }) }}
        >
          <div className="absolute w-[260px] h-[260px] rounded-full border border-amber-500/5 animate-pulse-ring" />
          <div className="absolute w-[140px] h-[140px] rounded-full border border-amber-500/5" />
          <div className="absolute h-full w-[0.5px] bg-amber-500/5" />
          <div className="absolute w-full h-[0.5px] bg-amber-500/5" />
          
          {/* Sweeping radar needle */}
          <div className="absolute top-1/2 left-1/2 w-1/2 h-[0.5px] bg-gradient-to-r from-amber-500/25 to-transparent origin-left rotate-45 animate-spin" style={{ animationDuration: '6s' }} />
        </motion.div>
      </div>
    </div>
  );
}
