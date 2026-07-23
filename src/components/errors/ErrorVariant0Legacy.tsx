'use client';

import Link from 'next/link';
import { ArrowLeft, RefreshCw, AlertTriangle, Shield } from 'lucide-react';

export default function ErrorVariant0Legacy() {
  return (
    <div className="relative min-h-screen w-full bg-carbon-black text-bright-snow flex items-center justify-center overflow-hidden p-6 select-none font-outfit">
      {/* Background Volumetric Radar Spotlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(82,122,105,0.25)_0%,rgba(24,24,24,0.9)_70%)] filter blur-3xl pointer-events-none z-0" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* 404 Radar Glass Container */}
      <div className="relative z-10 max-w-xl w-full bg-carbon-black-2/90 border border-muted-green/40 rounded-3xl p-8 md:p-12 backdrop-blur-2xl shadow-[0_16px_50px_rgba(0,0,0,0.8)] flex flex-col items-center text-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-muted-green/10 border border-muted-green/40 flex items-center justify-center text-muted-green shadow-[0_0_20px_rgba(82,122,105,0.3)]">
          <Shield size={32} />
        </div>

        <div className="flex flex-col gap-2">
          <div className="inline-flex items-center justify-center gap-2 text-xs font-silkscreen text-muted-green uppercase tracking-widest">
            <AlertTriangle size={14} />
            <span>ERROR 404 • SECTOR UNEXPLORED</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-russo-one tracking-wider text-bright-snow my-2">
            404
          </h1>

          <h2 className="text-xl md:text-2xl font-bold font-russo-one text-bright-snow uppercase">
            Signal Lost in Fog of War
          </h2>

          <p className="text-sm text-alabaster-grey/80 leading-relaxed max-w-md font-light">
            The target coordinates you requested do not exist in our active database. Re-align telemetry or return to home base.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-4">
          <Link
            href="/"
            className="inset-pixel-btn-primary flex-1 w-full py-4 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>RETURN TO BASE</span>
          </Link>

          <button
            onClick={() => window.location.reload()}
            className="inset-pixel-btn-secondary flex-1 w-full py-4 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={16} />
            <span>RE-SCAN SIGNAL</span>
          </button>
        </div>
      </div>
    </div>
  );
}
