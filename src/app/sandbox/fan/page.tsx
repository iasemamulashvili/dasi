'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Play, Volume2, VolumeX, X, Monitor, Cpu, Sparkles, Trophy, ArrowRight } from 'lucide-react';

// Official App Store & Google Play Store SVG Icons
const AppStoreIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 384 512" fill="currentColor" className={className}>
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.7-22.9-76.9-22.4-36.6.6-70.3 21.6-89.2 54.2-38 65.9-9.8 162.8 27.3 216.3 18.2 26.2 39.8 55.3 68.2 54.2 27.2-1.1 37.5-17.6 68.5-17.6 31.1 0 40.4 17.6 68.8 17.1 29-1 48.2-26.4 66.2-52.7 21-30.7 29.7-60.4 30.2-62-1-1-65.2-25.1-65.7-100zM281.2 81.7c15.2-18.3 25.4-43.9 22.6-69.5-22 1-48.8 14.8-64.6 33.2-13.8 15.9-25.9 41.7-22.7 67 24.5 2 49.7-12.4 64.7-30.7z" />
  </svg>
);

const PlayStoreIcon = ({ className = "w-3.5 h-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 512 512" fill="currentColor" className={className}>
    <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58 33.3 60.1 60.1L512 288c0-22-13.7-47.8-40-62.4zM325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z" />
  </svg>
);

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

function WebGLFeaturedSliderSandbox({ variant }: { variant: 'C' | 'D' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const customCursorRef = useRef<HTMLDivElement>(null);
  
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cursorHovered, setCursorHovered] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  
  const transitionRef = useRef({ active: false });
  const activeIndexRef = useRef(0);
  
  // Fallback CSS fade system state
  const [prevIndex, setPrevIndex] = useState(0);
  const [fadeProgress, setFadeProgress] = useState(0);

  // WebGL Context References
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const texturesRef = useRef<WebGLTexture[]>([]);
  const uProgressLocRef = useRef<WebGLUniformLocation | null>(null);
  const uCanvasSizeLocRef = useRef<WebGLUniformLocation | null>(null);
  const uTexture1LocRef = useRef<WebGLUniformLocation | null>(null);
  const uTexture2LocRef = useRef<WebGLUniformLocation | null>(null);

  // Variation C - Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Variation D - Inline morphing video player state
  const [showVideoInline, setShowVideoInline] = useState(false);
  const [isInlineMuted, setIsInlineMuted] = useState(true);
  const inlineVideoRef = useRef<HTMLVideoElement>(null);

  // Update activeIndexRef on change
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  // Setup WebGL engine once on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    if (!gl) {
      console.warn("WebGL not supported in this browser, using CSS displacement fallback.");
      setWebglSupported(false);
      setLoading(false);
      return;
    }
    glRef.current = gl;

    // Shader Source Code
    const vsSource = `
      attribute vec2 position;
      varying vec2 v_texCoord;
      void main() {
        v_texCoord = position * 0.5 + 0.5;
        v_texCoord.y = 1.0 - v_texCoord.y; // Flip coordinates
        gl_Position = vec4(position, 0.0, 1.0);
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec2 v_texCoord;
      uniform sampler2D u_texture1;
      uniform sampler2D u_texture2;
      uniform float u_progress;
      uniform vec2 u_canvasSize;

      // Cover scaling helper
      vec2 getCoverUV(vec2 uv, vec2 canvasSize, vec2 imgSize) {
        float cRatio = canvasSize.x / canvasSize.y;
        float iRatio = imgSize.x / imgSize.y;
        vec2 scale = vec2(1.0);
        if (cRatio > iRatio) {
          scale.y = iRatio / cRatio;
        } else {
          scale.x = cRatio / iRatio;
        }
        return (uv - 0.5) * scale + 0.5;
      }

      // Procedural noise for displacement map
      float rand(vec2 co) {
        return fract(sin(dot(co, vec2(12.71, 31.17))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 ip = floor(p);
        vec2 fp = fract(p);
        vec2 u = fp * fp * (3.0 - 2.0 * fp);
        return mix(
          mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
          mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x),
          u.y
        );
      }

      void main() {
        vec2 uv = v_texCoord;
        vec2 canvasRatio = u_canvasSize;
        vec2 imageRatio = vec2(1920.0, 1080.0); // Widescreen baseline
        
        vec2 uv1 = getCoverUV(uv, canvasRatio, imageRatio);
        vec2 uv2 = getCoverUV(uv, canvasRatio, imageRatio);

        // Dynamic wave liquid morph factor
        float waveNoise = noise(uv * 12.0 + vec2(u_progress * 2.0, u_progress * 1.5)) * 0.1;
        
        // Displace lookups in opposite vectors based on transition step
        vec2 dist1 = uv1 + vec2(waveNoise * u_progress, waveNoise * u_progress);
        vec2 dist2 = uv2 - vec2(waveNoise * (1.0 - u_progress), waveNoise * (1.0 - u_progress));

        vec4 col1 = texture2D(u_texture1, dist1);
        vec4 col2 = texture2D(u_texture2, dist2);

        gl_FragColor = mix(col1, col2, u_progress);
      }
    `;

    // Compile Vertex Shader
    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) return;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(vs));
      setWebglSupported(false);
      setLoading(false);
      return;
    }

    // Compile Fragment Shader
    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) return;
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(fs));
      setWebglSupported(false);
      setLoading(false);
      return;
    }

    // Create & link Program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      setWebglSupported(false);
      setLoading(false);
      return;
    }
    gl.useProgram(program);
    programRef.current = program;

    // Geometry vertices (Quad covering screen)
    const vertices = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const positionAttr = gl.getAttribLocation(program, 'position');
    gl.enableVertexAttribArray(positionAttr);
    gl.vertexAttribPointer(positionAttr, 2, gl.FLOAT, false, 0, 0);

    // Cache Uniform locations
    uProgressLocRef.current = gl.getUniformLocation(program, 'u_progress');
    uCanvasSizeLocRef.current = gl.getUniformLocation(program, 'u_canvasSize');
    uTexture1LocRef.current = gl.getUniformLocation(program, 'u_texture1');
    uTexture2LocRef.current = gl.getUniformLocation(program, 'u_texture2');

    // Load textures
    const imageUrls = sandboxGames.map(g => g.image);
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const handleLoadedImages = (imgs: HTMLImageElement[]) => {
      texturesRef.current = imgs.map((img) => {
        const tex = gl.createTexture();
        if (!tex) throw new Error("Failed texture allocation");
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
        return tex;
      });

      setLoading(false);
      drawWebGL(0, 0, 0);
    };

    imageUrls.forEach((url, i) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        loadedImages[i] = img;
        loadedCount++;
        if (loadedCount === imageUrls.length) {
          handleLoadedImages(loadedImages);
        }
      };
      img.onerror = () => {
        const canvasFallback = document.createElement('canvas');
        canvasFallback.width = 512;
        canvasFallback.height = 512;
        const fallbackCtx = canvasFallback.getContext('2d');
        if (fallbackCtx) {
          const g = fallbackCtx.createLinearGradient(0, 0, 512, 512);
          if (i === 0) { g.addColorStop(0, '#f1c40f'); g.addColorStop(1, '#e05a36'); }
          else if (i === 1) { g.addColorStop(0, '#2ecc71'); g.addColorStop(1, '#27ae60'); }
          else { g.addColorStop(0, '#3498db'); g.addColorStop(1, '#9b59b6'); }
          fallbackCtx.fillStyle = g;
          fallbackCtx.fillRect(0, 0, 512, 512);
        }
        const fallbackImg = new Image();
        fallbackImg.src = canvasFallback.toDataURL();
        fallbackImg.onload = () => {
          loadedImages[i] = fallbackImg;
          loadedCount++;
          if (loadedCount === imageUrls.length) {
            handleLoadedImages(loadedImages);
          }
        };
      };
    });

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      drawWebGL(activeIndexRef.current, activeIndexRef.current, 0);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  const drawWebGL = (currIdx: number, targetIdx: number, progress: number) => {
    const gl = glRef.current;
    const program = programRef.current;
    const textures = texturesRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || textures.length === 0 || !canvas) return;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[currIdx]);
    if (uTexture1LocRef.current) gl.uniform1i(uTexture1LocRef.current, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[targetIdx]);
    if (uTexture2LocRef.current) gl.uniform1i(uTexture2LocRef.current, 1);

    if (uProgressLocRef.current) gl.uniform1f(uProgressLocRef.current, progress);
    if (uCanvasSizeLocRef.current) gl.uniform2f(uCanvasSizeLocRef.current, canvas.width, canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const transitionTo = (targetIdx: number) => {
    if (targetIdx === activeIndexRef.current || transitionRef.current.active) return;
    transitionRef.current.active = true;

    const currentIdx = activeIndexRef.current;
    setPrevIndex(currentIdx);
    setActiveIndex(targetIdx);
    
    // Auto-close portal/video inline on slide transition
    if (variant === 'C') {
      setIsModalOpen(false);
    } else if (variant === 'D') {
      setShowVideoInline(false);
    }

    const animationObj = { progress: 0 };

    gsap.to(animationObj, {
      progress: 1,
      duration: 1.3,
      ease: 'power2.inOut',
      onUpdate: () => {
        setFadeProgress(animationObj.progress);
        if (webglSupported) {
          drawWebGL(currentIdx, targetIdx, animationObj.progress);
        }
      },
      onComplete: () => {
        transitionRef.current.active = false;
        setPrevIndex(targetIdx);
        setFadeProgress(0);
        if (webglSupported) {
          drawWebGL(targetIdx, targetIdx, 0);
        }
      }
    });

    const container = sliderRef.current;
    if (container) {
      gsap.fromTo(
        container.querySelectorAll('.slider-hud-element'),
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.08, delay: 0.1 }
      );
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (customCursorRef.current) {
      customCursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }
  };

  // Keyboard and Focus Management for Variation C Modal
  useEffect(() => {
    if (isModalOpen && variant === 'C') {
      closeBtnRef.current?.focus();
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen, variant]);

  // Video Autoplay Trigger for Variation C
  useEffect(() => {
    if (isModalOpen && modalVideoRef.current && variant === 'C') {
      modalVideoRef.current.play().catch(e => console.log("Autoplay blocked", e));
    }
  }, [isModalOpen, activeIndex, variant]);

  // Video Autoplay Trigger for Variation D
  useEffect(() => {
    if (showVideoInline && inlineVideoRef.current && variant === 'D') {
      inlineVideoRef.current.play().catch(e => console.log("Autoplay blocked", e));
    } else if (!showVideoInline && inlineVideoRef.current && variant === 'D') {
      inlineVideoRef.current.pause();
    }
  }, [showVideoInline, activeIndex, variant]);

  const activeGame = sandboxGames[activeIndex];

  return (
    <div 
      ref={sliderRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setCursorHovered(true)}
      onMouseLeave={() => setCursorHovered(false)}
      className="relative w-full h-[500px] md:h-[600px] bg-carbon-black border border-graphite-light rounded-2xl overflow-hidden flex flex-col justify-end p-8 md:p-12 cursor-none select-none slider-glow"
    >
      <style>{`
        @keyframes crt-flicker {
          0% { opacity: 0.98; }
          50% { opacity: 1; }
          100% { opacity: 0.99; }
        }
        @keyframes crt-scanlines {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 5px rgba(120, 119, 198, 0.4); }
          50% { box-shadow: 0 0 15px rgba(120, 119, 198, 0.8); }
          100% { box-shadow: 0 0 5px rgba(120, 119, 198, 0.4); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-crt-flicker {
          animation: crt-flicker 0.15s infinite;
        }
        .animate-crt-scanlines {
          animation: crt-scanlines 6s linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite ease-in-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>

      {/* Loading Spinner */}
      {loading && (
        <div className="absolute inset-0 bg-[#181818] z-50 flex flex-col items-center justify-center gap-2">
          <span className="w-6 h-6 rounded-full border-2 border-graphite-light border-t-slate-violet-light animate-spin" />
          <span className="text-[9px] font-silkscreen tracking-widest text-slate-violet-light animate-pulse">PRELOADING SHADERS & TEXTURES...</span>
        </div>
      )}

      {/* WebGL Canvas or Image Fallback */}
      {webglSupported ? (
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 w-full h-full">
          <img 
            src={sandboxGames[prevIndex].image} 
            alt={sandboxGames[prevIndex].title}
            className="absolute inset-0 w-full h-full object-cover" 
            style={{ 
              opacity: 1 - fadeProgress, 
              filter: `blur(${fadeProgress * 10}px)`
            }} 
          />
          <img 
            src={sandboxGames[activeIndex].image} 
            alt={sandboxGames[activeIndex].title}
            className="absolute inset-0 w-full h-full object-cover" 
            style={{ 
              opacity: fadeProgress, 
              filter: `blur(${(1 - fadeProgress) * 10}px)`
            }} 
          />
        </div>
      )}

      {/* Dark Overlay Vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-carbon-black via-carbon-black/45 to-carbon-black/50 z-10 pointer-events-none" />

      {/* Custom Retro Magnetic Wireframe Crosshair Cursor Overlay */}
      <div 
        ref={customCursorRef}
        className="absolute pointer-events-none z-40 hidden md:flex items-center justify-center"
        style={{ 
          top: 0,
          left: 0,
          opacity: cursorHovered ? 1 : 0,
          transform: `translate3d(0px, 0px, 0) translate(-50%, -50%)`,
          scale: cursorHovered ? '1' : '0.2',
          transition: 'opacity 0.2s ease, scale 0.2s ease'
        }}
      >
        <div className="relative w-16 h-16 flex items-center justify-center">
          {/* Outer dotted spinning wireframe ring */}
          <div 
            className="absolute inset-0 rounded-full border border-dashed animate-[spin_10s_linear_infinite]"
            style={{ 
              borderColor: 'var(--color-slate-violet-light)', 
              boxShadow: `0 0 12px var(--color-slate-violet)44` 
            }}
          />
          {/* Inner solid ring */}
          <div 
            className="absolute w-8 h-8 rounded-full border border-double"
            style={{ borderColor: 'var(--color-platinum-silver)' }}
          />
          {/* Crosshair target lines */}
          <div className="absolute w-5 h-[1px] bg-slate-violet-light" />
          <div className="absolute h-5 w-[1px] bg-slate-violet-light" />
          {/* HUD Target readout text */}
          <span 
            className="absolute top-10 font-sans text-[7px] bg-carbon-black/90 px-1.5 py-0.5 border border-graphite-light rounded text-bright-snow tracking-widest whitespace-nowrap"
          >
            LOCK: {activeGame.title.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Foreground Content HUD */}
      <div className="relative w-full h-full flex flex-col justify-end z-10 text-left pointer-events-none">
        {/* Title HUD Info (Left-aligned) or Inline Morphing Player */}
        <div className="flex flex-col z-20 transition-all duration-300 max-w-lg">
          
          {/* STATE 1: Text details block */}
          <div 
            className={`flex flex-col transition-all duration-500 ease-in-out ${
              showVideoInline 
                ? 'opacity-0 -translate-y-2 scale-95 pointer-events-none select-none h-0 overflow-hidden' 
                : 'opacity-100 translate-y-0 scale-100'
            }`}
          >
            <span className="slider-hud-element text-[9px] font-sans text-platinum-silver tracking-widest uppercase inline-flex items-center gap-1.5 mb-3.5 px-2 py-0.5 bg-graphite/50 border border-graphite-light/40 rounded-md w-fit">
              <span className="w-1 h-1 bg-platinum-silver rounded-full animate-ping" />
              {activeGame.subtitle.toUpperCase()}
            </span>
            <h3 className="slider-hud-element text-4xl md:text-6xl font-normal text-bright-snow uppercase tracking-wider mb-4 leading-none font-russo-one retro-heading-shadow">
              {activeGame.title}
            </h3>
            <p className="slider-hud-element text-xs md:text-sm text-alabaster-grey leading-relaxed mb-6 font-outfit font-light">
              {activeGame.description}
            </p>
            
            {/* Modern Specs HUD Panel with Real Game Stats */}
            <div className="slider-hud-element font-mono text-[9px] text-alabaster-grey/85 border border-graphite-light/60 bg-carbon-black-2/95 p-4 rounded-xl space-y-1.5 mt-2 mb-6 max-w-[280px] relative backdrop-blur-md shadow-lg">
              <div className="flex justify-between">
                <span>Engine:</span>
                <span className="text-platinum-silver font-bold">{activeGame.stats.engine}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Downloads:</span>
                <span className="text-platinum-silver font-bold">{activeGame.stats.downloads}</span>
              </div>
              <div className="flex justify-between">
                <span>Active Players:</span>
                <span className="text-platinum-silver font-bold">{activeGame.stats.activePlayers}</span>
              </div>
              <div className="flex justify-between">
                <span>Rating:</span>
                <span className="text-muted-green font-bold">{activeGame.stats.rating} ★</span>
              </div>
            </div>

            {/* Buttons Group */}
            <div className="slider-hud-element pointer-events-auto flex flex-wrap items-center gap-4">
              {variant === 'C' && (
                <button 
                  onClick={() => {
                    setIsModalMuted(false);
                    setIsModalOpen(true);
                  }}
                  className="inset-pixel-btn-primary group/btn inline-flex items-center py-2 px-4 cursor-pointer"
                >
                  <Play size={10} className="mr-2 fill-current" /> WATCH GAMEPLAY <ArrowRight size={10} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              )}

              {variant === 'D' && (
                <button 
                  onClick={() => {
                    setIsInlineMuted(false);
                    setShowVideoInline(true);
                  }}
                  className="inset-pixel-btn-primary group/btn inline-flex items-center py-2 px-4 cursor-pointer"
                >
                  <Play size={10} className="mr-2 fill-current" /> PLAY GAMEPLAY <ArrowRight size={10} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              )}

              {/* App Store and Google Play Download Links */}
              <div className="flex items-center gap-2">
                <a 
                  href="https://apps.apple.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-carbon-black/80 border border-graphite-light/60 hover:border-platinum-silver/80 rounded-md text-alabaster-grey hover:text-bright-snow transition-all hover:scale-105"
                  title="Download on the App Store"
                >
                  <AppStoreIcon className="w-3.5 h-3.5" />
                </a>
                <a 
                  href="https://play.google.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-carbon-black/80 border border-graphite-light/60 hover:border-platinum-silver/80 rounded-md text-alabaster-grey hover:text-bright-snow transition-all hover:scale-105"
                  title="Get it on Google Play"
                >
                  <PlayStoreIcon className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* STATE 2: Inline morphing video player card */}
          {variant === 'D' && (
            <div 
              className={`transition-all duration-500 ease-in-out origin-bottom-left ${
                showVideoInline 
                  ? 'opacity-100 scale-100 pointer-events-auto' 
                  : 'opacity-0 scale-90 translate-y-4 pointer-events-none select-none h-0 overflow-hidden'
              }`}
            >
              <div className="relative w-full max-w-[420px] aspect-video bg-carbon-black-2/95 border border-slate-violet/50 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(120,119,198,0.3)] p-3 flex flex-col gap-2">
                {/* Mini Header */}
                <div className="flex items-center justify-between border-b border-slate-violet/20 pb-1.5">
                  <span className="text-[8px] font-silkscreen text-slate-violet-light tracking-widest uppercase flex items-center gap-1.5 select-none">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-violet-light animate-ping" />
                    INLINE PREVIEW: {activeGame.title}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {/* Mute/Unmute */}
                    <button
                      onClick={() => setIsInlineMuted(!isInlineMuted)}
                      className="p-1.5 bg-graphite hover:bg-slate-800 border border-graphite-light rounded text-alabaster-grey hover:text-bright-snow transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-violet-light focus-visible:outline-none"
                      title={isInlineMuted ? "Unmute Audio" : "Mute Audio"}
                    >
                      {isInlineMuted ? <VolumeX size={10} /> : <Volume2 size={10} className="text-slate-violet-light animate-pulse" />}
                    </button>
                    {/* Back to details */}
                    <button
                      onClick={() => setShowVideoInline(false)}
                      className="px-2 py-1 bg-graphite hover:bg-slate-800 border border-graphite-light rounded text-[8px] font-silkscreen text-alabaster-grey hover:text-bright-snow transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-violet-light focus-visible:outline-none uppercase font-bold"
                    >
                      CLOSE PREVIEW
                    </button>
                  </div>
                </div>

                {/* Inline video display */}
                <div className="flex-1 rounded border border-graphite-light overflow-hidden bg-black relative">
                  {/* CRT scanline simulation overlay */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-25 z-10 animate-crt-flicker" />
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.5)_100%)] opacity-70 z-10" />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-slate-violet/5 to-transparent h-[10%] w-full z-10 animate-crt-scanlines" />

                  <video
                    ref={inlineVideoRef}
                    src={activeGame.videoSrc}
                    loop
                    muted={isInlineMuted}
                    playsInline
                    className="w-full h-full object-cover filter brightness-[1.05] contrast-[1.05]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Dot Indicators */}
      <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 pointer-events-auto">
        {sandboxGames.map((game, idx) => (
          <button
            key={game.id}
            onClick={() => transitionTo(idx)}
            className="group relative flex items-center justify-center w-12 h-12 rounded-full focus:outline-none cursor-pointer"
          >
            <span className="absolute right-full mr-4 bg-carbon-black border border-graphite-light px-3 py-1.5 rounded-lg text-[8px] font-sans text-alabaster-grey uppercase tracking-widest opacity-0 scale-75 origin-right transition-all group-hover:opacity-100 group-hover:scale-100 shadow-lg pointer-events-none">
              {game.title}
            </span>
            
            <span className={`text-[10px] font-sans ${
              activeIndex === idx ? 'text-bright-snow scale-125' : 'text-alabaster-grey group-hover:text-bright-snow transition-colors'
            }`}>
              0{idx + 1}
            </span>

            <span className={`absolute bottom-0 right-0 w-full h-full rounded-full border transition-all ${
              activeIndex === idx 
                ? 'border-platinum-silver scale-110' 
                : 'scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-95 border-graphite-light'
            }`} 
            />
          </button>
        ))}
      </div>

      {/* Cinematic Modal Overlay for Variation C */}
      {variant === 'C' && isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-label={`Gameplay Preview - ${activeGame.title}`}
        >
          {/* CRT Scanline & Screen Effects */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-40 z-20 animate-crt-flicker" />
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.4)_100%)] opacity-85 z-20" />
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-slate-violet/5 to-transparent h-[10%] w-full z-20 animate-crt-scanlines" />

          {/* Modal Container with Glowing Frame */}
          <div className="relative w-full max-w-2xl aspect-video bg-carbon-black border border-slate-violet/50 rounded-xl overflow-hidden shadow-[0_0_30px_rgba(120,119,198,0.4)] z-30 flex flex-col justify-between p-4 pointer-events-auto">
            
            {/* Top Bar inside Modal */}
            <div className="flex items-center justify-between border-b border-slate-violet/20 pb-2 mb-2">
              <span className="text-[9px] font-silkscreen text-slate-violet-light tracking-widest uppercase flex items-center gap-1.5 select-none">
                <Cpu size={12} className="text-slate-violet-light animate-spin" />
                CINEMATIC PREVIEW: {activeGame.title}
              </span>
              
              <div className="flex items-center gap-2">
                {/* Mute/Unmute */}
                <button
                  onClick={() => setIsModalMuted(!isModalMuted)}
                  className="p-1.5 bg-graphite hover:bg-slate-800 border border-graphite-light rounded text-alabaster-grey hover:text-bright-snow transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-violet-light focus-visible:outline-none"
                  title={isModalMuted ? "Unmute Audio" : "Mute Audio"}
                >
                  {isModalMuted ? <VolumeX size={12} /> : <Volume2 size={12} className="text-slate-violet-light" />}
                </button>
                {/* Close */}
                <button
                  ref={closeBtnRef}
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 bg-graphite hover:bg-rose-950/30 border border-graphite-light hover:border-rose-500/30 rounded text-alabaster-grey hover:text-rose-400 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none"
                  title="Close Preview"
                >
                  <X size={12} />
                </button>
              </div>
            </div>

            {/* Video Content */}
            <div className="flex-1 rounded border border-graphite-light overflow-hidden bg-black relative">
              <video
                ref={modalVideoRef}
                src={activeGame.videoSrc}
                loop
                muted={isModalMuted}
                playsInline
                className="w-full h-full object-cover filter brightness-[1.05] contrast-[1.05]"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between text-[8px] font-silkscreen text-alabaster-grey/40 mt-2 uppercase select-none">
              <span>{activeGame.subtitle}</span>
              <span>PRESS ESC OR CLICK X TO CLOSE</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// --- Sword Navigation Cursor Sandbox Component ---
interface Spark {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  shape: 'circle' | 'square' | 'shield' | 'rune';
  rotation: number;
  vrot: number;
}

interface NavSlash {
  id: number;
  linkIdx: number;
  clientX: number;
  clientY: number;
  color: string;
}

type KatanaColor = 'blue' | 'white' | 'black';

function SwordCursorSandbox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [katanaColor, setKatanaColor] = useState<KatanaColor>('blue');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHoveringNav, setIsHoveringNav] = useState(false);
  const [isSlashing, setIsSlashing] = useState(false);
  const [activeLink, setActiveLink] = useState('GAMES');
  const [slashedIdx, setSlashedIdx] = useState<number | null>(null);
  const [slashes, setSlashes] = useState<NavSlash[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);

  const navItems = ['HOME', 'GAMES', 'ABOUT', 'CAREERS', 'CONTACT'];

  // Handle cursor coordinates relative to viewport
  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Sparks physics calculation animation loop
  useEffect(() => {
    if (sparks.length === 0) return;
    let animationId: number;

    const updateSparks = () => {
      setSparks((prevSparks) =>
        prevSparks
          .map((spark) => ({
            ...spark,
            x: spark.x + spark.vx,
            y: spark.y + spark.vy,
            vy: spark.vy + 0.08,
            rotation: spark.rotation + spark.vrot,
            opacity: spark.opacity - 0.025,
          }))
          .filter((spark) => spark.opacity > 0)
      );
      animationId = requestAnimationFrame(updateSparks);
    };

    updateSparks();
    return () => cancelAnimationFrame(animationId);
  }, [sparks.length]);

  // Click strike handler
  const handleNavLinkClick = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    setIsSlashing(true);
    setSlashedIdx(idx);

    // Trigger sword swipe swing duration (matches CSS keyframes 450ms)
    setTimeout(() => setIsSlashing(false), 450);
    setTimeout(() => setSlashedIdx(null), 500);

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const localX = e.clientX - containerRect.left;
    const localY = e.clientY - containerRect.top;

    // Define colors depending on selection
    let slashColor = 'rgba(6, 182, 212, 0.9)'; // light blue
    let particleColor = 'oklch(0.75 0.18 200.0)';

    if (katanaColor === 'white') {
      slashColor = 'rgba(248, 250, 252, 0.9)'; // snow white
      particleColor = 'oklch(0.98 0.005 240.0)';
    } else if (katanaColor === 'black') {
      slashColor = 'rgba(168, 85, 247, 0.7)'; // obsidian violet-black
      particleColor = 'oklch(0.35 0.05 285.0)';
    }

    // Spawn horizontal centered slash trail overlay
    const newSlash: NavSlash = {
      id: Date.now(),
      linkIdx: idx,
      clientX: e.clientX,
      clientY: e.clientY,
      color: slashColor
    };
    setSlashes((prev) => [...prev, newSlash]);
    setTimeout(() => {
      setSlashes((prev) => prev.filter((s) => s.id !== newSlash.id));
    }, 450);

    // Spawn particle sparks explosion
    const newSparks: Spark[] = Array.from({ length: 12 }).map((_, i) => {
      const pAngle = Math.random() * Math.PI * 2;
      const speed = 2.0 + Math.random() * 3.5;
      return {
        id: Date.now() + i,
        x: localX,
        y: localY,
        vx: Math.cos(pAngle) * speed,
        vy: Math.sin(pAngle) * speed - 0.3,
        color: particleColor,
        size: 3 + Math.random() * 3,
        opacity: 1.0,
        shape: 'circle',
        rotation: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 8
      };
    });
    setSparks((prev) => [...prev, ...newSparks]);

    setActiveLink(navItems[idx]);
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl w-full">
      {/* Sub-tab switcher to select katana color variations */}
      <div className="flex bg-carbon-black-2 border border-graphite-light p-1 rounded-2xl w-max gap-1 self-center shadow-lg select-none">
        <button
          onClick={() => setKatanaColor('blue')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-silkscreen tracking-wider font-bold transition-all cursor-pointer ${
            katanaColor === 'blue'
              ? 'bg-cyan-600 text-bright-snow shadow-md shadow-cyan-600/20'
              : 'text-alabaster-grey/50 hover:text-bright-snow'
          }`}
        >
          <Sparkles size={11} className={katanaColor === 'blue' ? 'text-bright-snow' : 'text-alabaster-grey/50'} />
          LIGHT BLUE (HUD)
        </button>
        <button
          onClick={() => setKatanaColor('white')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-silkscreen tracking-wider font-bold transition-all cursor-pointer ${
            katanaColor === 'white'
              ? 'bg-slate-200 text-carbon-black shadow-md shadow-white/20'
              : 'text-alabaster-grey/50 hover:text-bright-snow'
          }`}
        >
          <Cpu size={11} className={katanaColor === 'white' ? 'text-carbon-black' : 'text-alabaster-grey/50'} />
          SNOW WHITE (PLATINUM)
        </button>
        <button
          onClick={() => setKatanaColor('black')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-silkscreen tracking-wider font-bold transition-all cursor-pointer ${
            katanaColor === 'black'
              ? 'bg-purple-950/80 text-bright-snow border border-purple-500/20 shadow-md shadow-purple-950/40'
              : 'text-alabaster-grey/50 hover:text-bright-snow'
          }`}
        >
          <Monitor size={11} className={katanaColor === 'black' ? 'text-bright-snow' : 'text-alabaster-grey/50'} />
          OBSIDIAN BLACK (STEALTH)
        </button>
      </div>

      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHoveringNav(true)}
        onMouseLeave={() => setIsHoveringNav(false)}
        className="relative w-full h-[360px] bg-carbon-black border border-graphite-light rounded-2xl flex flex-col items-center justify-center overflow-hidden shadow-2xl group select-none cursor-default"
      >
        {/* Custom animations for split, glitch, and bounce text effects */}
        <style>{`
          .sword-target-link {
            cursor: none !important;
          }
          
          /* Custom Arcade Game Sword swing animation */
          @keyframes arcadeSwordSwing {
            0% { transform: rotate(0deg); }
            12% { transform: rotate(20deg); } /* wind-up anticipation */
            30% { transform: rotate(-85deg); } /* fast strike slash */
            55% { transform: rotate(-10deg); } /* recoil bounce */
            75% { transform: rotate(4deg); }
            100% { transform: rotate(0deg); } /* return to center */
          }
          .animate-arcade-swing {
            animation: arcadeSwordSwing 0.45s cubic-bezier(0.25, 0.8, 0.25, 1.25) forwards;
          }

          /* Horizontal centered split structure (Sliding apart) */
          .split-container {
            position: relative;
            display: inline-block;
          }
          .split-top, .split-bottom {
            clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
            transition: transform 0.38s cubic-bezier(0.19, 1, 0.22, 1);
          }
          .split-bottom {
            clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          
          /* Light Blue splits */
          .link-slashed-blue .split-top {
            transform: translateY(-4px);
            filter: brightness(1.2) drop-shadow(0 0 3px rgba(6,182,212,0.8));
          }
          .link-slashed-blue .split-bottom {
            transform: translateY(4px);
            filter: brightness(1.2) drop-shadow(0 0 3px rgba(6,182,212,0.8));
          }

          /* Snow White splits */
          .link-slashed-white .split-top {
            transform: translateY(-4px);
            filter: brightness(1.25) drop-shadow(0 0 3px rgba(255,255,255,0.8));
          }
          .link-slashed-white .split-bottom {
            transform: translateY(4px);
            filter: brightness(1.25) drop-shadow(0 0 3px rgba(255,255,255,0.8));
          }

          /* Obsidian Black splits */
          .link-slashed-black .split-top {
            transform: translateY(-4px);
            filter: brightness(1.1) drop-shadow(0 0 3px rgba(168,85,247,0.7));
          }
          .link-slashed-black .split-bottom {
            transform: translateY(4px);
            filter: brightness(1.1) drop-shadow(0 0 3px rgba(168,85,247,0.7));
          }
        `}</style>

        {/* Dynamic Sparks Rendering */}
        {sparks.map((spark) => (
          <div
            key={spark.id}
            className="absolute rounded-full pointer-events-none z-30"
            style={{
              left: `${spark.x}px`,
              top: `${spark.y}px`,
              width: `${spark.size}px`,
              height: `${spark.size}px`,
              backgroundColor: spark.color,
              opacity: spark.opacity,
              boxShadow: `0 0 8px ${spark.color}`,
              transform: `translate(-50%, -50%) rotate(${spark.rotation}deg)`,
            }}
          />
        ))}

        {/* Navigation Mock Layout */}
        <div className="flex flex-col items-center gap-6 z-10">
          <span className="text-[8px] font-silkscreen text-slate-violet-light tracking-widest uppercase">
            [ SELECT STYLE ABOVE • CLICK NAVIGATION LINKS TO SLICE ]
          </span>

          <nav className="flex items-center gap-8 bg-carbon-black-2/80 backdrop-blur border border-graphite-light/60 px-8 py-4 rounded-xl shadow-xl relative">
            {navItems.map((item, idx) => {
              const isSlashed = slashedIdx === idx;
              let animationClass = isSlashed ? `link-slashed-${katanaColor}` : '';
              let activeColorText = katanaColor === 'blue' ? 'text-cyan-400' : katanaColor === 'white' ? 'text-slate-100 drop-shadow-[0_0_3px_rgba(255,255,255,0.4)]' : 'text-purple-500';

              return (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => handleNavLinkClick(idx, e)}
                  className={`sword-target-link relative text-xs font-silkscreen tracking-widest text-alabaster-grey/70 hover:text-bright-snow transition-colors select-none py-1 px-2 ${animationClass}`}
                >
                  {/* Top / Bottom split structure (Horizontal Centered Splits) */}
                  <div className="split-container">
                    <span className={`split-top ${activeLink === item ? activeColorText + ' font-bold' : ''}`}>{item}</span>
                    <span className={`split-bottom ${activeLink === item ? activeColorText + ' font-bold' : ''}`} aria-hidden="true">{item}</span>
                  </div>

                  {/* Slash centered horizontal neon streak overlay line */}
                  {slashes.map((s) => {
                    if (s.linkIdx !== idx) return null;
                    return (
                      <div
                        key={s.id}
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2.5px] pointer-events-none z-20 origin-center"
                        style={{
                          transform: 'scaleX(1.15)',
                          boxShadow: `0 0 10px ${s.color}, 0 0 4px #ffffff`,
                          backgroundColor: '#ffffff',
                          animation: 'fadeIn 0.35s ease-out forwards',
                        }}
                      />
                    );
                  })}
                </a>
              );
            })}
          </nav>
        </div>

        {isHoveringNav && (
          <div
            className={`pointer-events-none fixed z-50 select-none ${isSlashing ? 'animate-arcade-swing' : ''}`}
            style={{
              left: `${mousePos.x - 22}px`,
              top: `${mousePos.y - 22}px`,
              transformOrigin: '22px 22px',
              transition: isSlashing ? 'none' : 'transform 0.12s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
            }}
          >
            {/* Template Cyber-Katana SVG rendering customized colors */}
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none" 
              className={`filter ${
                katanaColor === 'blue'
                  ? 'drop-shadow-[0_0_8px_rgba(6,182,212,0.85)]'
                  : katanaColor === 'white'
                  ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]'
                  : 'drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]'
              }`}
            >
              {/* Outer blade neon glow */}
              <line 
                x1="2" y1="2" x2="28" y2="28" 
                stroke={katanaColor === 'blue' ? 'oklch(0.75 0.18 200.0)' : katanaColor === 'white' ? 'oklch(0.98 0.005 240.0)' : 'oklch(0.35 0.05 285.0)'} 
                strokeWidth="4.5" strokeLinecap="round" className="opacity-45" 
              />
              
              {/* Blade razor edge */}
              <line x1="0" y1="0" x2="26" y2="26" stroke="#f8fafc" strokeWidth="2.2" strokeLinecap="round" />
              
              {/* Blade steel core */}
              <line 
                x1="1" y1="1" x2="25" y2="25" 
                stroke={katanaColor === 'blue' ? '#22d3ee' : katanaColor === 'white' ? '#e2e8f0' : '#475569'} 
                strokeWidth="1.2" strokeLinecap="round" 
              />
              
              {/* Sleek Tsuba/Guard */}
              <line 
                x1="23" y1="29" x2="29" y2="23" 
                stroke={katanaColor === 'blue' ? '#0e7490' : katanaColor === 'white' ? '#334155' : '#0f172a'} 
                strokeWidth="3.5" strokeLinecap="round" 
              />
              
              {/* Handle/Tsuka */}
              <line x1="27" y1="27" x2="37" y2="37" stroke="#000000" strokeWidth="3.2" strokeLinecap="round" />
              <line 
                x1="28" y1="28" x2="36" y2="36" 
                stroke={katanaColor === 'blue' ? '#06b6d4' : katanaColor === 'white' ? '#cbd5e1' : '#6b21a8'} 
                strokeWidth="1.5" strokeLinecap="round" 
              />
              
              {/* Golden pommel */}
              <circle cx="38" cy="38" r="1.8" fill="#fbbf24" />
            </svg>
          </div>
        )}

        {/* Dynamic HUD information footer */}
        <div className="absolute bottom-4 text-[7px] font-silkscreen text-alabaster-grey/40 uppercase tracking-widest flex items-center gap-1.5 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-violet-light animate-pulse" />
          ACTIVE CHANNEL: [ {activeLink} ] // STYLE: [ CYBER-KATANA ({katanaColor.toUpperCase()}) ] // ALIGNMENT: [ CENTER-POINT POINTER HOTSPOT ]
        </div>
      </div>
    </div>
  );
}

function ShowcaseSandbox() {
  return (
    <div className="flex flex-col gap-12 w-full max-w-7xl mx-auto">
      {/* ================= VARIATION C: CINEMATIC OVERLAY MODAL ================= */}
      <div className="bg-carbon-black-2 border border-graphite-light rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden w-full">
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-violet/10 border border-slate-violet/20 px-2.5 py-1 rounded text-[10px] font-silkscreen text-slate-violet-light uppercase tracking-wider font-bold">
          <Sparkles size={10} /> Variation C
        </div>

        <div>
          <h3 className="text-xl font-bold font-russo-one tracking-wide text-bright-snow uppercase">
            Cinematic Overlay Modal
          </h3>
          <p className="text-xs md:text-sm text-alabaster-grey/70 mt-1 leading-relaxed font-outfit">
            Renders a play button next to details. Clicking triggers a centered modal overlay with scanlines, unmuted gameplay, and keyboard close.
          </p>
        </div>

        {/* Slider Layout */}
        <WebGLFeaturedSliderSandbox variant="C" />
      </div>

      {/* ================= VARIATION D: INLINE MORPHING VIDEO PLAYER ================= */}
      <div className="bg-carbon-black-2 border border-graphite-light rounded-2xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl relative overflow-hidden w-full">
        <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-muted-green/10 border border-muted-green/20 px-2.5 py-1 rounded text-[10px] font-silkscreen text-muted-green-light uppercase tracking-wider font-bold">
          <Monitor size={10} /> Variation D
        </div>

        <div>
          <h3 className="text-xl font-bold font-russo-one tracking-wide text-bright-snow uppercase">
            Inline Morphing Player
          </h3>
          <p className="text-xs md:text-sm text-alabaster-grey/70 mt-1 leading-relaxed font-outfit">
            Displays a play button. Clicking fades description details and smoothly morphs/scales an inline video player in its place.
          </p>
        </div>

        {/* Slider Layout */}
        <WebGLFeaturedSliderSandbox variant="D" />
      </div>
    </div>
  );
}

export default function FanSandboxPage() {
  const [activeTab, setActiveTab] = useState<'fans' | 'showcase' | 'cursor'>('fans');

  return (
    <main className="min-h-screen w-full bg-carbon-black text-bright-snow flex flex-col items-center py-20 px-6 font-sans">
      <div className="max-w-6xl w-full flex flex-col gap-6">
        {/* Toggle Mode Selector */}
        <div className="flex flex-wrap bg-carbon-black-2 border border-graphite-light p-1 rounded-2xl w-max gap-1 self-start shadow-xl">
          <button
            onClick={() => setActiveTab('fans')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-silkscreen tracking-wider font-semibold transition-all cursor-pointer ${
              activeTab === 'fans'
                ? 'bg-graphite text-bright-snow'
                : 'text-alabaster-grey/60 hover:text-bright-snow'
            }`}
          >
            <Cpu size={14} />
            FAN MODELS
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
            SHOWCASE VIDEOS
          </button>
          <button
            onClick={() => setActiveTab('cursor')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-silkscreen tracking-wider font-semibold transition-all cursor-pointer ${
              activeTab === 'cursor'
                ? 'bg-graphite text-bright-snow'
                : 'text-alabaster-grey/60 hover:text-bright-snow'
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-0.5">
              <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
              <line x1="13" y1="19" x2="19" y2="13" />
              <line x1="16" y1="16" x2="20" y2="20" />
              <line x1="19" y1="21" x2="21" y2="19" />
            </svg>
            SWORD CURSOR NAV
          </button>
        </div>

        {/* Tab Header */}
        <div className="border-b border-graphite-light pb-6 mb-4">
          <h1 className="text-4xl font-bold tracking-wider text-bright-snow font-russo-one uppercase">
            {activeTab === 'fans' && 'Fan Model Testing Ground'}
            {activeTab === 'showcase' && 'Spotlight Showcase Video Variations'}
            {activeTab === 'cursor' && 'Gamified Sword Nav Cursor'}
          </h1>
          <p className="text-sm text-alabaster-grey mt-2 max-w-3xl leading-relaxed font-outfit">
            {activeTab === 'fans' && 'Compare six completely stand-less fan designs below. All options are designed to sit flush within the release box and feature the contained Speed Lines breeze effect.'}
            {activeTab === 'showcase' && 'Interact with two different user experience models designed to resolve the gameplay video playback issue on the Spotlight displacement slider.'}
            {activeTab === 'cursor' && 'Hover over the navigation links below to transform your cursor into a glowing blade. Click a link to slash it, creating an impact distortion and a particle spark burst.'}
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

        {/* Tab 3: Custom Sword Cursor */}
        {activeTab === 'cursor' && <SwordCursorSandbox />}
      </div>
    </main>
  );
}
