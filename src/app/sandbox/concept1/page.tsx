'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldAlert } from 'lucide-react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function Concept1Page() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Track mouse coordinates outside React render loop to avoid frame drops
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 600);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 400);

  // Smooth springs for the spotlight movement
  const smoothX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 80, damping: 20 });

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
      ref={containerRef}
      className="flex-1 flex flex-col items-center justify-center min-h-[100dvh] w-full px-6 py-12 relative overflow-hidden select-none bg-zinc-950 text-bright-snow"
    >
      <style>{`
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.5; }
          100% { transform: scale(0.95); opacity: 0.2; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes glitch-text {
          0%, 100% { transform: none; }
          92% { transform: skewX(-2deg) skewY(1deg); filter: hue-rotate(90deg); }
          94% { transform: skewX(3deg); filter: hue-rotate(180deg); }
          96% { transform: skewX(-1deg) skewY(-2deg); filter: hue-rotate(270deg); }
        }
        .animate-pulse-ring {
          animation: pulse-ring 4s infinite ease-in-out;
        }
        .animate-scan {
          animation: scanline 10s linear infinite;
        }
        .animate-glitch-text {
          animation: glitch-text 6s infinite ease-in-out;
        }
        .fog-overlay {
          background: radial-gradient(
            circle 250px at calc(1px * var(--x, 50%)) calc(1px * var(--y, 50%)),
            rgba(24, 24, 27, 0.1) 0%,
            rgba(9, 9, 11, 0.85) 60%,
            rgba(9, 9, 11, 0.98) 100%
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

      {/* Background Radar Backdrop mimicking the 404 page style */}
      <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-slate-violet/20 flex items-center justify-center pointer-events-none z-0">
        <div className="absolute w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full border border-slate-violet/10 animate-pulse-ring" />
        <div className="absolute w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full border border-slate-violet/5" />
        <div className="absolute h-full w-[1px] bg-slate-violet/5 rotate-45" />
        <div className="absolute h-full w-[1px] bg-slate-violet/5 -rotate-45" />
      </div>

      {/* Main HUD container */}
      <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center gap-8">
        
        {/* Glow Barrier & Lock Icon */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <div className="absolute inset-0 rounded-full bg-slate-violet/10 border border-slate-violet/30 animate-ping opacity-25" />
          <div className="absolute w-24 h-24 rounded-full border-2 border-slate-violet/40 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.2)]">
            <Lock size={36} className="text-slate-violet-light drop-shadow-[0_0_8px_rgba(167,139,250,0.5)]" />
          </div>
        </div>

        {/* Error Code Bezel Frame - Liquid Glass */}
        <div className="w-full p-6 bg-zinc-900/70 border border-white/10 rounded-2xl relative shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
          <div className="absolute inset-x-0 h-[1.5px] bg-slate-violet-light/35 pointer-events-none animate-scan" />
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldAlert size={14} className="text-slate-violet-light" />
            <span className="text-[10px] font-silkscreen text-slate-violet-light tracking-widest uppercase">
              ERROR_AREA_LOCKED
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-normal text-bright-snow uppercase tracking-wider font-russo-one animate-glitch-text mb-4">
            Map Sector Locked
          </h1>

          <p className="text-xs md:text-sm text-alabaster-grey leading-relaxed font-outfit font-light max-w-xs mx-auto mb-6">
            Looks like this part of the map is still locked. You'll need to gain more exploration clearance or return to the main sector coordinates.
          </p>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="inset-pixel-btn-primary group inline-flex items-center gap-2 py-3 px-6 text-xs transition-transform duration-200 active:scale-[0.97]"
            >
              <span>FAST TRAVEL TO HOME</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Technical Footer HUD indicators */}
        <div className="font-mono text-[7px] text-alabaster-grey/40 tracking-widest uppercase flex items-center gap-4 pointer-events-none">
          <span>SYS_STATUS: MAP_BLOCKED</span>
          <span>•</span>
          <span>COORDINATE: 404_RESTRICTED</span>
        </div>
      </div>
    </div>
  );
}
