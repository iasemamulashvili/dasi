'use client';

import Link from 'next/link';
import { RefreshCw, Terminal as TerminalIcon } from 'lucide-react';

export default function Concept2Page() {
  // Array of 12 falling logos
  const fallingLogos = Array.from({ length: 12 }).map((_, i) => {
    const left = `${(i * 9) + 4}%`; // Distributed horizontally
    const delay = `${i * -1.8}s`; // Staggered start times
    const duration = `${11 + (i % 3) * 3}s`; // Dynamic speed
    const scale = `${0.35 + (i % 4) * 0.15}`; // Varied size depth
    const rotateDir = i % 2 === 0 ? 'spin-clockwise' : 'spin-counter';
    const opacity = 0.08 + (i % 3) * 0.05; // Faint background effect

    return { id: i, left, delay, duration, scale, rotateDir, opacity };
  });

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 relative overflow-hidden select-none bg-transparent text-bright-snow">
      <style>{`
        @keyframes fall-down {
          0% { transform: translateY(-120px) rotate(0deg); }
          100% { transform: translateY(105dvh) rotate(360deg); }
        }
        @keyframes fall-down-reverse {
          0% { transform: translateY(-120px) rotate(360deg); }
          100% { transform: translateY(105dvh) rotate(0deg); }
        }
        @keyframes glitch-aberration {
          0%, 100% { text-shadow: 1.5px 0 0 rgba(239,68,68,0.7), -1.5px 0 0 rgba(59,130,246,0.7); }
          50% { text-shadow: -1.5px 0 0 rgba(239,68,68,0.7), 1.5px 0 0 rgba(59,130,246,0.7); }
        }
        .falling-logo-cw {
          animation: fall-down var(--dur) linear infinite;
          animation-delay: var(--delay);
        }
        .falling-logo-ccw {
          animation: fall-down-reverse var(--dur) linear infinite;
          animation-delay: var(--delay);
        }
        .text-chromatic {
          animation: glitch-aberration 0.3s infinite steps(2);
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

      {/* Main HUD container */}
      <div className="relative z-10 max-w-lg w-full flex flex-col items-center gap-8">
        
        {/* Decorative glitched terminal box */}
        <div className="w-full p-6 md:p-8 bg-zinc-950/85 border-2 border-red-500/30 rounded-lg relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md rotate-[-1.5deg] skew-x-1">
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none opacity-25" />
          
          {/* Terminal Header */}
          <div className="flex items-center justify-between border-b border-red-500/20 pb-4 mb-6 text-red-500/80">
            <div className="flex items-center gap-2">
              <TerminalIcon size={14} className="animate-pulse" />
              <span className="text-[10px] font-mono tracking-widest uppercase">
                CRITICAL: PHYS_STACK_OVERFLOW
              </span>
            </div>
            <span className="text-[9px] font-mono bg-red-950/50 border border-red-500/30 px-2 py-0.5 rounded text-red-400">
              OUT_OF_BOUNDS
            </span>
          </div>

          {/* Glitched Header Text */}
          <h1 className="text-xl md:text-2xl font-mono font-bold leading-relaxed text-red-400 uppercase tracking-wide text-chromatic text-center mb-8">
            Whoops, you fell out of bounds! Sending you back to the start...
          </h1>

          {/* Glitch Readout Stats */}
          <div className="bg-black/60 border border-white/5 rounded p-4 font-mono text-[9px] text-alabaster-grey/60 text-left mb-8 flex flex-col gap-1.5">
            <div>&gt; EXCEPTION DETECTED: VIEWPORT_COORDINATES_INVALID</div>
            <div>&gt; VECTOR_Y: +1440.09 (THRESHOLD EXCEEDED)</div>
            <div>&gt; INITIALIZING SAFETY RESPAWN PROTOCOL...</div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link
              href="/"
              className="px-6 py-3 border-2 border-red-500/50 bg-red-950/30 hover:bg-red-500 hover:text-black font-mono text-xs text-red-400 tracking-widest uppercase flex items-center gap-3 transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.2)] active:scale-[0.98]"
            >
              <RefreshCw size={13} className="animate-spin" style={{ animationDuration: '4s' }} />
              <span>Manual Respawn</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
