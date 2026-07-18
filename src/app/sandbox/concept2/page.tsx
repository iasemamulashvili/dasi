'use client';

import Link from 'next/link';
import { RefreshCw, ShieldAlert } from 'lucide-react';

export default function Concept2Page() {
  // Let's define an array of items to render 12 falling logos
  const fallingLogos = Array.from({ length: 12 }).map((_, i) => {
    const left = `${(i * 9) + 4}%`; // Distributed horizontally
    const delay = `${i * -1.8}s`; // Staggered start times
    const duration = `${12 + (i % 3) * 3}s`; // Dynamic speed
    const scale = `${0.4 + (i % 4) * 0.15}`; // Varied size depth
    const rotateDir = i % 2 === 0 ? 'spin-clockwise' : 'spin-counter';
    const opacity = 0.08 + (i % 3) * 0.06; // Faint background effect

    return { id: i, left, delay, duration, scale, rotateDir, opacity };
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh] w-full px-6 py-12 relative overflow-hidden select-none bg-zinc-950 text-bright-snow">
      <style>{`
        @keyframes fall-down {
          0% {
            transform: translateY(-120px) rotate(0deg);
          }
          100% {
            transform: translateY(105dvh) rotate(360deg);
          }
        }
        @keyframes fall-down-reverse {
          0% {
            transform: translateY(-120px) rotate(360deg);
          }
          100% {
            transform: translateY(105dvh) rotate(0deg);
          }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.2; }
          50% { transform: scale(1.15); opacity: 0.5; }
          100% { transform: scale(0.95); opacity: 0.2; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .falling-logo-cw {
          animation: fall-down var(--dur) linear infinite;
          animation-delay: var(--delay);
        }
        .falling-logo-ccw {
          animation: fall-down-reverse var(--dur) linear infinite;
          animation-delay: var(--delay);
        }
        .animate-pulse-ring {
          animation: pulse-ring 4s infinite ease-in-out;
        }
        .animate-scan {
          animation: scanline 10s linear infinite;
        }
      `}</style>

      {/* Infinite Falling Logos Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {fallingLogos.map((logo) => (
          <img
            key={logo.id}
            src="https://dasigames.com/Images/low_res_images/dasigames_logo(transparent).png"
            alt="Falling Dasi Games Logo"
            style={{
              left: logo.left,
              transform: `scale(${logo.scale})`,
              opacity: logo.opacity,
              position: 'absolute',
              top: '-150px',
              width: '100px',
              height: 'auto',
              // @ts-ignore
              '--dur': logo.duration,
              '--delay': logo.delay,
            }}
            className={logo.rotateDir === 'spin-clockwise' ? 'falling-logo-cw' : 'falling-logo-ccw'}
          />
        ))}
      </div>

      {/* Decorative Radar Circle Backdrop */}
      <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-slate-violet/20 flex items-center justify-center pointer-events-none z-0">
        <div className="absolute w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full border border-slate-violet/10 animate-pulse-ring" />
        <div className="absolute w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full border border-slate-violet/5" />
        <div className="absolute h-full w-[1px] bg-slate-violet/5 rotate-45" />
        <div className="absolute h-full w-[1px] bg-slate-violet/5 -rotate-45" />
      </div>

      {/* Main HUD container */}
      <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center gap-8">
        
        {/* Falling Indicator Bezel */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <div className="absolute inset-0 rounded-full bg-slate-violet/10 border border-slate-violet/30 animate-ping opacity-25" />
          <div className="absolute w-24 h-24 rounded-full border-2 border-slate-violet/40 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.2)]">
            <RefreshCw size={36} className="text-slate-violet-light animate-spin" style={{ animationDuration: '6s' }} />
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
              ERROR_OUT_OF_BOUNDS
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-normal text-bright-snow uppercase tracking-wider font-russo-one mb-4">
            Fell Out of Bounds
          </h1>

          <p className="text-xs md:text-sm text-alabaster-grey leading-relaxed font-outfit font-light max-w-xs mx-auto mb-6">
            Whoops, you fell out of bounds! Sending you back to the start. The physics engine detected a boundary breach in your current viewport coordinate stack.
          </p>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="inset-pixel-btn-primary group inline-flex items-center gap-2 py-3 px-6 text-xs transition-transform duration-200 active:scale-[0.97]"
            >
              <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
              <span>MANUAL RESPAWN</span>
            </Link>
          </div>
        </div>

        {/* Technical Footer HUD indicators */}
        <div className="font-mono text-[7px] text-alabaster-grey/40 tracking-widest uppercase flex items-center gap-4 pointer-events-none">
          <span>SYS_STATUS: BOUNDS_BREACH</span>
          <span>•</span>
          <span>COORDINATE: 404_VOID</span>
        </div>
      </div>
    </div>
  );
}
