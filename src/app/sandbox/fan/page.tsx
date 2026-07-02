'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Play, Volume2, VolumeX, X, Monitor, Cpu, Sparkles } from 'lucide-react';

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
      className="relative w-full h-[450px] bg-carbon-black border border-graphite-light rounded-xl overflow-hidden flex flex-col justify-end p-5 md:p-6 cursor-none select-none slider-glow"
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
      <div className="absolute inset-0 bg-gradient-to-t from-carbon-black via-carbon-black/40 to-carbon-black/45 z-10 pointer-events-none" />

      {/* Custom Retro Magnetic Cursor Overlay */}
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
        <div className="relative w-12 h-12 flex items-center justify-center">
          <div 
            className="absolute inset-0 rounded-full border border-dashed animate-[spin_10s_linear_infinite]"
            style={{ 
              borderColor: 'var(--color-slate-violet-light)', 
              boxShadow: `0 0 8px var(--color-slate-violet)44` 
            }}
          />
          <div 
            className="absolute w-6 h-6 rounded-full border border-double"
            style={{ borderColor: 'var(--color-platinum-silver)' }}
          />
          <div className="absolute w-4 h-[1px] bg-slate-violet-light" />
          <div className="absolute h-4 w-[1px] bg-slate-violet-light" />
          <span 
            className="absolute top-8 font-sans text-[6px] bg-carbon-black/90 px-1 border border-graphite-light rounded text-bright-snow tracking-widest whitespace-nowrap"
          >
            LOCK: {activeGame.title.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Main Slide Layout Content */}
      <div className="relative w-full h-full flex flex-col justify-between z-10 pt-4 pb-12">
        {/* Title HUD Info (Left-aligned) or Inline Morphing Player */}
        <div className={`flex flex-col gap-1.5 pointer-events-none slider-hud-element z-20 transition-all duration-300 ${
          showVideoInline ? 'max-w-[85%] sm:max-w-[65%] md:max-w-[55%]' : 'max-w-[55%]'
        }`}>
          
          {/* STATE 1: Text details block */}
          <div 
            className={`flex flex-col gap-1.5 transition-all duration-500 ease-in-out ${
              showVideoInline 
                ? 'opacity-0 -translate-y-2 scale-95 pointer-events-none select-none h-0 overflow-hidden' 
                : 'opacity-100 translate-y-0 scale-100'
            }`}
          >
            <span className="text-[8px] font-silkscreen text-slate-violet-light uppercase tracking-widest leading-none">
              {activeGame.subtitle}
            </span>
            <h4 className="text-xl font-bold font-russo-one tracking-wider text-bright-snow uppercase leading-tight">
              {activeGame.title}
            </h4>
            <p className="text-[10px] text-alabaster-grey/70 leading-relaxed font-outfit max-h-[80px] overflow-hidden text-ellipsis">
              {activeGame.description}
            </p>
            
            {variant === 'C' && (
              <button
                onClick={() => {
                  setIsModalMuted(false);
                  setIsModalOpen(true);
                }}
                className="mt-2.5 group flex items-center justify-center gap-2 px-3 py-1.5 w-fit border border-slate-violet/40 hover:border-slate-violet-light bg-black/60 hover:bg-slate-violet/20 rounded-md text-center cursor-pointer pointer-events-auto transition-all focus-visible:ring-2 focus-visible:ring-slate-violet-light focus-visible:outline-none text-[9px] font-silkscreen tracking-widest text-bright-snow font-bold"
              >
                <Play size={10} className="fill-current text-slate-violet-light group-hover:scale-110 transition-transform" />
                WATCH GAMEPLAY
              </button>
            )}

            {variant === 'D' && (
              <button
                onClick={() => {
                  setIsInlineMuted(false);
                  setShowVideoInline(true);
                }}
                className="mt-2.5 group flex items-center justify-center gap-2 px-3 py-1.5 w-fit border border-slate-violet/40 hover:border-slate-violet-light bg-black/60 hover:bg-slate-violet/20 rounded-md text-center cursor-pointer pointer-events-auto transition-all focus-visible:ring-2 focus-visible:ring-slate-violet-light focus-visible:outline-none text-[9px] font-silkscreen tracking-widest text-bright-snow font-bold"
              >
                <Play size={10} className="fill-current text-slate-violet-light group-hover:scale-110 transition-transform" />
                PLAY GAMEPLAY
              </button>
            )}
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
              <div className="relative w-full max-w-[360px] aspect-video bg-carbon-black-2/95 border border-slate-violet/50 rounded-xl overflow-hidden shadow-[0_0_20px_rgba(120,119,198,0.3)] p-2.5 flex flex-col gap-2">
                {/* Mini Header */}
                <div className="flex items-center justify-between border-b border-slate-violet/20 pb-1.5">
                  <span className="text-[7px] font-silkscreen text-slate-violet-light tracking-widest uppercase flex items-center gap-1 select-none">
                    <span className="w-1 h-1 rounded-full bg-slate-violet-light animate-ping" />
                    INLINE PREVIEW: {activeGame.title}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Mute/Unmute */}
                    <button
                      onClick={() => setIsInlineMuted(!isInlineMuted)}
                      className="p-1 bg-graphite hover:bg-slate-800 border border-graphite-light rounded text-alabaster-grey hover:text-bright-snow transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-violet-light focus-visible:outline-none"
                      title={isInlineMuted ? "Unmute Audio" : "Mute Audio"}
                    >
                      {isInlineMuted ? <VolumeX size={8} /> : <Volume2 size={8} className="text-slate-violet-light animate-pulse" />}
                    </button>
                    {/* Back to details */}
                    <button
                      onClick={() => setShowVideoInline(false)}
                      className="px-1.5 py-0.5 bg-graphite hover:bg-slate-800 border border-graphite-light rounded text-[7px] font-silkscreen text-alabaster-grey hover:text-bright-snow transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-slate-violet-light focus-visible:outline-none uppercase font-bold"
                    >
                      Show Details
                    </button>
                  </div>
                </div>

                {/* Inline video display */}
                <div className="flex-1 rounded border border-graphite-light overflow-hidden bg-black relative">
                  <video
                    ref={inlineVideoRef}
                    src={activeGame.videoSrc}
                    loop
                    muted={isInlineMuted}
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Specs Footer & Dot Navigation */}
      <div className="absolute bottom-4 left-5 right-5 border-t border-graphite-light/40 pt-3 flex justify-between items-center gap-3 text-[8px] font-silkscreen text-alabaster-grey/50 z-10">
        <div className="flex gap-4">
          <div>ENGINE: <span className="text-bright-snow">{activeGame.stats.engine}</span></div>
          <div>DOWNLOADS: <span className="text-bright-snow">{activeGame.stats.downloads}</span></div>
        </div>

        {/* Dot Indicators */}
        <div className="flex gap-1.5 pointer-events-auto">
          {sandboxGames.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => transitionTo(idx)}
              className={`w-2 h-2 rounded-full transition-all focus-visible:ring-1 focus-visible:ring-slate-violet-light focus-visible:outline-none cursor-pointer ${
                activeIndex === idx ? 'bg-bright-snow scale-125' : 'bg-alabaster-grey/30 hover:bg-alabaster-grey/60'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
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

function ShowcaseSandbox() {
  return (
    <div className="flex flex-col gap-12 max-w-6xl w-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= VARIATION C: CINEMATIC OVERLAY MODAL ================= */}
        <div className="bg-carbon-black-2 border border-graphite-light rounded-2xl p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-slate-violet/10 border border-slate-violet/20 px-2 py-0.5 rounded text-[8px] font-silkscreen text-slate-violet-light uppercase tracking-wider font-bold">
            <Sparkles size={8} /> Variation C
          </div>

          <div>
            <h3 className="text-lg font-bold font-russo-one tracking-wide text-bright-snow uppercase">
              Cinematic Overlay Modal
            </h3>
            <p className="text-xs text-alabaster-grey/70 mt-1 leading-relaxed font-outfit">
              Renders a play button next to details. Clicking triggers a centered modal overlay with scanlines, unmuted gameplay, and keyboard close.
            </p>
          </div>

          {/* Slider Layout */}
          <WebGLFeaturedSliderSandbox variant="C" />
        </div>

        {/* ================= VARIATION D: INLINE MORPHING VIDEO PLAYER ================= */}
        <div className="bg-carbon-black-2 border border-graphite-light rounded-2xl p-6 flex flex-col gap-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-muted-green/10 border border-muted-green/20 px-2 py-0.5 rounded text-[8px] font-silkscreen text-muted-green-light uppercase tracking-wider font-bold">
            <Monitor size={8} /> Variation D
          </div>

          <div>
            <h3 className="text-lg font-bold font-russo-one tracking-wide text-bright-snow uppercase">
              Inline Morphing Player
            </h3>
            <p className="text-xs text-alabaster-grey/70 mt-1 leading-relaxed font-outfit">
              Displays a play button. Clicking fades description details and smoothly morphs/scales an inline video player in its place.
            </p>
          </div>

          {/* Slider Layout */}
          <WebGLFeaturedSliderSandbox variant="D" />
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
