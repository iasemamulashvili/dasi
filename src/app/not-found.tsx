'use client';

import Link from 'next/link';
import { HelpCircle, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[85vh] px-6 py-12 relative select-none">
      <style>{`
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes glitch-flicker {
          0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100% {
            opacity: 0.99;
            filter: hue-rotate(0deg) saturate(1);
          }
          20%, 21.999%, 63%, 63.999%, 65%, 69.999% {
            opacity: 0.4;
            filter: hue-rotate(90deg) saturate(1.5);
          }
        }
        @keyframes radar-pulse {
          0% { transform: scale(0.9); opacity: 0.8; }
          50% { transform: scale(1.15); opacity: 0.2; }
          100% { transform: scale(0.9); opacity: 0.8; }
        }
        .animate-scan {
          animation: scanline 8s linear infinite;
        }
        .animate-glitch {
          animation: glitch-flicker 4s infinite;
        }
        .animate-radar {
          animation: radar-pulse 3s infinite ease-in-out;
        }
      `}</style>

      {/* Decorative Radar Circle Backdrop */}
      <div className="absolute w-[280px] h-[280px] md:w-[380px] md:h-[380px] rounded-full border border-slate-violet/20 flex items-center justify-center pointer-events-none z-0">
        <div className="absolute w-[180px] h-[180px] md:w-[260px] md:h-[260px] rounded-full border border-slate-violet/10 animate-radar" />
        <div className="absolute w-[80px] h-[80px] md:w-[120px] md:h-[120px] rounded-full border border-slate-violet/5" />
        <div className="absolute h-full w-[1px] bg-slate-violet/5 rotate-45" />
        <div className="absolute h-full w-[1px] bg-slate-violet/5 -rotate-45" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center flex flex-col items-center gap-6">
        {/* Error Code Bezel Frame */}
        <div className="inset-pixel-card p-6 bg-carbon-black-2/80 backdrop-blur-md max-w-[200px] flex flex-col items-center justify-center animate-glitch relative border border-graphite-light">
          {/* Scanline line inside card */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20" />
          <div className="absolute inset-x-0 h-[1.5px] bg-slate-violet-light/35 pointer-events-none animate-scan" />
          
          <HelpCircle size={28} className="text-slate-violet-light animate-bounce mb-2" />
          <span className="text-5xl font-normal tracking-widest text-bright-snow font-russo-one drop-shadow-[0_0_12px_var(--color-slate-violet)]">
            404
          </span>
          <span className="text-[8px] font-silkscreen text-slate-violet-light tracking-widest uppercase mt-1">
            ERROR_SECTOR_NOT_FOUND
          </span>
        </div>

        {/* Messaging */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-normal text-bright-snow uppercase tracking-wide font-russo-one retro-heading-shadow">
            Sector Displacement
          </h1>
          <p className="text-xs md:text-sm text-alabaster-grey leading-relaxed font-outfit font-light max-w-xs mx-auto">
            The coordinate link you requested has ceased to exist or has been warped to another grid sector in our matrix.
          </p>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
          <Link
            href="/"
            className="inset-pixel-btn-primary group inline-flex items-center gap-2 py-3 px-6 text-xs"
          >
            <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" />
            <span>RETURN HOME</span>
          </Link>
        </div>
      </div>

      {/* Cybernetic Tech HUD footer indicators */}
      <div className="absolute bottom-6 font-mono text-[7px] text-alabaster-grey/40 tracking-widest uppercase flex items-center gap-4 pointer-events-none">
        <span>MATRIX: ONLINE</span>
        <span>•</span>
        <span>SYS_STATUS: 404_ANOMALY</span>
      </div>
    </div>
  );
}
