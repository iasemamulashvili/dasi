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

  const handleReset = () => {
    setSeconds(5);
    setIsGlitching(false);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 relative overflow-hidden select-none bg-transparent text-bright-snow">
      <style>{`
        @keyframes border-flash {
          0%, 100% {
            border-color: rgba(239, 68, 68, 0.15);
            box-shadow: inset 0 0 40px rgba(239, 68, 68, 0.05);
          }
          50% {
            border-color: rgba(239, 68, 68, 0.65);
            box-shadow: inset 0 0 60px rgba(239, 68, 68, 0.3);
          }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.96); opacity: 0.2; }
          50% { transform: scale(1.08); opacity: 0.45; }
          100% { transform: scale(0.96); opacity: 0.2; }
        }
        @keyframes warning-text-glow {
          0%, 100% { text-shadow: 0 0 10px rgba(239, 68, 68, 0.5); }
          50% { text-shadow: 0 0 20px rgba(239, 68, 68, 0.95); }
        }
        .hud-border-flash {
          animation: border-flash 1.0s infinite ease-in-out;
        }
        .animate-pulse-ring {
          animation: pulse-ring 4s infinite ease-in-out;
        }
        .warning-glow {
          animation: warning-text-glow 1.0s infinite ease-in-out;
        }
        .hazard-strip {
          background: repeating-linear-gradient(
            -45deg,
            #000,
            #000 10px,
            #ef4444 10px,
            #ef4444 20px
          );
        }
      `}</style>

      {/* Flashing Red Tactical HUD Border */}
      <div className="absolute inset-0 z-20 border-[8px] md:border-[16px] pointer-events-none rounded-none hud-border-flash" />

      {/* Top and Bottom Warning Hazard Stripes */}
      <div className="absolute top-0 inset-x-0 h-2 md:h-3 z-30 hazard-strip opacity-90" />
      <div className="absolute bottom-0 inset-x-0 h-2 md:h-3 z-30 hazard-strip opacity-90" />

      {/* Center Alarm Icon */}
      <div className="relative z-10 max-w-xl w-full text-center flex flex-col items-center gap-6">
        
        {/* Cockpit Alert Frame */}
        <div className="w-full p-8 bg-zinc-950/85 border-2 border-red-500 rounded-xl relative shadow-[0_25px_60px_rgba(0,0,0,0.85)] backdrop-blur-md">
          {/* Scanline overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <ShieldAlert size={16} className="text-red-500 animate-bounce" />
            <span className="text-[11px] font-mono text-red-500 tracking-[0.2em] font-semibold uppercase">
              SYS_WARNING: MISSION_BOUNDARY_VIOLATION
            </span>
          </div>

          {/* Punchy COPY */}
          <h1 className="text-2xl md:text-3xl font-russo-one tracking-wide leading-snug text-bright-snow uppercase mb-8 warning-glow">
            {isGlitching 
              ? "Heads up! You've left the mission area."
              : `Heads up! You're leaving the mission area. Turn around in ${seconds} seconds!`}
          </h1>

          {/* Large Countdown HUD element */}
          <div className="flex justify-center mb-8">
            <div 
              onClick={handleReset}
              className={`font-mono text-5xl md:text-6xl font-bold px-6 py-2 bg-red-950/40 border border-red-500/50 rounded-lg text-red-500 warning-glow cursor-pointer hover:bg-red-950/60 transition-all duration-300 ${
                isGlitching ? 'line-through opacity-50 scale-95' : 'scale-100 hover:scale-105'
              }`}
            >
              0:0{seconds}
            </div>
          </div>

          {/* Primary Action Button */}
          <div className="flex flex-col items-center gap-5">
            <Link
              href="/"
              className="group px-8 py-3.5 border border-red-500 bg-red-950/20 text-red-400 hover:bg-red-500 hover:text-black font-mono text-xs tracking-widest uppercase flex items-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.15)] active:scale-[0.98]"
            >
              <ArrowLeft size={13} className="group-hover:-translate-x-1.5 transition-transform" />
              <span>🛡️ Fall Back to Base</span>
            </Link>

            <span className="text-[10px] text-alabaster-grey/40 font-outfit font-light italic max-w-sm">
              Don't sweat it, we won't actually crash your browser if the timer hits zero.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
