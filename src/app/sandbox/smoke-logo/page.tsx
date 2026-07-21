'use client';

import Link from 'next/link';
import SmokeLogoHero from '@/components/sandbox/SmokeLogoHero';
import { ArrowLeft, Sparkles, Sliders, ExternalLink } from 'lucide-react';

export default function SmokeLogoSandboxPage() {
  return (
    <main className="relative min-h-screen w-full bg-carbon-black text-bright-snow overflow-x-hidden selection:bg-slate-violet/30">
      {/* Header Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-carbon-black-2/70 border-b border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Link
            href="/sandbox/hero-concepts"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-alabaster-grey hover:text-bright-snow hover:bg-white/10 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>BACK TO HERO SANDBOX</span>
          </Link>
          <div className="h-4 w-[1px] bg-white/10 hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-violet-light font-bold">PROTOTYPE:</span>
            <span className="text-bright-snow font-russo-one">WEBGL FLUID SMOKE LOGO</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-violet/20 border border-slate-violet/40 text-[10px] font-mono text-slate-violet-light">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>THREE.JS + GLSL SIMPLEX CURL NOISE</span>
          </div>
          <Link
            href="/"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-violet-light text-carbon-black font-bold text-xs hover:bg-bright-snow transition-all cursor-pointer"
          >
            <span>HOME</span>
            <ExternalLink size={12} />
          </Link>
        </div>
      </header>

      {/* Hero Section Container */}
      <div className="relative w-full pt-16">
        <SmokeLogoHero />
      </div>

      {/* Info Section */}
      <section className="relative z-30 w-full py-16 px-6 border-t border-white/10 bg-carbon-black">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start justify-between gap-8 font-outfit">
          <div className="flex-1 flex flex-col gap-3">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-violet-light">
              <Sparkles size={14} />
              <span>TECHNICAL SPECIFICATIONS</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-russo-one uppercase tracking-wide text-bright-snow">
              Real-Time Fluid Particle Dissipation
            </h2>
            <p className="text-sm text-alabaster-grey/80 leading-relaxed font-light">
              This WebGL centerpiece samples the pixel points of <code className="text-slate-violet-light font-mono">Logo_White_PNG.png</code> into a high-density 3D particle array. Cursor contact activates GPU-accelerated 3D Simplex Curl Noise vectors, displacing vertices and fading opacity into ethereal fluid smoke before particles naturally drift back into solid logo formation over time.
            </p>
          </div>

          <div className="w-full md:w-80 bg-carbon-black-2/80 border border-graphite-light p-5 rounded-2xl flex flex-col gap-3 font-mono text-xs">
            <span className="text-slate-violet-light font-bold uppercase border-b border-white/10 pb-2">
              SIMULATION CONTROLS
            </span>
            <div className="flex flex-col gap-2 text-alabaster-grey/90 text-[11px]">
              <div className="flex justify-between">
                <span>Rendering Engine:</span>
                <span className="text-bright-snow">Three.js R185</span>
              </div>
              <div className="flex justify-between">
                <span>Shaders:</span>
                <span className="text-bright-snow">GLSL 300 es</span>
              </div>
              <div className="flex justify-between">
                <span>Noise Field:</span>
                <span className="text-bright-snow">3D Simplex Curl</span>
              </div>
              <div className="flex justify-between">
                <span>Smooth Scroll:</span>
                <span className="text-bright-snow">Lenis Provider</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
