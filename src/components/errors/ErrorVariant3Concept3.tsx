'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { ArrowLeft, Zap, RefreshCw } from 'lucide-react';

export default function ErrorVariant3Concept3() {
  const logoMeshRef = useRef<HTMLDivElement>(null);
  const portalRingsRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!logoMeshRef.current || !containerRef.current || !portalRingsRef.current) return;
    const logoMesh = logoMeshRef.current;
    const portalRings = portalRingsRef.current;
    const container = containerRef.current;

    // Interactive 3D Cursor Parallax Tilt
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(logoMesh, {
        rotateY: x * 40,
        rotateX: -y * 40,
        duration: 0.6,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(logoMesh, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Continuous Portal Pulse Animation
    const portalAnim = gsap.to(portalRings, {
      scale: 1.15,
      opacity: 0.8,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      portalAnim.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen w-full bg-carbon-black text-bright-snow flex items-center justify-center overflow-hidden p-6 select-none font-outfit"
    >
      {/* Volumetric Muted Green Spotlight Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] rounded-full bg-[radial-gradient(circle_at_center,rgba(82,122,105,0.30)_0%,rgba(24,24,24,0.95)_70%)] filter blur-3xl pointer-events-none z-0" />

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0" />

      {/* Concentric Energy Portal Singularity Rings */}
      <div
        ref={portalRingsRef}
        className="absolute top-1/2 right-12 md:right-28 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 rounded-full border border-muted-green/50 pointer-events-none z-0 opacity-40 flex items-center justify-center"
      >
        <div className="w-3/4 h-3/4 rounded-full border border-muted-green/60 animate-ping opacity-30" />
        <div className="w-1/2 h-1/2 rounded-full border border-bright-snow/70 shadow-[0_0_35px_rgba(82,122,105,0.9)]" />
      </div>

      <div className="relative z-10 max-w-5xl w-full flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Column Content */}
        <div className="flex-1 flex flex-col items-start justify-center gap-6 order-last md:order-first w-full max-w-xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-carbon-black-2/80 border border-muted-green/40 rounded-xl text-[10px] font-silkscreen text-bright-snow shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <Zap size={14} className="text-muted-green animate-pulse" />
            <span className="tracking-widest text-muted-green uppercase">
              ERROR 404 • PORTAL SINGULARITY WARP
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-russo-one text-bright-snow tracking-wider leading-none">
            404
          </h1>

          <h2 className="text-2xl md:text-3xl font-russo-one text-bright-snow uppercase">
            Singularity Event Detected
          </h2>

          <p className="text-sm md:text-base text-alabaster-grey leading-relaxed font-light">
            The destination route was pulled into a quantum portal singularity. Return to main operational grid.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-4">
            <Link
              href="/"
              className="inset-pixel-btn-primary flex-1 w-full py-4 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              <span>RETURN HOME</span>
            </Link>

            <button
              onClick={() => window.location.reload()}
              className="inset-pixel-btn-secondary flex-1 w-full py-4 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw size={16} />
              <span>RE-INITIALIZE</span>
            </button>
          </div>
        </div>

        {/* Right Column: 3D Portal Singularity Logo Mesh */}
        <div className="flex-1 flex items-center justify-center relative w-full h-[320px] md:h-[450px] perspective-[1200px]">
          <div
            ref={logoMeshRef}
            className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <Image
              src="/Logo_White_PNG.png"
              alt="Dasi Games 3D Logo"
              width={350}
              height={350}
              priority
              className="w-full h-full object-contain filter drop-shadow-[0_0_60px_rgba(82,122,105,0.9)] pointer-events-none select-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
