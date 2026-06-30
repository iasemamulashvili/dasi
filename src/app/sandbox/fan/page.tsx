'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Helper component for each sandbox option to keep states isolated
function FanSandboxItem({
  title,
  description,
  fanType,
}: {
  title: string;
  description: string;
  fanType: 'turbine' | 'portal' | 'propeller';
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dumpZoneRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const collectedLetters = useRef<Set<number>>(new Set());
  const mousePos = useRef({ x: 0, y: 0 });
  const [collectedCount, setCollectedCount] = useState(0);
  const [isBlowing, setIsBlowing] = useState(false);

  const testWord = "WIND BLAST";

  // --- Animation loop for carrying letters in this specific sandbox ---
  useEffect(() => {
    let animationId: number;

    const updateLetterPositions = () => {
      if (collectedLetters.current.size > 0) {
        collectedLetters.current.forEach((index) => {
          const letter = letterRefs.current[index];
          if (letter) {
            const rect = letter.getBoundingClientRect();
            const currentX = gsap.getProperty(letter, 'x') as number || 0;
            const currentY = gsap.getProperty(letter, 'y') as number || 0;

            // Calculate static home position relative to viewport
            const homeViewportX = rect.left - currentX;
            const homeViewportY = rect.top - currentY;

            // Offset completely to bottom-right of cursor
            const angle = (index / testWord.length) * Math.PI * 2 + (Date.now() * 0.003);
            const radius = 4;
            const targetViewportX = mousePos.current.x + 30 + Math.cos(angle) * radius;
            const targetViewportY = mousePos.current.y + 30 + Math.sin(angle) * radius;

            const relTargetX = targetViewportX - homeViewportX;
            const relTargetY = targetViewportY - homeViewportY;

            gsap.set(letter, {
              x: currentX + (relTargetX - currentX) * 0.12,
              y: currentY + (relTargetY - currentY) * 0.12,
              rotation: currentX * 0.15,
              scale: 0.85,
              color: 'oklch(0.65 0.15 264)', // Soft violet
              zIndex: 100,
            });
          }
        });
      }
      animationId = requestAnimationFrame(updateLetterPositions);
    };

    updateLetterPositions();
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };

    // Hover collection trigger
    letterRefs.current.forEach((letter, index) => {
      if (!letter || collectedLetters.current.has(index)) return;
      const rect = letter.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));

      if (dist < 35) {
        collectedLetters.current.add(index);
        setCollectedCount(collectedLetters.current.size);

        gsap.to(letter, {
          scale: 1.3,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        });
      }
    });
  };

  const handleRelease = () => {
    if (collectedLetters.current.size === 0 || !containerRef.current) return;

    setIsBlowing(true);
    setTimeout(() => setIsBlowing(false), 1200);

    const el = containerRef.current;

    // Contained Speed Lines Breeze
    gsap.fromTo(
      el.querySelectorAll('.wind-line-item'),
      { scaleX: 0, x: 10, opacity: 0.8 },
      {
        scaleX: 1.5,
        x: -180,
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      }
    );

    // Letters return animations
    letterRefs.current.forEach((letter, index) => {
      if (letter && collectedLetters.current.has(index)) {
        const tl = gsap.timeline({ delay: index * 0.04 });
        
        tl.to(letter, {
          x: '-=150',
          y: '+=random(-25, 25)',
          rotation: 'random(-60, 60)',
          duration: 0.28,
          ease: 'power1.out',
        }).to(letter, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          color: 'oklch(0.95 0.01 0)', // Settle to Bright Snow
          duration: 0.75,
          ease: 'power3.out',
        });
      }
    });

    collectedLetters.current.clear();
    setCollectedCount(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="p-8 bg-carbon-black-2 border border-graphite-light rounded-2xl flex flex-col gap-6 relative overflow-hidden group min-h-[360px] justify-between shadow-lg"
    >
      {/* Custom keyframes for Option B counter-rotation */}
      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-reverse-fast {
          animation: spin-reverse 0.12s linear infinite;
        }
        .animate-spin-reverse-medium {
          animation: spin-reverse 0.5s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse 1.5s linear infinite;
        }
      `}</style>

      <div>
        <h3 className="text-base font-bold text-bright-snow">{title}</h3>
        <p className="text-xs text-alabaster-grey/70 mt-1">{description}</p>
      </div>

      {/* Interactive letter collector pool */}
      <div className="flex gap-1.5 select-none text-3xl font-black justify-center items-center h-20 border border-graphite-light bg-carbon-black rounded-xl relative">
        {testWord.split('').map((char, index) => {
          if (char === ' ') return <span key={index} className="w-4">&nbsp;</span>;
          return (
            <span
              key={index}
              ref={(el) => {
                letterRefs.current[index] = el;
              }}
              className="inline-block cursor-grab active:cursor-grabbing hover:text-slate-violet-light duration-75 relative text-bright-snow"
            >
              {char}
            </span>
          );
        })}

        {collectedCount > 0 && (
          <div className="absolute top-2 left-3 text-[9px] uppercase tracking-widest text-slate-violet-light font-bold animate-pulse">
            Carrying {collectedCount}
          </div>
        )}
      </div>

      {/* Release box and fan container */}
      <div className="flex justify-center mt-2">
        <div
          ref={dumpZoneRef}
          onMouseEnter={handleRelease}
          onClick={handleRelease}
          className={`flex w-full items-center justify-between gap-3 pl-6 pr-2 py-3 border-dashed border-2 rounded-xl text-sm font-sans tracking-widest transition-all duration-300 relative select-none cursor-pointer overflow-hidden ${
            collectedCount > 0
              ? 'border-platinum-silver text-platinum-silver bg-carbon-black/60 scale-105 shadow-md'
              : 'border-graphite-light text-alabaster-grey/60 bg-transparent hover:border-platinum-silver/40'
          }`}
        >
          <span>RELEASE</span>

          {/* Speed Lines Breeze (Contained inside the box) */}
          <div className="absolute inset-y-0 left-4 right-16 pointer-events-none overflow-hidden flex flex-col justify-around">
            <div className="wind-line-item w-full h-[1.5px] bg-gradient-to-l from-platinum-silver to-transparent opacity-0 origin-right" />
            <div className="wind-line-item w-full h-[2.5px] bg-gradient-to-l from-platinum-silver to-transparent opacity-0 origin-right" />
            <div className="wind-line-item w-full h-[1.5px] bg-gradient-to-l from-platinum-silver to-transparent opacity-0 origin-right" />
            <div className="wind-line-item w-full h-[2px] bg-gradient-to-l from-platinum-silver to-transparent opacity-0 origin-right" />
          </div>

          {/* Integrated fan wrapper */}
          <div className="relative flex items-center justify-center pl-1">
            {/* --- SVG Fans (Stand-less) --- */}

            {/* FAN OPTION A: Sleek Jet Turbine */}
            {fanType === 'turbine' && (
              <svg
                className={`w-11 h-11 transition-all duration-300 ${
                  collectedCount > 0 ? 'text-platinum-silver scale-105' : 'text-alabaster-grey/60'
                }`}
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Outer flush casing ring */}
                <circle cx="32" cy="32" r="26" strokeWidth="3" />
                <circle cx="32" cy="32" r="22" strokeWidth="1" strokeDasharray="3 2" className="opacity-40" />
                {/* Rotating dense blades */}
                <g
                  className={`origin-[32px_32px] ${
                    isBlowing
                      ? 'animate-[spin_0.12s_linear_infinite]'
                      : collectedCount > 0
                      ? 'animate-[spin_1.2s_linear_infinite]'
                      : 'hover:animate-[spin_0.5s_linear_infinite]'
                  }`}
                >
                  <circle cx="32" cy="32" r="6" fill="currentColor" />
                  {/* 8 curved turbine blades */}
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                    <g key={angle} transform={`rotate(${angle}, 32, 32)`}>
                      <path d="M32 32 c-3 -6 -4 -16 0 -20 c2.5 2 3 10 0 20" fill="currentColor" />
                    </g>
                  ))}
                </g>
              </svg>
            )}

            {/* FAN OPTION B: Sci-Fi Portal Vent */}
            {fanType === 'portal' && (
              <svg
                className={`w-11 h-11 transition-all duration-300 ${
                  collectedCount > 0 ? 'text-platinum-silver scale-105' : 'text-alabaster-grey/60'
                }`}
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Segmented outer ring */}
                <circle cx="32" cy="32" r="26" strokeWidth="2.5" strokeDasharray="16 6" />
                <circle cx="32" cy="32" r="20" strokeWidth="1" className="opacity-35" />
                
                {/* ROTOR 1 (Back Blades - Clockwise) */}
                <g
                  className={`origin-[32px_32px] opacity-40 ${
                    isBlowing
                      ? 'animate-[spin_0.14s_linear_infinite]'
                      : collectedCount > 0
                      ? 'animate-[spin_1.4s_linear_infinite]'
                      : 'hover:animate-[spin_0.5s_linear_infinite]'
                  }`}
                >
                  {[0, 120, 240].map((angle) => (
                    <g key={angle} transform={`rotate(${angle}, 32, 32)`}>
                      <path d="M32 32 c-2.5 -4 -3.5 -10 -0.5 -12 c2.5 1 3.5 7 0.5 12" fill="currentColor" />
                    </g>
                  ))}
                </g>

                {/* ROTOR 2 (Front Blades - Counter-Clockwise) */}
                <g
                  className={`origin-[32px_32px] ${
                    isBlowing
                      ? 'animate-spin-reverse-fast'
                      : collectedCount > 0
                      ? 'animate-spin-reverse-slow'
                      : 'hover:animate-spin-reverse-medium'
                  }`}
                >
                  <circle cx="32" cy="32" r="4.5" fill="currentColor" />
                  {[60, 180, 300].map((angle) => (
                    <g key={angle} transform={`rotate(${angle}, 32, 32)`}>
                      <path d="M32 32 c-2 -3.5 -3 -9 0 -11 c2 1.5 2.5 6.5 0 11" fill="currentColor" />
                    </g>
                  ))}
                </g>
              </svg>
            )}

            {/* FAN OPTION C: Minimalist Propeller Vent */}
            {fanType === 'propeller' && (
              <svg
                className={`w-11 h-11 transition-all duration-300 ${
                  collectedCount > 0 ? 'text-platinum-silver scale-105' : 'text-alabaster-grey/60'
                }`}
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Thin outer ring */}
                <circle cx="32" cy="32" r="26" strokeWidth="1.5" />
                <circle cx="32" cy="32" r="24" strokeWidth="0.5" className="opacity-25" />
                
                {/* Rotating Propeller */}
                <g
                  className={`origin-[32px_32px] ${
                    isBlowing
                      ? 'animate-[spin_0.14s_linear_infinite]'
                      : collectedCount > 0
                      ? 'animate-[spin_1.4s_linear_infinite]'
                      : 'hover:animate-[spin_0.5s_linear_infinite]'
                  }`}
                >
                  <circle cx="32" cy="32" r="5" fill="currentColor" />
                  {[0, 120, 240].map((angle) => (
                    <g key={angle} transform={`rotate(${angle}, 32, 32)`}>
                      <path d="M32 32 c-1.5 -5 -2.5 -18 0 -22 c1.8 2 1.8 12 0 22" fill="currentColor" />
                    </g>
                  ))}
                </g>
              </svg>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FanSandboxPage() {
  return (
    <main className="min-h-screen w-full bg-carbon-black text-bright-snow flex flex-col items-center py-20 px-6 font-sans">
      <div className="max-w-6xl w-full flex flex-col gap-4">
        {/* Header */}
        <div className="border-b border-graphite-light pb-6 mb-4">
          <h1 className="text-4xl font-bold tracking-wider text-bright-snow font-russo-one uppercase">
            Fan Model Testing Ground
          </h1>
          <p className="text-sm text-alabaster-grey mt-2 max-w-3xl leading-relaxed font-outfit">
            Compare three new completely **stand-less** fan designs below. All options are designed to sit flush 
            within the release box and feature the contained **Speed Lines breeze effect**.
          </p>
        </div>

        {/* 3 Sandbox columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FanSandboxItem
            title="Option A: Sleek Jet Turbine"
            description="A high-density circular turbine vent with 8 curved blades and a centered hub. Sitting flush on the right."
            fanType="turbine"
          />

          <FanSandboxItem
            title="Option B: Sci-Fi Portal Vent"
            description="A futuristic segmented casing with overlapping coaxial blades rotating in opposite directions."
            fanType="portal"
          />

          <FanSandboxItem
            title="Option C: Minimalist Propeller"
            description="A clean, thin-ring casing with 3 long aerodynamic propeller blades spinning around a hub."
            fanType="propeller"
          />
        </div>

        {/* Sandbox details */}
        <div className="mt-8 p-6 bg-carbon-black-2 border border-graphite-light rounded-2xl font-outfit">
          <h4 className="text-sm font-bold uppercase tracking-widest text-slate-violet-light mb-2 font-silkscreen">Testing Notes:</h4>
          <ul className="list-disc list-inside text-xs text-alabaster-grey space-y-2 leading-relaxed">
            <li><strong>Contained Airflow:</strong> Notice how the speed lines animate entirely inside the boundaries of the release box, clipping at the left border.</li>
            <li><strong>Stand-less Integration:</strong> The fans have no stands, necks, or brackets, looking like a built-in exhaust port.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
