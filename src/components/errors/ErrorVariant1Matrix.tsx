'use client';

import Link from 'next/link';
import { Terminal, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ErrorVariant1Matrix() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 relative overflow-hidden select-none bg-carbon-black text-bright-snow font-mono">
      {/* Matrix Glitch Scanline Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.02)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(225,29,72,0.15)_0%,transparent_70%)] pointer-events-none z-0" />

      {/* Terminal Bezel Box */}
      <div className="relative z-10 max-w-xl w-full bg-carbon-black-2/90 border border-rose-500/30 rounded-2xl p-6 md:p-8 shadow-[0_0_50px_rgba(225,29,72,0.2)] backdrop-blur-xl flex flex-col gap-6">
        {/* Header Terminal Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-rose-400" />
            <span className="text-xs text-rose-400 font-bold tracking-widest uppercase">
              KERNEL_PANIC // 404_PAGE_NOT_FOUND
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
        </div>

        {/* Glitch Output Content */}
        <div className="flex flex-col gap-4 text-xs text-alabaster-grey/90 leading-relaxed">
          <div className="flex items-center gap-2 text-rose-400 font-bold">
            <AlertTriangle size={16} />
            <span>CRITICAL EXCEPTION: Memory segment 0x00404 inaccessible.</span>
          </div>
          <p className="bg-black/50 p-3 rounded-lg border border-white/5 text-[11px] text-alabaster-grey/70">
            &gt; STACK TRACE: Route resolution failed.<br />
            &gt; CAUSE: Requested URL coordinate does not exist in production build.<br />
            &gt; STATUS: System halt. Recovery required.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-start">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-bright-snow text-xs font-bold uppercase tracking-wider hover:bg-rose-500/30 transition-all shadow-[0_0_20px_rgba(225,29,72,0.3)]"
          >
            <RefreshCw size={14} />
            <span>Reboot & Return Home</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 font-mono text-[9px] text-alabaster-grey/40 tracking-widest uppercase pointer-events-none">
        VARIANT_1: CYBER_MATRIX_PANIC
      </div>
    </div>
  );
}
