'use client';

import Link from 'next/link';
import { Gamepad2, ArrowLeft } from 'lucide-react';

export default function ErrorVariant2Arcade() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 relative overflow-hidden select-none bg-carbon-black text-bright-snow font-mono">
      {/* Retro Arcade CRT Scanline & Color Fringe */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[size:100%_4px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.18)_0%,transparent_75%)] pointer-events-none z-0" />

      <div className="relative z-10 max-w-md w-full bg-carbon-black-2/90 border-2 border-slate-violet-light/40 rounded-3xl p-8 text-center flex flex-col items-center gap-6 shadow-[0_0_60px_rgba(168,85,247,0.25)] backdrop-blur-xl">
        {/* Retro 8-bit Controller Icon */}
        <div className="w-16 h-16 rounded-2xl bg-slate-violet/20 border border-slate-violet-light/50 flex items-center justify-center text-slate-violet-light shadow-[0_0_20px_rgba(168,85,247,0.4)] animate-bounce">
          <Gamepad2 size={32} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-3xl font-extrabold font-russo-one tracking-widest text-rose-500 animate-pulse">
            GAME OVER
          </span>
          <span className="text-xs text-slate-violet-light tracking-widest uppercase">
            ERROR CODE 404 // STAGE DOES NOT EXIST
          </span>
        </div>

        <p className="text-xs text-alabaster-grey/80 font-outfit leading-relaxed max-w-xs">
          You ran out of lives exploring this sector. Insert coin or press start to return to safe checkpoint.
        </p>

        {/* High Score Badge */}
        <div className="w-full py-2 px-4 bg-white/5 border border-white/10 rounded-xl text-[10px] flex items-center justify-between text-alabaster-grey/70">
          <span>HIGH SCORE: 999,990</span>
          <span>CREDITS: 99</span>
        </div>

        {/* Action Button */}
        <div className="pt-2 w-full">
          <Link
            href="/"
            className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-slate-violet-light text-carbon-black font-bold text-xs uppercase tracking-wider hover:bg-bright-snow transition-all shadow-[0_0_25px_rgba(168,85,247,0.4)]"
          >
            <ArrowLeft size={14} />
            <span>PRESS START (HOME)</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 font-mono text-[9px] text-alabaster-grey/40 tracking-widest uppercase pointer-events-none">
        VARIANT_2: RETRO_ARCADE_GAMEOVER
      </div>
    </div>
  );
}
