'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function ErrorConcept3() {
  const [seconds, setSeconds] = useState(5);
  const [isGlitching, setIsGlitching] = useState(false);

  useEffect(() => {
    if (seconds <= 0) {
      setIsGlitching(true);
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);

  const handleReset = () => {
    setSeconds(5);
    setIsGlitching(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 relative overflow-hidden select-none bg-transparent text-bright-snow font-outfit">
      <style>{`
        @keyframes border-flash {
          0%, 100% {
            border-color: rgba(168, 85, 247, 0.1);
            box-shadow: inset 0 0 20px rgba(168, 85, 247, 0.02);
          }
          50% {
            border-color: rgba(168, 85, 247, 0.35);
            box-shadow: inset 0 0 40px rgba(168, 85, 247, 0.12);
          }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.96); opacity: 0.15; }
          50% { transform: scale(1.05); opacity: 0.3; }
          100% { transform: scale(0.96); opacity: 0.15; }
        }
        .hud-border-flash {
          animation: border-flash 1.6s infinite ease-in-out;
        }
        .animate-pulse-ring {
          animation: pulse-ring 4s infinite ease-in-out;
        }
        .hazard-strip {
          background: repeating-linear-gradient(
            -45deg,
            #000,
            #000 10px,
            rgba(168, 85, 247, 0.3) 10px,
            rgba(168, 85, 247, 0.3) 20px
          );
        }
      `}</style>

      {/* Flashing Red Tactical HUD Border - Styled in brand violet */}
      <div className="absolute inset-0 z-20 border-[6px] md:border-[12px] pointer-events-none rounded-none hud-border-flash" />

      {/* Top and Bottom Warning Hazard Stripes */}
      <div className="absolute top-0 inset-x-0 h-1.5 md:h-2.5 z-30 hazard-strip opacity-80" />
      <div className="absolute bottom-0 inset-x-0 h-1.5 md:h-2.5 z-30 hazard-strip opacity-80" />

      {/* Center Box */}
      <div className="relative z-10 max-w-xl w-full text-center flex flex-col items-center gap-6">
        
        {/* Cockpit Alert Frame - Sleek Glassmorphism */}
        <div className="w-full p-8 bg-zinc-950/80 border border-slate-violet/20 rounded-xl relative shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-md">
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] pointer-events-none opacity-10" />
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldAlert size={15} className="text-slate-violet-light animate-pulse" />
            <span className="text-[10px] font-mono text-slate-violet-light tracking-[0.2em] font-semibold uppercase">
              SYS_WARNING: MISSION_BOUNDARY_VIOLATION
            </span>
          </div>

          {/* Punchy COPY */}
          <h1 className="text-xl md:text-2xl font-russo-one tracking-wide leading-snug text-bright-snow uppercase mb-8">
            {isGlitching 
              ? "Heads up! You've left the mission area."
              : `Heads up! You're leaving the mission area. Turn around in ${seconds} seconds!`}
          </h1>

          {/* Large Countdown HUD element */}
          <div className="flex justify-center mb-8">
            <div 
              onClick={handleReset}
              className={`font-mono text-4xl md:text-5xl font-bold px-5 py-2 bg-slate-violet/10 border border-slate-violet/30 rounded-lg text-slate-violet-light cursor-pointer hover:bg-slate-violet/20 transition-all duration-300 ${
                isGlitching ? 'line-through opacity-40 scale-95' : 'scale-100 hover:scale-103'
              }`}
            >
              0:0{seconds}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col items-center gap-5">
            <Link
              href="/"
              className="group px-7 py-3 border border-slate-violet bg-slate-violet/10 text-slate-violet-light hover:bg-slate-violet hover:text-black font-mono text-xs tracking-widest uppercase flex items-center gap-3 transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.1)] active:scale-[0.98]"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
              <span>🛡️ Fall Back to Base</span>
            </Link>

            {/* Subtext joke: Rendered ONLY when the timer hits zero */}
            {isGlitching && (
              <span className="text-[10px] text-alabaster-grey/40 font-outfit font-light italic max-w-sm mt-2 block animate-fadeIn">
                Don't sweat it, we won't actually crash your browser if the timer hits zero.
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
