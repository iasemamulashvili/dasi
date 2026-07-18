'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert } from 'lucide-react';

export default function Concept3Page() {
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

  // Restart trigger for manual testing convenience
  const handleReset = () => {
    setSeconds(5);
    setIsGlitching(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[100dvh] w-full px-6 py-12 relative overflow-hidden select-none bg-zinc-950 text-bright-snow">
      <style>{`
        @keyframes border-flash {
          0%, 100% {
            border-color: rgba(239, 68, 68, 0.15);
            box-shadow: inset 0 0 30px rgba(239, 68, 68, 0.05);
          }
          50% {
            border-color: rgba(239, 68, 68, 0.6);
            box-shadow: inset 0 0 50px rgba(239, 68, 68, 0.25);
          }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 0.2; }
          50% { transform: scale(1.1); opacity: 0.5; }
          100% { transform: scale(0.95); opacity: 0.2; }
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes warning-text-glow {
          0%, 100% { text-shadow: 0 0 8px rgba(239, 68, 68, 0.4); }
          50% { text-shadow: 0 0 16px rgba(239, 68, 68, 0.9); }
        }
        .hud-border-flash {
          animation: border-flash 1.2s infinite ease-in-out;
        }
        .animate-pulse-ring {
          animation: pulse-ring 4s infinite ease-in-out;
        }
        .animate-scan {
          animation: scanline 10s linear infinite;
        }
        .warning-glow {
          animation: warning-text-glow 1.2s infinite ease-in-out;
        }
      `}</style>

      {/* Flashing Red Tactical HUD Border */}
      <div className="absolute inset-0 z-20 border-[8px] md:border-[16px] pointer-events-none rounded-none hud-border-flash" />

      {/* Decorative Radar Circle Backdrop */}
      <div className="absolute w-[300px] h-[300px] md:w-[400px] md:h-[400px] rounded-full border border-red-500/10 flex items-center justify-center pointer-events-none z-0">
        <div className="absolute w-[200px] h-[200px] md:w-[280px] md:h-[280px] rounded-full border border-red-500/5 animate-pulse-ring" />
        <div className="absolute w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full border border-red-500/5" />
        <div className="absolute h-full w-[1px] bg-red-500/5 rotate-45" />
        <div className="absolute h-full w-[1px] bg-red-500/5 -rotate-45" />
      </div>

      {/* Main HUD container */}
      <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center gap-8">
        
        {/* Warning Indicator Symbol */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <div className="absolute inset-0 rounded-full bg-red-500/10 border border-red-500/30 animate-ping opacity-25" />
          <div className="absolute w-24 h-24 rounded-full border-2 border-red-500/40 bg-zinc-900/60 backdrop-blur-sm flex items-center justify-center shadow-[0_0_25px_rgba(239,68,68,0.2)]">
            <ShieldAlert size={36} className="text-red-500 warning-glow" />
          </div>
        </div>

        {/* Error Code Bezel Frame - Liquid Glass */}
        <div className="w-full p-6 bg-zinc-900/70 border border-white/10 rounded-2xl relative shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_15px_30px_rgba(0,0,0,0.4)] backdrop-blur-md">
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
          <div className="absolute inset-x-0 h-[1.5px] bg-red-500/20 pointer-events-none animate-scan" />
          
          <div className="flex items-center justify-center gap-2 mb-3">
            <ShieldAlert size={14} className="text-red-500" />
            <span className="text-[10px] font-silkscreen text-red-500 tracking-widest uppercase">
              ERROR_OUT_OF_MISSION_ZONE
            </span>
          </div>

          <h1 className="text-xl md:text-2xl font-normal text-bright-snow uppercase tracking-wider font-russo-one mb-4">
            Leaving Mission Area
          </h1>

          {/* Digital Timer */}
          <div className="flex items-center justify-center gap-3 my-5">
            <span className="text-[10px] font-silkscreen text-alabaster-grey/50 uppercase tracking-widest">
              RETURN IN
            </span>
            <span 
              onClick={handleReset}
              className={`text-4xl font-mono font-bold px-3 py-1 bg-red-950/40 border border-red-500/30 rounded-lg text-red-500 warning-glow cursor-pointer hover:bg-red-950/60 transition-colors ${
                isGlitching ? 'line-through opacity-75' : ''
              }`}
            >
              0:0{seconds}
            </span>
          </div>

          <p className="text-xs md:text-sm text-alabaster-grey leading-relaxed font-outfit font-light max-w-xs mx-auto mb-6">
            {isGlitching 
              ? "Mission area boundary violated. The browser connection link has timed out. Please fallback to base safety grids."
              : `Heads up! You're leaving the mission area. Turn around in ${seconds} seconds!`}
          </p>

          {/* Action Button */}
          <div className="flex flex-col items-center gap-3">
            <Link
              href="/"
              className="inset-pixel-btn-primary group inline-flex items-center gap-2 py-3 px-6 text-xs transition-transform duration-200 active:scale-[0.97] !bg-red-950/20 !border-red-500/30 text-red-400 hover:!bg-red-500 hover:text-white"
            >
              <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
              <span>FALL BACK TO BASE</span>
            </Link>

            <span className="text-[9px] text-alabaster-grey/40 font-outfit font-light italic max-w-[250px] mt-2 block">
              Don't sweat it, we won't actually crash your browser if the timer hits zero.
            </span>
          </div>
        </div>

        {/* Technical Footer HUD indicators */}
        <div className="font-mono text-[7px] text-red-500/40 tracking-widest uppercase flex items-center gap-4 pointer-events-none">
          <span>SYS_STATUS: BOUNDARY_VIOLATION</span>
          <span>•</span>
          <span>COORDINATE: 404_OUT_OF_BOUNDS</span>
        </div>
      </div>
    </div>
  );
}
