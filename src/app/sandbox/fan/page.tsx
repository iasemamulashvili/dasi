'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Play, Volume2, VolumeX, X, Trophy, Monitor, Cpu, Sparkles, ArrowRight } from 'lucide-react';

// Helper component for each sandbox option to keep states isolated
function FanSandboxItem({
  title,
  description,
  fanType,
}: {
  title: string;
  description: string;
  fanType: 'turbine' | 'portal' | 'propeller' | 'shield-frame' | 'shield-blade' | 'vortex';
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
        <h3 className="text-base font-bold text-bright-snow font-russo-one tracking-wide">{title}</h3>
        <p className="text-xs text-alabaster-grey/70 mt-1 font-outfit leading-relaxed">{description}</p>
      </div>

      {/* Interactive letter collector pool */}
      <div className="flex gap-1.5 select-none text-3xl font-black justify-center items-center h-20 border border-graphite-light bg-carbon-black rounded-xl relative font-russo-one">
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
          <div className="absolute top-2 left-3 text-[9px] uppercase tracking-widest text-slate-violet-light font-bold animate-pulse font-silkscreen">
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

            {/* FAN OPTION D: Shield Frame Turbine (Logo Frame) */}
            {fanType === 'shield-frame' && (
              <svg
                className={`w-11 h-11 transition-all duration-300 ${
                  collectedCount > 0 ? 'text-platinum-silver scale-105' : 'text-alabaster-grey/60'
                }`}
                viewBox="0 0 100 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Shield Outline Casing */}
                <path d="M 20 20 L 80 20 L 80 50 C 80 72 65 88 50 95 C 35 88 20 72 20 50 Z" />
                <circle cx="50" cy="48" r="22" strokeWidth="1.5" strokeDasharray="4 3" className="opacity-30" />
                
                {/* Spinning turbine inside shield */}
                <g
                  className={`origin-[50px_48px] ${
                    isBlowing
                      ? 'animate-[spin_0.12s_linear_infinite]'
                      : collectedCount > 0
                      ? 'animate-[spin_1.2s_linear_infinite]'
                      : 'hover:animate-[spin_0.5s_linear_infinite]'
                  }`}
                >
                  <circle cx="50" cy="48" r="6.5" fill="currentColor" />
                  {[0, 60, 120, 180, 240, 300].map((angle) => (
                    <g key={angle} transform={`rotate(${angle}, 50, 48)`}>
                      <path d="M50 48 c-3.5 -5 -5.5 -16 0 -20 c2.5 2 3.5 10 0 20" fill="currentColor" />
                    </g>
                  ))}
                </g>
              </svg>
            )}

            {/* FAN OPTION E: Shield Blade Propeller (Logo Blades) */}
            {fanType === 'shield-blade' && (
              <svg
                className={`w-11 h-11 transition-all duration-300 ${
                  collectedCount > 0 ? 'text-platinum-silver scale-105' : 'text-alabaster-grey/60'
                }`}
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Thin outer circular casing */}
                <circle cx="32" cy="32" r="26" strokeWidth="1.5" />
                
                {/* Spinning blades shaped like the Dasi shield */}
                <g
                  className={`origin-[32px_32px] ${
                    isBlowing
                      ? 'animate-[spin_0.14s_linear_infinite]'
                      : collectedCount > 0
                      ? 'animate-[spin_1.4s_linear_infinite]'
                      : 'hover:animate-[spin_0.5s_linear_infinite]'
                  }`}
                >
                  <circle cx="32" cy="32" r="5.5" fill="currentColor" />
                  {[0, 120, 240].map((angle) => (
                    <g key={angle} transform={`rotate(${angle}, 32, 32)`}>
                      {/* Shield shape blade */}
                      <path d="M 26 6 L 38 6 L 38 16 C 38 21 35 24 32 26 C 29 24 26 21 26 16 Z" fill="currentColor" stroke="none" />
                      {/* Connector shank */}
                      <line x1="32" y1="26" x2="32" y2="32" stroke="currentColor" strokeWidth="2.5" />
                    </g>
                  ))}
                </g>
              </svg>
            )}

            {/* FAN OPTION F: Vortex Singularity (Hypnotic Spiral) */}
            {fanType === 'vortex' && (
              <svg
                className={`w-11 h-11 transition-all duration-300 ${
                  collectedCount > 0 ? 'text-platinum-silver scale-105' : 'text-alabaster-grey/60'
                }`}
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {/* Double outer ring */}
                <circle cx="32" cy="32" r="27" strokeWidth="1.5" />
                <circle cx="32" cy="32" r="24" strokeWidth="0.5" className="opacity-25" />
                
                {/* Concentric spiral vortex */}
                <g
                  className={`origin-[32px_32px] ${
                    isBlowing
                      ? 'animate-[spin_0.15s_linear_infinite]'
                      : collectedCount > 0
                      ? 'animate-[spin_1.5s_linear_infinite]'
                      : 'hover:animate-[spin_0.6s_linear_infinite]'
                  }`}
                >
                  <circle cx="32" cy="32" r="4.5" fill="currentColor" />
                  {[0, 60, 120, 180, 240, 300].map((angle) => (
                    <g key={angle} transform={`rotate(${angle}, 32, 32)`}>
                      {/* Sweeping logarithmic curved blade */}
                      <path d="M 32 32 C 32 20, 23 13, 17 15 C 13 17, 19 26, 32 32" fill="currentColor" stroke="none" className="opacity-90" />
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

// --- Featured Showcase Video Variations Sandbox Component ---
interface SandboxGame {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  accent: string;
  accentMuted: string;
  bgGradient: string;
  videoSrc: string;
  image: string;
  stats: {
    activePlayers: string;
    rating: string;
    downloads: string;
    engine: string;
  };
}

const sandboxGames: SandboxGame[] = [
  {
    id: 'crown-quest',
    title: 'Crown Quest',
    subtitle: 'Epic Action RPG Adventure',
    description: 'Embark on an epic fantasy RPG quest. Command legendary heroes, conquer tactical grid battles, and construct your royal stronghold in a war-torn kingdom.',
    accent: 'var(--color-platinum-silver)',
    accentMuted: 'var(--color-slate-violet)',
    bgGradient: 'from-graphite/30 via-carbon-black-2/40 to-[#181818]',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-playing-a-video-game-41584-large.mp4',
    image: '/crown-quest.png',
    stats: {
      activePlayers: '1.2M+',
      rating: '4.8',
      downloads: '5M+',
      engine: 'Unity 3D'
    }
  },
  {
    id: 'lumber-chopper',
    title: 'Lumber Chopper',
    subtitle: 'Idle Wood Empire Tycoon',
    description: 'Harvest resources, optimize lumber mills, and build a massive wood-chopping dynasty. Automate operations and manage supply chains in this highly addictive idle tycoon.',
    accent: 'var(--color-muted-green)',
    accentMuted: 'var(--color-slate-violet)',
    bgGradient: 'from-muted-green/20 via-carbon-black-2/40 to-[#181818]',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-cutting-log-with-chainsaw-in-forest-41618-large.mp4',
    image: '/lumber-chopper.png',
    stats: {
      activePlayers: '850K+',
      rating: '4.6',
      downloads: '3M+',
      engine: 'Cocos Creator'
    }
  },
  {
    id: 'hotel-manager',
    title: 'Hotel Manager',
    subtitle: '5-Star Luxury Resort Simulator',
    description: 'Design, build, and run a 5-star luxury resort empire. Hire world-class chefs, staff, and design stunning suites to keep VIP clients happy and maximize profits.',
    accent: 'var(--color-slate-violet-light)',
    accentMuted: 'var(--color-slate-violet)',
    bgGradient: 'from-slate-violet/20 via-carbon-black-2/40 to-[#181818]',
    videoSrc: 'https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-hotel-swimming-pool-and-palm-trees-48744-large.mp4',
    image: '/hotel-manager.png',
    stats: {
      activePlayers: '500K+',
      rating: '4.5',
      downloads: '1.5M+',
      engine: 'Unity 2D'
    }
  }
];

function ShowcaseSandbox() {
  const [activeGameIndex, setActiveGameIndex] = useState(0);
  const activeGame = sandboxGames[activeGameIndex];

  // Sound state for Variation A
  const [isMutedA, setIsMutedA] = useState(true);

  // Portal State for Variation B
  const [isPortalOpen, setIsPortalOpen] = useState(false);
  const portalVideoRef = useRef<HTMLVideoElement>(null);

  // Trigger sound logic on Variation B portal
  useEffect(() => {
    if (isPortalOpen && portalVideoRef.current) {
      portalVideoRef.current.play().catch(e => console.log("Autoplay blocked", e));
    }
  }, [isPortalOpen]);

  return (
    <div className="flex flex-col gap-12 max-w-6xl w-full">
      {/* Selector of Active Game */}
      <div className="flex bg-carbon-black-2 border border-graphite-light p-1.5 rounded-2xl w-max gap-2 self-center shadow-lg">
        {sandboxGames.map((g, idx) => (
          <button
            key={g.id}
            onClick={() => {
              setActiveGameIndex(idx);
              setIsPortalOpen(false);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-silkscreen tracking-wider font-semibold transition-all cursor-pointer ${
              activeGameIndex === idx
                ? 'bg-slate-violet text-bright-snow shadow-lg shadow-slate-violet/10'
                : 'text-alabaster-grey/60 hover:text-bright-snow'
            }`}
          >
            {g.title.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= VARIATION A: CINEMATIC SPLIT-PANE ================= */}
        <div className="bg-carbon-black-2 border border-graphite-light rounded-2xl p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-violet/10 border border-slate-violet/20 px-2 py-0.5 rounded text-[8px] font-silkscreen text-slate-violet-light uppercase tracking-wider font-bold">
            <Sparkles size={8} /> Variation A
          </div>

          <div>
            <h3 className="text-lg font-bold font-russo-one tracking-wide text-bright-snow uppercase">
              Cinematic Split-Pane
            </h3>
            <p className="text-xs text-alabaster-grey/70 mt-1 leading-relaxed font-outfit">
              Floating glassmorphic loop preview card sits next to the description panel. Ideal for passive engagement.
            </p>
          </div>

          {/* Slider Mockup Layout */}
          <div className="bg-carbon-black border border-graphite-light rounded-xl p-5 flex flex-col gap-5 min-h-[380px] justify-between relative overflow-hidden">
            {/* Title / Description */}
            <div className="flex flex-col gap-2 z-10 max-w-[55%]">
              <span className="text-[9px] font-silkscreen text-slate-violet-light uppercase tracking-widest">
                {activeGame.subtitle}
              </span>
              <h4 className="text-2xl font-bold font-russo-one tracking-wider text-bright-snow uppercase">
                {activeGame.title}
              </h4>
              <p className="text-xs text-alabaster-grey/60 leading-relaxed font-outfit">
                {activeGame.description}
              </p>
            </div>

            {/* Floating Glassmorphic Loop Video Card */}
            <div className="absolute right-5 top-1/2 -translate-y-1/2 w-[40%] h-[80%] bg-carbon-black-2/80 backdrop-blur-md border border-graphite-light/60 rounded-xl overflow-hidden shadow-xl z-20 transition-all duration-300 hover:scale-105 flex flex-col justify-end">
              {/* Gameplay Video Player */}
              <video
                key={activeGame.id}
                src={activeGame.videoSrc}
                autoPlay
                loop
                muted={isMutedA}
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Speaker / Mute Toggle Button */}
              <button
                onClick={() => setIsMutedA(!isMutedA)}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-black/80 rounded-lg text-bright-snow backdrop-blur-md border border-white/10 transition-all z-30 cursor-pointer"
                title={isMutedA ? "Unmute Gameplay Audio" : "Mute Gameplay Audio"}
              >
                {isMutedA ? <VolumeX size={12} /> : <Volume2 size={12} className="text-slate-violet-light" />}
              </button>

              {/* Overlay HUD Tag */}
              <div className="bg-gradient-to-t from-black/80 to-transparent p-3 pt-6 z-10 text-[8px] font-silkscreen text-platinum-silver tracking-widest flex items-center gap-1.5 uppercase select-none">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-violet animate-ping" />
                LIVE PREVIEW
              </div>
            </div>

            {/* Specs Footer */}
            <div className="border-t border-graphite-light/40 pt-4 flex gap-4 text-[9px] font-silkscreen text-alabaster-grey/50 z-10">
              <div>ENGINE: <span className="text-bright-snow">{activeGame.stats.engine}</span></div>
              <div>DOWNLOADS: <span className="text-bright-snow">{activeGame.stats.downloads}</span></div>
            </div>
          </div>
        </div>

        {/* ================= VARIATION B: ARCADE PORTAL VENT ================= */}
        <div className="bg-carbon-black-2 border border-graphite-light rounded-2xl p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-muted-green/10 border border-muted-green/20 px-2 py-0.5 rounded text-[8px] font-silkscreen text-muted-green-light uppercase tracking-wider font-bold">
            <Monitor size={8} /> Variation B
          </div>

          <div>
            <h3 className="text-lg font-bold font-russo-one tracking-wide text-bright-snow uppercase">
              Arcade Terminal Portal
            </h3>
            <p className="text-xs text-alabaster-grey/70 mt-1 leading-relaxed font-outfit">
              Displays a prominent "Boot Gameplay" console prompt on slide. Hovering/clicking launches an immersive CRT terminal.
            </p>
          </div>

          {/* Slider Mockup Layout */}
          <div className="bg-carbon-black border border-graphite-light rounded-xl p-5 flex flex-col gap-5 min-h-[380px] justify-between relative overflow-hidden">
            {/* Description Info */}
            <div className="flex flex-col gap-2 z-10">
              <span className="text-[9px] font-silkscreen text-slate-violet-light uppercase tracking-widest">
                {activeGame.subtitle}
              </span>
              <h4 className="text-2xl font-bold font-russo-one tracking-wider text-bright-snow uppercase">
                {activeGame.title}
              </h4>
              <p className="text-xs text-alabaster-grey/60 leading-relaxed font-outfit max-w-[80%]">
                {activeGame.description}
              </p>
            </div>

            {/* Interactive Boot Prompt Trigger */}
            <div className="my-auto self-center z-10 flex flex-col items-center gap-3">
              <button
                onClick={() => setIsPortalOpen(true)}
                className="group flex items-center gap-3 px-6 py-3.5 bg-slate-violet hover:bg-slate-violet-light border border-slate-violet-light/30 rounded-xl text-xs font-silkscreen tracking-widest text-bright-snow font-semibold transition-all shadow-xl hover:scale-105 cursor-pointer uppercase select-none"
              >
                <Monitor size={14} className="animate-pulse" />
                BOOT GAMEPLAY PREVIEW
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <span className="text-[8px] font-silkscreen text-alabaster-grey/40 uppercase tracking-widest">
                Requires direct operator signal
              </span>
            </div>

            {/* Portal Overlay Frame (Variation B Overlay Screen) */}
            {isPortalOpen && (
              <div className="absolute inset-0 bg-[#0d0d11] z-30 p-4 flex flex-col justify-between border-2 border-slate-violet animate-fadeIn">
                {/* CRT Glass Scanline overlay effect */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-40 z-20" />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] opacity-85 z-20" />

                <div className="flex items-center justify-between border-b border-slate-violet/20 pb-2 z-10">
                  <span className="text-[8px] font-silkscreen text-slate-violet-light tracking-widest uppercase flex items-center gap-1.5">
                    <Cpu size={10} className="text-slate-violet-light animate-spin" />
                    STREAMING LINK PORTAL: {activeGame.title}
                  </span>
                  <button
                    onClick={() => setIsPortalOpen(false)}
                    className="p-1 bg-graphite hover:bg-rose-950/30 border border-graphite-light hover:border-rose-500/30 rounded text-alabaster-grey hover:text-rose-400 transition-all cursor-pointer"
                  >
                    <X size={10} />
                  </button>
                </div>

                <div className="flex-1 my-4 rounded border border-graphite-light overflow-hidden bg-black relative flex items-center justify-center">
                  <video
                    ref={portalVideoRef}
                    src={activeGame.videoSrc}
                    loop
                    className="w-full h-full object-cover filter brightness-[1.1] contrast-[1.05]"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/60 px-2 py-1 border border-white/10 rounded text-[7px] font-silkscreen text-bright-snow">
                    SYSTEM STATUS: ACTIVE [AUDIO ON]
                  </div>
                </div>

                <div className="flex items-center justify-between text-[7px] font-silkscreen text-alabaster-grey/40 z-10 border-t border-slate-violet/20 pt-2 uppercase">
                  <span>DASI PORTAL DECODER v1.0</span>
                  <span>TAP X IN CORNER TO EXIT CHANNEL</span>
                </div>
              </div>
            )}

            {/* Specs Footer */}
            <div className="border-t border-graphite-light/40 pt-4 flex gap-4 text-[9px] font-silkscreen text-alabaster-grey/50 z-10">
              <div>ENGINE: <span className="text-bright-snow">{activeGame.stats.engine}</span></div>
              <div>DOWNLOADS: <span className="text-bright-snow">{activeGame.stats.downloads}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FanSandboxPage() {
  const [activeTab, setActiveTab] = useState<'fans' | 'showcase'>('fans');

  return (
    <main className="min-h-screen w-full bg-carbon-black text-bright-snow flex flex-col items-center py-20 px-6 font-sans">
      <div className="max-w-6xl w-full flex flex-col gap-6">
        {/* Toggle Mode Selector */}
        <div className="flex bg-carbon-black-2 border border-graphite-light p-1 rounded-2xl w-max self-start shadow-xl">
          <button
            onClick={() => setActiveTab('fans')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-silkscreen tracking-wider font-semibold transition-all cursor-pointer ${
              activeTab === 'fans'
                ? 'bg-graphite text-bright-snow'
                : 'text-alabaster-grey/60 hover:text-bright-snow'
            }`}
          >
            <Cpu size={14} />
            FAN MODELS SANDBOX
          </button>
          <button
            onClick={() => setActiveTab('showcase')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-silkscreen tracking-wider font-semibold transition-all cursor-pointer ${
              activeTab === 'showcase'
                ? 'bg-graphite text-bright-snow'
                : 'text-alabaster-grey/60 hover:text-bright-snow'
            }`}
          >
            <Monitor size={14} />
            SHOWCASE VIDEO VARIATIONS
          </button>
        </div>

        {/* Tab Header */}
        <div className="border-b border-graphite-light pb-6 mb-4">
          <h1 className="text-4xl font-bold tracking-wider text-bright-snow font-russo-one uppercase">
            {activeTab === 'fans' ? 'Fan Model Testing Ground' : 'Spotlight Showcase Video Variations'}
          </h1>
          <p className="text-sm text-alabaster-grey mt-2 max-w-3xl leading-relaxed font-outfit">
            {activeTab === 'fans'
              ? 'Compare six completely stand-less fan designs below. All options are designed to sit flush within the release box and feature the contained Speed Lines breeze effect.'
              : 'Interact with two different user experience models designed to resolve the gameplay video playback issue on the Spotlight displacement slider.'}
          </p>
        </div>

        {/* Tab 1: Fans */}
        {activeTab === 'fans' && (
          <>
            {/* 6 Sandbox cards in a responsive grid */}
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

              <FanSandboxItem
                title="Option D: Shield Frame Turbine"
                description="A custom casing shaped like the Dasi Games shield logo, with 6 curved turbine blades spinning inside the crest."
                fanType="shield-frame"
              />

              <FanSandboxItem
                title="Option E: Shield Blade Propeller"
                description="A circular casing containing a 3-blade propeller where each individual blade is modeled after the Dasi Games shield logo."
                fanType="shield-blade"
              />

              <FanSandboxItem
                title="Option F: Vortex Singularity"
                description="A sci-fi centrifugal vent featuring 6 sweeping logarithmic spiral blades that create a hypnotic 3D depth illusion."
                fanType="vortex"
              />
            </div>

            {/* Sandbox details */}
            <div className="mt-8 p-6 bg-carbon-black-2 border border-graphite-light rounded-2xl font-outfit">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-violet-light mb-2 font-silkscreen">Testing Notes:</h4>
              <ul className="list-disc list-inside text-xs text-alabaster-grey space-y-2 leading-relaxed">
                <li><strong>Contained Airflow:</strong> Notice how the speed lines animate entirely inside the boundaries of the release box, clipping at the left border.</li>
                <li><strong>Stand-less Integration:</strong> The fans have no stands, necks, or brackets, looking like a built-in exhaust port.</li>
                <li><strong>Logo Branding (Options D & E):</strong> The shield geometry is mathematically scaled to match the exact proportions of the Dasi Games shield icon.</li>
              </ul>
            </div>
          </>
        )}

        {/* Tab 2: Showcase Variations */}
        {activeTab === 'showcase' && <ShowcaseSandbox />}
      </div>
    </main>
  );
}
