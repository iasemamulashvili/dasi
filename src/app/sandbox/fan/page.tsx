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
  shape: 'circle' | 'square' | 'shield';
  rotation: number;
  vrot: number;
}

interface NavSlash {
  id: number;
  linkIdx: number;
  clientX: number;
  clientY: number;
  angle: number;
  color: string;
}

type SwordStyle = 'katana' | 'broadsword' | 'shard';

function SwordCursorSandbox() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [swordStyle, setSwordStyle] = useState<SwordStyle>('katana');
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
            vy: spark.shape === 'square' ? spark.vy + 0.18 : spark.vy + 0.1, // broadsword particles are heavier
            rotation: spark.rotation + spark.vrot,
            opacity: spark.opacity - (spark.shape === 'shield' ? 0.02 : 0.03), // shield particles float longer
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

    // Trigger sword swipe swing duration
    setTimeout(() => setIsSlashing(false), 140);
    setTimeout(() => setSlashedIdx(null), 500);

    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;

    const localX = e.clientX - containerRect.left;
    const localY = e.clientY - containerRect.top;

    // Define variation-specific properties
    let slashColor = 'rgba(168, 85, 247, 0.8)';
    let particleColor = 'oklch(0.61 0.025 285.0)';
    let particleShape: 'circle' | 'square' | 'shield' = 'circle';
    let angle = -12;

    if (swordStyle === 'broadsword') {
      slashColor = 'rgba(56, 189, 248, 0.8)';
      particleColor = 'oklch(0.79 0.13 222.0)'; // blue
      particleShape = 'square';
      angle = -25; // steeper chop angle
    } else if (swordStyle === 'shard') {
      slashColor = 'rgba(34, 197, 94, 0.8)';
      particleColor = 'oklch(0.79 0.13 145.0)'; // neon sage green
      particleShape = 'shield';
      angle = 0; // horizontal shockwave slice
    }

    // Spawn neon slice trail overlay
    const newSlash: NavSlash = {
      id: Date.now(),
      linkIdx: idx,
      clientX: e.clientX,
      clientY: e.clientY,
      angle,
      color: slashColor
    };
    setSlashes((prev) => [...prev, newSlash]);
    setTimeout(() => {
      setSlashes((prev) => prev.filter((s) => s.id !== newSlash.id));
    }, 450);

    // Spawn particle sparks explosion
    const particleCount = swordStyle === 'shard' ? 8 : 15;
    const newSparks: Spark[] = Array.from({ length: particleCount }).map((_, i) => {
      const pAngle = Math.random() * Math.PI * 2;
      const speed = particleShape === 'square' ? 1.5 + Math.random() * 3.5 : 2.5 + Math.random() * 4.5;
      return {
        id: Date.now() + i,
        x: localX,
        y: localY,
        vx: Math.cos(pAngle) * speed,
        vy: Math.sin(pAngle) * speed - (particleShape === 'shield' ? 1.5 : 0.5), // shields float upwards
        color: particleColor,
        size: particleShape === 'shield' ? 6 : particleShape === 'square' ? 3.5 : 2.5,
        opacity: 1.0,
        shape: particleShape,
        rotation: Math.random() * 360,
        vrot: (Math.random() - 0.5) * 15
      };
    });
    setSparks((prev) => [...prev, ...newSparks]);

    setActiveLink(navItems[idx]);
  };

  return (
    <div className="flex flex-col gap-8 max-w-6xl w-full">
      {/* Sub-tab switcher to select sword cursor variations */}
      <div className="flex bg-carbon-black-2 border border-graphite-light p-1 rounded-2xl w-max gap-1 self-center shadow-lg select-none">
        <button
          onClick={() => {
            setSwordStyle('katana');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-silkscreen tracking-wider font-bold transition-all cursor-pointer ${
            swordStyle === 'katana'
              ? 'bg-slate-violet text-bright-snow shadow-md shadow-slate-violet/20'
              : 'text-alabaster-grey/50 hover:text-bright-snow'
          }`}
        >
          <Sparkles size={11} className={swordStyle === 'katana' ? 'text-bright-snow' : 'text-alabaster-grey/50'} />
          CYBER-KATANA
        </button>
        <button
          onClick={() => {
            setSwordStyle('broadsword');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-silkscreen tracking-wider font-bold transition-all cursor-pointer ${
            swordStyle === 'broadsword'
              ? 'bg-sky-600 text-bright-snow shadow-md shadow-sky-600/20'
              : 'text-alabaster-grey/50 hover:text-bright-snow'
          }`}
        >
          <Cpu size={11} className={swordStyle === 'broadsword' ? 'text-bright-snow' : 'text-alabaster-grey/50'} />
          RETRO BROADSWORD
        </button>
        <button
          onClick={() => {
            setSwordStyle('shard');
          }}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[10px] font-silkscreen tracking-wider font-bold transition-all cursor-pointer ${
            swordStyle === 'shard'
              ? 'bg-emerald-600 text-bright-snow shadow-md shadow-emerald-600/20'
              : 'text-alabaster-grey/50 hover:text-bright-snow'
          }`}
        >
          <Monitor size={11} className={swordStyle === 'shard' ? 'text-bright-snow' : 'text-alabaster-grey/50'} />
          SHARD SHIELD BLADE
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
          
          /* Variation E: Split Diagonal cut animation using clip-paths */
          .split-container {
            position: relative;
            display: inline-block;
          }
          .split-top, .split-bottom {
            transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
          }
          .split-top {
            clip-path: polygon(0 0, 100% 0, 100% 48%, 0 62%);
          }
          .split-bottom {
            clip-path: polygon(0 62%, 100% 48%, 100% 100%, 0 100%);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .link-slashed-katana .split-top {
            transform: translate(-3px, -2px) skewX(-6deg);
            filter: brightness(1.2) drop-shadow(0 0 2px rgba(168,85,247,0.5));
          }
          .link-slashed-katana .split-bottom {
            transform: translate(3px, 2px) skewX(-6deg);
          }

          /* Variation F: Digital 16-Bit Jitter Glitch */
          @keyframes glitchShake {
            0% { transform: translate(0) skewX(0); }
            10% { transform: translate(-2px, 1px) skewX(-8deg) scaleY(0.96); }
            20% { transform: translate(3px, -2px) skewX(12deg) scaleX(1.05); }
            30% { transform: translate(-1px, 2px) skewX(-4deg); }
            40% { transform: translate(2px, -1px) skewX(6deg); }
            50% { transform: translate(0) skewX(0); }
          }
          .link-slashed-broadsword {
            animation: glitchShake 0.45s steps(3) forwards;
            filter: drop-shadow(0 0 3px rgba(56,189,248,0.6));
          }

          /* Variation G: Elastic Spring Letter bounce */
          @keyframes springBounce {
            0% { transform: scale(1) translateY(0); }
            25% { transform: scale(1.22, 0.8) translateY(3px); }
            45% { transform: scale(0.85, 1.15) translateY(-6px); filter: brightness(1.25); }
            65% { transform: scale(1.08, 0.95) translateY(2px); }
            85% { transform: scale(0.97, 1.02) translateY(-1px); }
            100% { transform: scale(1) translateY(0); }
          }
          .link-slashed-shard {
            animation: springBounce 0.65s cubic-bezier(0.25, 0.8, 0.25, 1.4) forwards;
          }
        `}</style>

        {/* Dynamic Sparks Rendering */}
        {sparks.map((spark) => {
          if (spark.shape === 'shield') {
            return (
              <svg
                key={spark.id}
                viewBox="0 0 100 100"
                fill="none"
                stroke={spark.color}
                strokeWidth="12"
                className="absolute pointer-events-none z-30 filter"
                style={{
                  left: `${spark.x}px`,
                  top: `${spark.y}px`,
                  width: `${spark.size * 2}px`,
                  height: `${spark.size * 2}px`,
                  opacity: spark.opacity,
                  transform: `translate(-50%, -50%) rotate(${spark.rotation}deg)`,
                  filter: `drop-shadow(0 0 3px ${spark.color})`
                }}
              >
                <path d="M 20 20 L 80 20 L 80 50 C 80 72 65 88 50 95 C 35 88 20 72 20 50 Z" />
              </svg>
            );
          }
          return (
            <div
              key={spark.id}
              className={`absolute pointer-events-none z-30 ${spark.shape === 'square' ? '' : 'rounded-full'}`}
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
          );
        })}

        {/* Navigation Mock Layout */}
        <div className="flex flex-col items-center gap-6 z-10">
          <span className="text-[8px] font-silkscreen text-slate-violet-light tracking-widest uppercase">
            [ SELECT STYLE ABOVE • CLICK NAVIGATION LINKS TO SLICE ]
          </span>

          <nav className="flex items-center gap-8 bg-carbon-black-2/80 backdrop-blur border border-graphite-light/60 px-8 py-4 rounded-xl shadow-xl relative">
            {navItems.map((item, idx) => {
              const isSlashed = slashedIdx === idx;
              
              // Decide style override classes
              let animationClass = '';
              if (isSlashed) {
                if (swordStyle === 'katana') animationClass = 'link-slashed-katana';
                else if (swordStyle === 'broadsword') animationClass = 'link-slashed-broadsword';
                else if (swordStyle === 'shard') animationClass = 'link-slashed-shard';
              }

              return (
                <a
                  key={item}
                  href="#"
                  onClick={(e) => handleNavLinkClick(idx, e)}
                  className={`sword-target-link relative text-xs font-silkscreen tracking-widest text-alabaster-grey/70 hover:text-bright-snow transition-colors select-none py-1 px-2 ${animationClass}`}
                >
                  {/* Top / Bottom split structure for Variation E (Katana) */}
                  {swordStyle === 'katana' ? (
                    <div className="split-container">
                      <span className={`split-top ${activeLink === item ? 'text-slate-violet-light font-bold' : ''}`}>{item}</span>
                      <span className={`split-bottom ${activeLink === item ? 'text-slate-violet-light font-bold' : ''}`} aria-hidden="true">{item}</span>
                    </div>
                  ) : (
                    <span className={activeLink === item ? 'text-slate-violet-light font-bold' : ''}>
                      {item}
                    </span>
                  )}

                  {/* Slash neon streak overlay line */}
                  {slashes.map((s) => {
                    if (s.linkIdx !== idx) return null;
                    return (
                      <div
                        key={s.id}
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[2.5px] bg-bright-snow pointer-events-none z-20 origin-left"
                        style={{
                          transform: `rotate(${s.angle}deg) scaleX(1.2)`,
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

        {/* Premium Aligned Sword Cursor (Tracks Mouse Coordinates) */}
        {isHoveringNav && (
          <div
            className="pointer-events-none fixed z-50 select-none"
            style={{
              left: `${mousePos.x}px`,
              top: `${mousePos.y}px`,
              /* 
                SWORD POINTER MATHEMATICS:
                Tip of the blade sits exactly at (0,0) inside the SVG viewport.
                Transform-origin (0px 0px) binds the rotation axis directly to the blade tip.
                The cursor coordinate maps precisely to the tip of the blade, feeling 100% accurate.
              */
              transform: swordStyle === 'katana'
                ? `rotate(${isSlashing ? '45deg' : '-35deg'})`
                : swordStyle === 'broadsword'
                ? `rotate(${isSlashing ? '25deg' : '-50deg'})`
                : `scale(${isSlashing ? 1.25 : 1.0}) rotate(${isSlashing ? '30deg' : '-30deg'})`,
              transformOrigin: '0px 0px',
              transition: 'transform 0.12s cubic-bezier(0.18, 0.89, 0.32, 1.28)',
            }}
          >
            {/* VARIATION E: Neon Cyber-Katana (Purple) */}
            {swordStyle === 'katana' && (
              <svg width="44" height="44" viewBox="0 0 44 44" fill="none" className="filter drop-shadow-[0_0_8px_rgba(168,85,247,0.85)]">
                {/* 
                  Drawn extending down-right from (0,0) hotspot tip.
                  Tip: x=0, y=0.
                  Hilt Pommel end: x=40, y=40.
                */}
                {/* Blade Glow aura */}
                <line x1="2" y1="2" x2="28" y2="28" stroke="oklch(0.61 0.025 285.0)" strokeWidth="4.5" strokeLinecap="round" className="opacity-45" />
                {/* Blade razor edge */}
                <line x1="0" y1="0" x2="26" y2="26" stroke="#f8fafc" strokeWidth="2.2" strokeLinecap="round" />
                {/* Steel core */}
                <line x1="1" y1="1" x2="25" y2="25" stroke="#c084fc" strokeWidth="1" strokeLinecap="round" />
                {/* Sleek Tsuba/Guard */}
                <line x1="23" y1="29" x2="29" y2="23" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
                {/* Handle/Tsuka */}
                <line x1="27" y1="27" x2="37" y2="37" stroke="#000000" strokeWidth="3.2" strokeLinecap="round" />
                <line x1="28" y1="28" x2="36" y2="36" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
                {/* Golden pommel */}
                <circle cx="38" cy="38" r="1.8" fill="#fbbf24" />
              </svg>
            )}

            {/* VARIATION F: Arcade Broadsword (Sky Blue / Golden) */}
            {swordStyle === 'broadsword' && (
              <svg width="46" height="46" viewBox="0 0 46 46" fill="none" className="filter drop-shadow-[0_0_8px_rgba(56,189,248,0.85)]">
                {/* 
                  Tip: x=0, y=0.
                  Pommel: x=42, y=42.
                */}
                {/* Crystal blade core */}
                <line x1="0" y1="0" x2="24" y2="24" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                <line x1="1" y1="1" x2="23" y2="23" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
                {/* Golden crossguard */}
                <line x1="18" y1="28" x2="28" y2="18" stroke="#fbbf24" strokeWidth="4.5" strokeLinecap="round" />
                {/* Wooden hilt wrap */}
                <line x1="24" y1="24" x2="38" y2="38" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
                <line x1="26" y1="26" x2="36" y2="36" stroke="#fbbf24" strokeWidth="1" strokeLinecap="round" />
                {/* Diamond Blue Pommel Gem */}
                <polygon points="38,38 42,38 42,42 38,42" fill="#38bdf8" />
              </svg>
            )}

            {/* VARIATION G: Shard Energy Blade (Sage Green Shards) */}
            {swordStyle === 'shard' && (
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none" className="filter drop-shadow-[0_0_10px_rgba(52,211,153,0.9)]">
                {/* 
                  Floating, hum/pulse energy crest weapon.
                  Tip: x=0, y=0.
                  Pommel: x=44, y=44.
                */}
                {/* Shard 1: Blade tip segment */}
                <polygon points="0,0 6,4 4,6" fill="#ffffff" />
                <polygon points="0,0 5,3 3,5" fill="#34d399" />
                
                {/* Shard 2: Mid blade gap & segment */}
                <polygon points="9,9 16,13 13,16" fill="#34d399" className="opacity-90" />
                <polygon points="10,10 15,12 12,15" fill="#a7f3d0" />

                {/* Shard 3: Lower blade segment */}
                <polygon points="18,18 26,23 23,26" fill="#34d399" />

                {/* Cyber hilt socket emitter */}
                <circle cx="28" cy="28" r="3.5" fill="#064e3b" stroke="#34d399" strokeWidth="1" />
                {/* Glowing shield pommel base */}
                <path d="M 28 28 L 40 40 L 38 42 C 34 44 32 40 28 38 Z" fill="#065f46" stroke="#34d399" strokeWidth="1.5" />
              </svg>
            )}
          </div>
        )}

        {/* Dynamic HUD information footer */}
        <div className="absolute bottom-4 text-[7px] font-silkscreen text-alabaster-grey/40 uppercase tracking-widest flex items-center gap-1.5 select-none">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-violet-light animate-pulse" />
          ACTIVE CHANNEL: [ {activeLink} ] // STYLE: [ {swordStyle.toUpperCase()} ] // ALIGNMENT: OK [TIP HOTSPOT ENABLED]
        </div>
      </div>
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
