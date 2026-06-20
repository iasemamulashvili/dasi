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
  fanType: 'exhaust' | 'coaxial' | 'propeller';
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

            // Offset completely to bottom-right of cursor (top-left of letter aligns at +30px offset)
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
              color: '#62909d',
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

    // Linear Speed Lines Breeze (Approved Option 1 style)
    gsap.fromTo(
      el.querySelectorAll('.wind-line-item'),
      { scaleX: 0, x: 20, opacity: 0.8 },
      {
        scaleX: 2.2,
        x: -240,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: 'power2.out',
        overwrite: 'auto',
      }
    );

    // Letters return animations
    letterRefs.current.forEach((letter, index) => {
      if (letter && collectedLetters.current.has(index)) {
        const tl = gsap.timeline({ delay: index * 0.04 });
        
        // Push leftward by wind blast, then float back
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
          color: '#ebf0fa',
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
      className="p-8 bg-dasi-alice-950/20 border border-white/5 rounded-2xl flex flex-col gap-6 relative overflow-hidden group min-h-[360px] justify-between"
    >
      {/* Dynamic inline styles for Option B counter-rotation */}
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
        <h3 className="text-lg font-bold text-dasi-alice-300">{title}</h3>
        <p className="text-xs text-dasi-steel-400 mt-1">{description}</p>
      </div>

      {/* Interactive letter collector pool */}
      <div className="flex gap-1.5 select-none text-3xl font-black justify-center items-center h-20 border border-white/5 bg-dasi-black-950/50 rounded-xl relative">
        {testWord.split('').map((char, index) => {
          if (char === ' ') return <span key={index} className="w-4">&nbsp;</span>;
          return (
            <span
              key={index}
              ref={(el) => {
                letterRefs.current[index] = el;
              }}
              className="inline-block cursor-grab active:cursor-grabbing hover:text-dasi-alice-400 duration-75 relative text-dasi-black-50"
            >
              {char}
            </span>
          );
        })}

        {collectedCount > 0 && (
          <div className="absolute top-2 left-3 text-[10px] uppercase tracking-widest text-dasi-alice-400 font-bold animate-pulse">
            Carrying {collectedCount}
          </div>
        )}
      </div>

      {/* Release box and fan container */}
      <div className="flex justify-center mt-2">
        <div
          ref={dumpZoneRef}
          onMouseEnter={handleRelease}
          className={`inline-flex items-center gap-4 pl-6 pr-2 py-3 border-dashed border-2 rounded-2xl text-sm font-black tracking-widest transition-all duration-300 relative select-none cursor-pointer ${
            collectedCount > 0
              ? 'border-dasi-alice-400 text-dasi-alice-400 bg-dasi-alice-950/40 glow-border-cyan scale-105'
              : 'border-white/10 text-dasi-steel-500 bg-transparent hover:border-white/20'
          }`}
        >
          <span>RELEASE</span>

          {/* Integrated fan wrapper */}
          <div className="relative flex items-center justify-center pl-1">
            {/* Speed Lines Breeze (Option 1 style) */}
            <div className="absolute right-full mr-2 w-28 h-8 pointer-events-none overflow-hidden flex flex-col justify-around">
              <div className="wind-line-item w-full h-[1.5px] bg-gradient-to-l from-dasi-alice-400 to-transparent opacity-0 origin-right" />
              <div className="wind-line-item w-full h-[2.5px] bg-gradient-to-l from-dasi-alice-400 to-transparent opacity-0 origin-right" />
              <div className="wind-line-item w-full h-[1px] bg-gradient-to-l from-dasi-alice-400 to-transparent opacity-0 origin-right" />
            </div>

            {/* --- SVG Fans --- */}

            {/* FAN OPTION A: Cyberpunk Vented Exhaust */}
            {fanType === 'exhaust' && (
              <svg
                className={`w-11 h-11 transition-all duration-300 ${
                  collectedCount > 0 ? 'text-dasi-alice-400 scale-105' : 'text-dasi-steel-500'
                }`}
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Heavy mount bracket */}
                <path d="M54 20 v24 M54 32 h-6" strokeWidth="3" />
                {/* Heavy neck */}
                <path d="M48 32 h-8" strokeWidth="3" />
                {/* Octagonal Exhaust Casing */}
                <polygon points="24,2 37,7 42,20 37,33 24,38 11,33 6,20 11,7" strokeWidth="2.5" />
                {/* Inner horizontal safety mesh slats (static) */}
                <line x1="8" y1="12" x2="40" y2="12" strokeWidth="1" className="opacity-35" />
                <line x1="6" y1="20" x2="42" y2="20" strokeWidth="1" className="opacity-35" />
                <line x1="8" y1="28" x2="40" y2="28" strokeWidth="1" className="opacity-35" />
                {/* Rotating blades behind slats (4 blades) */}
                <g
                  className={`origin-[24px_20px] ${
                    isBlowing
                      ? 'animate-[spin_0.1s_linear_infinite]'
                      : collectedCount > 0
                      ? 'animate-[spin_1.0s_linear_infinite]'
                      : 'hover:animate-[spin_0.4s_linear_infinite]'
                  }`}
                >
                  <circle cx="24" cy="20" r="4.5" fill="currentColor" />
                  <g transform="rotate(0, 24, 20)">
                    <path d="M24 20 c-2 -4 -3 -12 0 -14 c3 1 3 8 0 14" fill="currentColor" />
                  </g>
                  <g transform="rotate(90, 24, 20)">
                    <path d="M24 20 c-2 -4 -3 -12 0 -14 c3 1 3 8 0 14" fill="currentColor" />
                  </g>
                  <g transform="rotate(180, 24, 20)">
                    <path d="M24 20 c-2 -4 -3 -12 0 -14 c3 1 3 8 0 14" fill="currentColor" />
                  </g>
                  <g transform="rotate(270, 24, 20)">
                    <path d="M24 20 c-2 -4 -3 -12 0 -14 c3 1 3 8 0 14" fill="currentColor" />
                  </g>
                </g>
              </svg>
            )}

            {/* FAN OPTION B: Coaxial Dual-Rotor Fan */}
            {fanType === 'coaxial' && (
              <svg
                className={`w-11 h-11 transition-all duration-300 ${
                  collectedCount > 0 ? 'text-dasi-alice-400 scale-105' : 'text-dasi-steel-500'
                }`}
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Modern mount brackets */}
                <path d="M52 18 c1.5 0 3 1.5 3 3.5 v21 c0 2 -1.5 3.5 -3 3.5" />
                <path d="M52 32 h-6" />
                {/* Slanted head */}
                <g transform="translate(6, 2) rotate(-20, 24, 20)">
                  {/* Casing outer ring */}
                  <circle cx="20" cy="20" r="17.5" strokeWidth="2.5" />
                  <circle cx="20" cy="20" r="14.5" strokeWidth="0.8" className="opacity-30" />

                  {/* ROTOR 1 (Back Rotor - Clockwise) */}
                  <g
                    className={`origin-[20px_20px] opacity-40 ${
                      isBlowing
                        ? 'animate-[spin_0.14s_linear_infinite]'
                        : collectedCount > 0
                        ? 'animate-[spin_1.4s_linear_infinite]'
                        : 'hover:animate-[spin_0.5s_linear_infinite]'
                    }`}
                  >
                    <g transform="rotate(0, 20, 20)">
                      <path d="M20 20 c-2.5 -4 -3.5 -10 -0.5 -12 c2.5 1 3.5 7 0.5 12" fill="currentColor" />
                    </g>
                    <g transform="rotate(120, 20, 20)">
                      <path d="M20 20 c-2.5 -4 -3.5 -10 -0.5 -12 c2.5 1 3.5 7 0.5 12" fill="currentColor" />
                    </g>
                    <g transform="rotate(240, 20, 20)">
                      <path d="M20 20 c-2.5 -4 -3.5 -10 -0.5 -12 c2.5 1 3.5 7 0.5 12" fill="currentColor" />
                    </g>
                  </g>

                  {/* ROTOR 2 (Front Rotor - Counter-Clockwise) */}
                  <g
                    className={`origin-[20px_20px] ${
                      isBlowing
                        ? 'animate-spin-reverse-fast'
                        : collectedCount > 0
                        ? 'animate-spin-reverse-slow'
                        : 'hover:animate-spin-reverse-medium'
                    }`}
                  >
                    <circle cx="20" cy="20" r="3.5" fill="currentColor" />
                    <g transform="rotate(60, 20, 20)">
                      <path d="M20 20 c-2 -3.5 -3 -9 0 -11 c2 1.5 2.5 6.5 0 11" fill="currentColor" />
                    </g>
                    <g transform="rotate(180, 20, 20)">
                      <path d="M20 20 c-2 -3.5 -3 -9 0 -11 c2 1.5 2.5 6.5 0 11" fill="currentColor" />
                    </g>
                    <g transform="rotate(300, 20, 20)">
                      <path d="M20 20 c-2 -3.5 -3 -9 0 -11 c2 1.5 2.5 6.5 0 11" fill="currentColor" />
                    </g>
                  </g>
                </g>
              </svg>
            )}

            {/* FAN OPTION C: Sleek Aircraft Propeller */}
            {fanType === 'propeller' && (
              <svg
                className={`w-11 h-11 transition-all duration-300 ${
                  collectedCount > 0 ? 'text-dasi-alice-400 scale-105' : 'text-dasi-steel-500'
                }`}
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Sleek bracket support */}
                <path d="M52 24 c2 0 3 2 3 5 v6 c0 3 -1 5 -3 5" strokeWidth="2" />
                <path d="M52 32 c-4 0 -8 -1 -12 -5" strokeWidth="2" />
                
                {/* Minimalist open casing (safety outline ring with support struts) */}
                <circle cx="24" cy="20" r="18" strokeWidth="1" strokeDasharray="4 4" className="opacity-25" />
                <path d="M24 2 v4 M24 38 v-4 M6 20 h4 M42 20 h-4" strokeWidth="1" className="opacity-30" />

                {/* Rotating Propeller blades */}
                <g
                  className={`origin-[24px_20px] ${
                    isBlowing
                      ? 'animate-[spin_0.14s_linear_infinite]'
                      : collectedCount > 0
                      ? 'animate-[spin_1.4s_linear_infinite]'
                      : 'hover:animate-[spin_0.5s_linear_infinite]'
                  }`}
                >
                  {/* Pointed nosecone hub */}
                  <circle cx="24" cy="20" r="5.5" fill="currentColor" />
                  
                  {/* 3 long aerodynamic blades */}
                  <g transform="rotate(0, 24, 20)">
                    <path d="M24 20 c-2.2 -5 -4 -13 0 -17 c3 2 3.2 9.5 0 17" fill="currentColor" />
                  </g>
                  <g transform="rotate(120, 24, 20)">
                    <path d="M24 20 c-2.2 -5 -4 -13 0 -17 c3 2 3.2 9.5 0 17" fill="currentColor" />
                  </g>
                  <g transform="rotate(240, 24, 20)">
                    <path d="M24 20 c-2.2 -5 -4 -13 0 -17 c3 2 3.2 9.5 0 17" fill="currentColor" />
                  </g>
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
    <main className="min-h-screen w-full bg-dasi-black-950 text-white flex flex-col items-center py-20 px-6 font-sans">
      <div className="max-w-6xl w-full flex flex-col gap-4">
        {/* Header */}
        <div className="border-b border-white/10 pb-6 mb-4">
          <h1 className="text-4xl font-black tracking-wider text-dasi-alice-400">
            FAN MODEL TESTING GROUND
          </h1>
          <p className="text-sm text-dasi-steel-400 mt-2 max-w-3xl leading-relaxed">
            Compare three new fan visual styles below. All options are configured with the approved 
            <strong> Speed Lines breeze effect</strong> and wind return physics.
          </p>
        </div>

        {/* 3 Sandbox columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FanSandboxItem
            title="Option A: Cyberpunk Vented Exhaust"
            description="An industrial octagonal turbine design rotating behind horizontal security safety mesh bars."
            fanType="exhaust"
          />

          <FanSandboxItem
            title="Option B: Dual-Rotor Coaxial"
            description="Features overlapping coaxial rotors counter-rotating in opposite directions for an advanced visual."
            fanType="coaxial"
          />

          <FanSandboxItem
            title="Option C: Sleek Aircraft Propeller"
            description="A minimalist open-air casing design focused on long aerodynamic blades spinning around a nosecone."
            fanType="propeller"
          />
        </div>

        {/* Sandbox details */}
        <div className="mt-8 p-6 bg-dasi-alice-950/10 border border-white/5 rounded-2xl">
          <h4 className="text-sm font-bold uppercase tracking-widest text-dasi-alice-400 mb-2">Testing Notes:</h4>
          <ul className="list-disc list-inside text-xs text-dasi-steel-400 space-y-2 leading-relaxed">
            <li><strong>Option B Counter-Rotation:</strong> Front rotor and back rotor spin in opposite vectors. The front rotor uses custom counter-clockwise keyframes.</li>
            <li><strong>Symmetry Calibration:</strong> Blade shapes are centered precisely to ensure rotations are perfectly smooth at high speeds.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
