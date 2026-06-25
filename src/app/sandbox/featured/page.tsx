'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { 
  Smartphone, 
  Laptop, 
  Globe, 
  ArrowRight, 
  Play, 
  Layers, 
  Tv, 
  RotateCcw, 
  HelpCircle, 
  Code2, 
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Cpu,
  Info
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Mock Games Data based on database
const gamesData = [
  {
    id: 'crown-quest',
    title: 'Crown Quest',
    subtitle: 'Epic Action RPG Adventure',
    description: 'Embark on an epic fantasy RPG quest. Command legendary heroes, conquer tactical grid battles, and construct your royal stronghold in a war-torn kingdom.',
    accent: '#f1c40f', // Amber Gold
    accentMuted: '#e05a36', // Warm Orange
    themeColor: 'rgba(241, 196, 15, 0.7)',
    bgGradient: 'from-amber-600/30 via-orange-950/40 to-[#070e1d]',
    image: '/crown-quest.png',
    playstoreLink: 'https://play.google.com/store/apps/details?id=dasi.arpg.crownquest',
    appstoreLink: 'https://apps.apple.com/us/app/crown-quest-action-rpg/id6477858164',
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
    accent: '#2ecc71', // Emerald Green
    accentMuted: '#27ae60', // Forest Green
    themeColor: 'rgba(46, 204, 113, 0.7)',
    bgGradient: 'from-emerald-700/30 via-green-950/40 to-[#070e1d]',
    image: '/lumber-chopper.png',
    video: '/videos/lumber-chopper.mp4',
    playstoreLink: 'https://play.google.com/store/apps/details?id=dasi.prs2.lumberchopper',
    appstoreLink: 'https://apps.apple.com/us/app/lumber-chopper-harvest-empire/id6738272884',
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
    accent: '#3498db', // Bright Blue
    accentMuted: '#9b59b6', // Luxury Purple
    themeColor: 'rgba(52, 152, 219, 0.7)',
    bgGradient: 'from-blue-600/30 via-purple-950/40 to-[#070e1d]',
    image: '/hotel-manager.png',
    playstoreLink: 'https://play.google.com/store/apps/details?id=dasi.prs3.hotelmanager',
    appstoreLink: 'https://apps.apple.com/us/app/hotel-manager-resort-empire/id6748454899',
    stats: {
      activePlayers: '500K+',
      rating: '4.5',
      downloads: '1.5M+',
      engine: 'Unity 2D'
    }
  }
];

// CONCEPT 1: Immersive Split-Screen Parallax Simulation
function ConceptSplitParallax() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const textSectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Scroll handler simulating vertical layout pinning inside a container
  const handleScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight - el.clientHeight;
    const progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
    setScrollProgress(progress);

    // Identify active index
    const totalSlides = gamesData.length;
    const index = Math.min(
      Math.floor(scrollTop / (el.clientHeight - 50)),
      totalSlides - 1
    );
    if (index !== activeIndex && index >= 0 && index < totalSlides) {
      setActiveIndex(index);
    }
  };

  // Autoplay simulation scroll
  useEffect(() => {
    if (!autoplay) return;
    let animationFrameId: number;
    let speed = 0.001; // incremental scroll speed
    let currentProgress = 0;

    const runAutoplay = () => {
      const el = scrollContainerRef.current;
      if (!el) return;

      currentProgress += speed;
      if (currentProgress > 1) {
        currentProgress = 0;
      }
      
      const targetScroll = currentProgress * (el.scrollHeight - el.clientHeight);
      el.scrollTop = targetScroll;

      animationFrameId = requestAnimationFrame(runAutoplay);
    };

    animationFrameId = requestAnimationFrame(runAutoplay);
    return () => cancelAnimationFrame(animationFrameId);
  }, [autoplay]);

  // Trigger entrance transitions on activeIndex change
  useEffect(() => {
    const textEl = textSectionRefs.current[activeIndex];
    if (!textEl) return;

    const q = gsap.utils.selector(textEl);
    
    // Animate title split chars simulation
    gsap.fromTo(
      q('.animate-title-split'),
      { y: 30, opacity: 0, rotateX: -30 },
      { y: 0, opacity: 1, rotateX: 0, duration: 0.6, ease: 'power3.out', stagger: 0.03 }
    );

    gsap.fromTo(
      q('.animate-fade-in-stagger'),
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: 'power2.out', stagger: 0.08, delay: 0.2 }
    );
  }, [activeIndex]);

  const activeGame = gamesData[activeIndex];

  // Calculate parallax offset
  const parallaxOffset = (scrollProgress * 200) - 100; // range [-100px, 100px]

  return (
    <div ref={containerRef} className="flex flex-col h-full">
      {/* Overview Card */}
      <div className="bg-[#0a1429] border border-white/5 p-4 rounded-xl mb-4 flex items-start gap-4">
        <div className="p-2.5 bg-amber-500/10 rounded-lg text-amber-500 mt-1">
          <Layers size={18} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Concept 1: Immersive Split-Screen Parallax</h4>
          <p className="text-xs text-[#8596ad] mt-1 leading-relaxed">
            As the user scrolls, the page locks into a custom split layout. The Left Panel handles smooth gradient color morphs and staggering text reveals, while the Right Panel houses a visual phone showcase with interactive scrolling gameplay parallax depth.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button 
            onClick={() => setAutoplay(!autoplay)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              autoplay 
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 glow-border-amber' 
                : 'bg-white/5 border-white/10 text-[#8596ad] hover:text-white'
            }`}
          >
            <RotateCcw size={12} className={autoplay ? 'animate-spin' : ''} />
            {autoplay ? 'Auto-Scrolling' : 'Manual Scroll'}
          </button>
        </div>
      </div>

      {/* Main Workspace Frame with CRT Scanlines & Retro Terminal border */}
      <div className="flex-1 bg-[#050913] rounded-2xl border-2 border-[#1e2d4a] shadow-[0_0_20px_rgba(30,45,74,0.3)] overflow-hidden relative flex flex-col min-h-[500px] crt-screen crt-flicker">
        {/* Top Browser Bar / Retro System Header */}
        <div className="h-10 bg-[#081022] border-b border-[#1e2d4a] flex items-center px-4 justify-between select-none z-30 shrink-0 font-mono">
          <div className="flex gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_6px_#dc2626] inline-block animate-pulse" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 shadow-[0_0_6px_#eab308] inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] inline-block" />
          </div>
          <span className="text-[10px] text-[#82a6b0] font-bold tracking-wider uppercase flex items-center gap-2">
            <span className="text-amber-400">●</span> DASI SYS v2.89 // CONCEPT_01_PARALLAX // COIN: [01]
          </span>
          <div className="text-[9px] text-[#5c728e] font-bold tracking-wider uppercase">
            SCROLL: {Math.round(scrollProgress * 100)}%
          </div>
        </div>

        {/* Outer Split Container */}
        <div className="flex-1 relative flex flex-col md:flex-row overflow-hidden">
          {/* Scrollable Container (triggers state shifts) */}
          <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="absolute inset-0 overflow-y-scroll snap-y snap-mandatory z-20 scrollbar-none"
            style={{ pointerEvents: autoplay ? 'none' : 'auto' }}
          >
            {gamesData.map((g, idx) => (
              <div key={g.id} className="h-full w-full snap-start flex items-center" />
            ))}
          </div>

          {/* Left Panel: Typographic Panel (45%) */}
          <div 
            className={`w-full md:w-[45%] h-1/2 md:h-full p-6 md:p-12 flex flex-col justify-center transition-all duration-1000 bg-gradient-to-br ${activeGame.bgGradient} border-b md:border-b-0 md:border-r border-[#1e2d4a] relative z-10 overflow-hidden`}
            style={{
              backgroundImage: `linear-gradient(to right, ${activeGame.themeColor.replace('0.7', '0.08')} 1px, transparent 1px), linear-gradient(to bottom, ${activeGame.themeColor.replace('0.7', '0.08')} 1px, transparent 1px)`,
              backgroundSize: '24px 24px'
            }}
          >
            <div className="relative z-10">
              {gamesData.map((game, idx) => {
                if (idx !== activeIndex) return null;
                return (
                  <div 
                    key={game.id} 
                    ref={(el) => { textSectionRefs.current[idx] = el; }}
                    className="flex flex-col"
                  >
                    <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-400 mb-2.5 animate-pulse inline-flex items-center gap-1.5 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded shadow-[0_0_8px_rgba(241,196,15,0.2)] w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                      16-BIT CARTRIDGE ACTIVE
                    </span>
                    <h3 
                      className="text-3xl md:text-5xl font-black text-white tracking-wide uppercase mb-3 font-mono"
                      style={{ textShadow: `0 0 10px ${game.accent}77` }}
                    >
                      {game.title.split('').map((char, cIdx) => (
                        <span key={cIdx} className="inline-block animate-title-split origin-bottom">
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </h3>
                    <p className="text-xs font-bold text-amber-400/90 mb-4 tracking-wider uppercase animate-fade-in-stagger font-mono">
                      // {game.subtitle}
                    </p>
                    <p className="text-xs text-[#8596ad] leading-relaxed mb-6 max-w-sm animate-fade-in-stagger font-sans">
                      {game.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6 border-t border-white/10 pt-4 animate-fade-in-stagger font-mono">
                      <div>
                        <span className="text-[9px] uppercase text-[#8596ad] tracking-wider block font-bold">// INSTALLED BASE</span>
                        <span className="text-base font-black text-white">{game.stats.activePlayers}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase text-[#8596ad] tracking-wider block font-bold">// RATING</span>
                        <span className="text-base font-black text-white">⭐ {game.stats.rating} / 5</span>
                      </div>
                    </div>

                    {/* Retro HUD Widget */}
                    <div className="font-mono text-[9px] text-[#5c728e] space-y-0.5 border border-white/5 bg-black/40 p-2.5 rounded-lg mb-6 max-w-sm animate-fade-in-stagger">
                      <div>&gt; TARGET_HARDWARE: NES / SEGA_16BIT</div>
                      <div>&gt; SOUND_ENGINE: DASI_SYNTH v1.4</div>
                      <div>&gt; SYSTEM_INTEGRITY: 100% (STABLE)</div>
                    </div>

                    {/* Redirection Links */}
                    <div className="flex items-center gap-4 animate-fade-in-stagger font-mono">
                      <a 
                        href={game.playstoreLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-[#8596ad] hover:text-white hover:border-amber-400 hover:bg-amber-400/5 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                      >
                        <Laptop size={14} />
                        <span>GOOGLE PLAY</span>
                      </a>
                      <a 
                        href={game.appstoreLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-[#8596ad] hover:text-white hover:border-amber-400 hover:bg-amber-400/5 transition-all shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                      >
                        <Smartphone size={14} />
                        <span>APP STORE</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Retro Handheld mockup window (55%) */}
          <div className="w-full md:w-[55%] h-1/2 md:h-full bg-[#03060c] relative flex items-center justify-center p-6 select-none z-10">
            {/* Ambient blur background */}
            <div 
              className="absolute inset-0 opacity-25 blur-3xl transition-all duration-1000"
              style={{
                background: `radial-gradient(circle, ${activeGame.accent} 0%, transparent 60%)`
              }}
            />

            {/* DASI POCKET HANDHELD CONSOLE CHASSIS */}
            <div className="relative w-[280px] h-[480px] md:w-[310px] md:h-[530px] bg-[#1a2233] border-[6px] border-[#293652] rounded-[48px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between p-3.5 z-10">
              
              {/* Inner screen bezel */}
              <div className="relative flex-1 bg-[#0a0f1d] rounded-[36px] p-3 pb-6 border border-[#2e3e60] flex flex-col justify-between shadow-inner">
                
                {/* Power LED Indicator */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-1 z-30">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_#dc2626] animate-pulse" />
                  <span className="text-[5px] font-mono text-neutral-400 font-bold tracking-widest uppercase">POWER</span>
                </div>

                {/* Screen frame */}
                <div className="relative flex-1 bg-black rounded-[24px] overflow-hidden border border-white/5 flex items-center justify-center">
                  
                  {/* Parallax moving image wrapper */}
                  <div 
                    className="absolute inset-0 w-full h-[120%] transition-transform duration-500 ease-out"
                    style={{ 
                      transform: `translateY(${parallaxOffset}px)`,
                    }}
                  >
                    {activeGame.id === 'lumber-chopper' ? (
                      <video 
                        src={activeGame.video} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover scale-[1.05]" 
                      />
                    ) : (
                      <img 
                        src={activeGame.image} 
                        alt={activeGame.title} 
                        className="w-full h-full object-cover scale-[1.05]" 
                      />
                    )}
                  </div>

                  {/* Ambient dark vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/40 pointer-events-none" />

                  {/* Overlaid UI Element representing mobile HUD */}
                  <div className="absolute bottom-3 left-3 right-3 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-2.5 flex items-center justify-between z-20">
                    <div className="flex items-center gap-2">
                      <img src={activeGame.image} className="w-7 h-7 rounded-lg object-cover border border-white/10" />
                      <div className="font-mono">
                        <h5 className="text-[9px] font-black text-white uppercase">{activeGame.title}</h5>
                        <span className="text-[6px] text-amber-400 font-bold tracking-wider">SYSTEM ACTIVE</span>
                      </div>
                    </div>
                    <span className="text-[7px] font-bold px-2 py-1 bg-amber-400 text-black rounded-md flex items-center gap-0.5 animate-pulse font-mono">
                      <Play size={6} fill="black" /> INSERT COIN
                    </span>
                  </div>
                </div>

                {/* Bezel Title */}
                <div className="text-center mt-2.5">
                  <span className="text-[9px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                    — DASI POCKET ADVANCE —
                  </span>
                </div>
              </div>

              {/* Physical Handheld Controller Area */}
              <div className="h-[130px] w-full relative flex justify-between items-center px-4 pt-1.5 select-none shrink-0 border-t border-[#293652]/20">
                {/* D-Pad */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <div className="absolute w-12 h-4.5 bg-[#0d121c] rounded shadow-md border border-neutral-700/30" />
                  <div className="absolute h-12 w-4.5 bg-[#0d121c] rounded shadow-md border border-neutral-700/30" />
                  <div className="absolute w-3.5 h-3.5 bg-[#172030] z-10 rounded-full border border-neutral-700/20" />
                </div>

                {/* Start / Select rubber pills */}
                <div className="flex gap-2 mt-6">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-2 bg-[#0d121c] rounded-full rotate-[-25deg] shadow-inner border border-neutral-700/30 cursor-pointer" />
                    <span className="text-[5px] text-[#8596ad] font-mono font-bold mt-1.5">SELECT</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-2 bg-[#0d121c] rounded-full rotate-[-25deg] shadow-inner border border-neutral-700/30 cursor-pointer" />
                    <span className="text-[5px] text-[#8596ad] font-mono font-bold mt-1.5">START</span>
                  </div>
                </div>

                {/* A / B buttons */}
                <div className="flex gap-2.5 rotate-[-15deg] pr-1">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#cc293b] hover:bg-[#b82132] active:scale-95 transition-all shadow-md flex items-center justify-center text-white font-bold font-mono text-[9px] border border-red-800 cursor-pointer">B</div>
                    <span className="text-[5px] text-[#8596ad] font-mono font-bold mt-1">CANCEL</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-[#1db954] hover:bg-[#1aa34a] active:scale-95 transition-all shadow-md flex items-center justify-center text-white font-bold font-mono text-[9px] border border-green-800 cursor-pointer">A</div>
                    <span className="text-[5px] text-[#8596ad] font-mono font-bold mt-1">ACCEPT</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Scroll Indicator helper */}
            <div className="absolute bottom-4 right-6 flex items-center gap-1.5 font-mono text-[9px] text-[#8596ad] z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              {autoplay ? 'AUTO_DEMO_RUNNING' : 'WHEEL_TO_SCROLL'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// CANVAS PARTICLE VORTEX BACKGROUND COMPONENT
function CanvasParticleVortex({ 
  hoveredIndex, 
  hoveredCenter 
}: { 
  hoveredIndex: number | null; 
  hoveredCenter: { x: number; y: number } | null 
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    alpha: number;
    baseVx: number;
    baseVy: number;
    angle: number;
    orbitRadius: number;
    orbitSpeed: number;
    orbitDirection: number;
  }>>([]);

  const hoveredIndexRef = useRef(hoveredIndex);
  const hoveredCenterRef = useRef(hoveredCenter);

  // Sync refs with props to avoid rebuilding particles on state change
  useEffect(() => {
    hoveredIndexRef.current = hoveredIndex;
    hoveredCenterRef.current = hoveredCenter;
  }, [hoveredIndex, hoveredCenter]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let lastIndex: number | null = -1;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles exactly once
    if (particlesRef.current.length === 0) {
      const particleCount = 120;
      for (let i = 0; i < particleCount; i++) {
        const vx = (Math.random() - 0.5) * 0.6;
        const vy = (Math.random() - 0.5) * 0.6;
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx,
          vy,
          baseVx: vx,
          baseVy: vy,
          size: Math.random() * 2.5 + 1.5,
          color: 'rgba(98, 144, 157, 0.5)',
          alpha: Math.random() * 0.5 + 0.3,
          angle: Math.random() * Math.PI * 2,
          orbitRadius: 50 + Math.random() * 130, // Orbit bands between 50px and 180px
          orbitSpeed: 0.008 + Math.random() * 0.012, // Slow, elegant orbital speed
          orbitDirection: Math.random() > 0.5 ? 1 : -1
        });
      }
    }

    const animate = () => {
      // Semi-transparent background for retro phosphor trail effect
      ctx.fillStyle = 'rgba(7, 14, 29, 0.18)'; 
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const currentHoveredIndex = hoveredIndexRef.current;
      const currentHoveredCenter = hoveredCenterRef.current;

      // Select active theme color
      let themeColor = 'rgba(98, 144, 157, '; // Default alice-blue
      if (currentHoveredIndex === 0) themeColor = 'rgba(241, 196, 15, '; // Gold
      else if (currentHoveredIndex === 1) themeColor = 'rgba(46, 204, 113, '; // Green
      else if (currentHoveredIndex === 2) themeColor = 'rgba(52, 152, 219, '; // Blue

      // Smooth orbit orientation switch on hover index change
      if (currentHoveredIndex !== lastIndex) {
        if (currentHoveredIndex !== null && currentHoveredCenter) {
          particlesRef.current.forEach(p => {
            // Recalculate angles relative to the new center to prevent sudden jumps
            p.angle = Math.atan2(p.y - currentHoveredCenter.y, p.x - currentHoveredCenter.x);
          });
        }
        lastIndex = currentHoveredIndex;
      }

      particlesRef.current.forEach(p => {
        if (currentHoveredIndex !== null && currentHoveredCenter) {
          // Orbital motion
          p.angle += p.orbitSpeed * p.orbitDirection;

          // Target point on circle
          const targetX = currentHoveredCenter.x + Math.cos(p.angle) * p.orbitRadius;
          const targetY = currentHoveredCenter.y + Math.sin(p.angle) * p.orbitRadius;

          // Steering force (spring attraction)
          const dx = targetX - p.x;
          const dy = targetY - p.y;
          p.vx += dx * 0.025;
          p.vy += dy * 0.025;

          // Damping to keep it smooth
          p.vx *= 0.93;
          p.vy *= 0.93;

          // Glow particle color
          p.color = themeColor + p.alpha.toFixed(2) + ')';
        } else {
          // Drag back to default drift
          p.vx += (p.baseVx - p.vx) * 0.04;
          p.vy += (p.baseVy - p.vy) * 0.04;
          
          // Smooth fade back to neutral alice-blue
          p.color = 'rgba(98, 144, 157, ' + (p.alpha * 0.6).toFixed(2) + ')';
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;

        // Render particle as a retro square (phosphor cell!)
        ctx.fillStyle = p.color;
        if (currentHoveredIndex !== null) {
          ctx.shadowBlur = p.size * 2;
          ctx.shadowColor = themeColor + '0.8)';
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
        ctx.shadowBlur = 0; // reset
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// CONCEPT 2: 3D Flip Card & Canvas Particle Vortex
function ConceptCardVortex() {
  const [flippedCards, setFlippedCards] = useState<boolean[]>([false, false, false]);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [hoveredCenter, setHoveredCenter] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    // 3D Tilting engine
    const card = e.currentTarget;
    if (flippedCards[idx]) {
      // If flipped, kill tilt rotation to prevent rendering overlap
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.2 });
      return;
    }
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rotateY = ((x - cx) / cx) * 10; // Max 10 deg
    const rotateX = -((y - cy) / cy) * 10;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1000,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out'
    });

    // Move shine overlay
    const shine = card.querySelector('.card-shine') as HTMLElement;
    if (shine) {
      gsap.to(shine, {
        opacity: 0.15,
        left: `${(x / rect.width) * 100}%`,
        top: `${(y / rect.height) * 100}%`,
        duration: 0.2
      });
    }

    // Update particle tracker coordinates
    const container = containerRef.current;
    if (container) {
      const cRect = container.getBoundingClientRect();
      const pX = rect.left - cRect.left + rect.width / 2;
      const pY = rect.top - cRect.top + rect.height / 2;
      setHoveredCenter({ x: pX, y: pY });
    }
  };

  const handleCardMouseLeave = (card: HTMLDivElement, idx: number) => {
    setHoveredIndex(null);
    setHoveredCenter(null);
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)'
    });

    const shine = card.querySelector('.card-shine') as HTMLElement;
    if (shine) {
      gsap.to(shine, { opacity: 0, duration: 0.4 });
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Overview Card */}
      <div className="bg-[#0a1429] border border-white/5 p-4 rounded-xl mb-4 flex items-start gap-4 z-10">
        <div className="p-2.5 bg-[#2ecc71]/10 rounded-lg text-[#2ecc71] mt-1">
          <TrendingUp size={18} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Concept 2: 3D Cartridge & Canvas Particle Vortex</h4>
          <p className="text-xs text-[#8596ad] mt-1 leading-relaxed">
            Gamified experience using interactive 3D elements. Hovering cards triggers a real-time mouse-linked 3D depth-tilt, while an HTML5 Canvas behind the grid orbits theme-colored vortex particles around the focused card. Clicking a card flips it over to show detailed stats.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-[#2ecc71]/10 border border-[#2ecc71]/20 text-[#2ecc71] rounded-lg text-xs font-semibold">
          <span>Interaction: Click / Hover</span>
        </div>
      </div>

      {/* Main Workspace Frame with CRT Screen & Cyber Vector Grid */}
      <div 
        ref={containerRef}
        className="flex-1 bg-[#040914] rounded-2xl border-2 border-[#1c3022] shadow-[0_0_20px_rgba(28,48,34,0.3)] relative flex items-center justify-center p-8 overflow-hidden min-h-[500px] crt-screen crt-flicker"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(46, 204, 113, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(46, 204, 113, 0.05) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      >
        {/* Retro Header info */}
        <div className="absolute top-2 left-4 right-4 flex justify-between items-center font-mono text-[9px] text-[#2ebd68]/70 z-20 pointer-events-none">
          <span>[CARTRIDGE STORAGE BANK]</span>
          <span>CHIP: VORTEX_DSP_16BIT // SCAN_RADAR: OK</span>
        </div>

        {/* Particle Vortex Background */}
        <CanvasParticleVortex hoveredIndex={hoveredIndex} hoveredCenter={hoveredCenter} />

        {/* 3D Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-10 my-4">
          {gamesData.map((game, idx) => (
            <div
              key={game.id}
              onClick={() => toggleFlip(idx)}
              onMouseMove={(e) => {
                setHoveredIndex(idx);
                handleCardMouseMove(e, idx);
              }}
              onMouseLeave={(e) => handleCardMouseLeave(e.currentTarget, idx)}
              className="relative h-[380px] w-full rounded-2xl cursor-pointer select-none group transition-all duration-300"
              style={{ 
                perspective: '1200px',
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Card Inner Wrapper handling Flip Rotation */}
              <div
                className="w-full h-full relative transition-transform duration-700 ease-out"
                style={{
                  transformStyle: 'preserve-3d',
                  transform: flippedCards[idx] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                }}
              >
                {/* Front Side: Vintage Retro Cartridge Design */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#121c2c] border-2 border-neutral-700/80 flex flex-col justify-between overflow-hidden shadow-2xl"
                  style={{ 
                    backfaceVisibility: 'hidden', 
                    WebkitBackfaceVisibility: 'hidden',
                    boxShadow: hoveredIndex === idx ? `0 0 25px ${game.accent}33` : 'none'
                  }}
                >
                  {/* Cartridge Top Grip Ridges */}
                  <div className="h-5 bg-neutral-800 border-b-2 border-black flex justify-around px-5 items-center gap-1.5 shrink-0 select-none">
                    <span className="w-full h-1 bg-neutral-700/80 rounded" />
                    <span className="w-full h-1 bg-neutral-700/80 rounded" />
                    <span className="w-full h-1 bg-neutral-700/80 rounded" />
                    <span className="w-full h-1 bg-neutral-700/80 rounded" />
                    <span className="w-full h-1 bg-neutral-700/80 rounded" />
                  </div>

                  {/* Inside Label Border (simulating physical sticker) */}
                  <div className="flex-1 m-3 rounded-xl bg-[#080d1a] border border-neutral-800 p-4 flex flex-col justify-between relative">
                    {/* Card Shine */}
                    <div className="card-shine absolute -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full blur-3xl opacity-0 pointer-events-none mix-blend-overlay z-10" />

                    {/* Header */}
                    <div className="flex justify-between items-center z-10 font-mono">
                      <span className="text-[8px] font-bold px-2 py-0.5 bg-[#2ecc71]/10 border border-[#2ecc71]/30 rounded text-[#2ecc71] tracking-widest uppercase">
                        {game.stats.engine.split(' ')[0]} 16B
                      </span>
                      <span className="text-[9px] text-[#8596ad] font-bold">⭐ {game.stats.rating}</span>
                    </div>

                    {/* Visual Center */}
                    <div className="flex flex-col items-center justify-center my-2 z-10">
                      <div className="relative group-hover:scale-105 transition-all duration-500">
                        {/* Accent glow behind image */}
                        <div 
                          className="absolute inset-0 rounded-2xl blur-xl opacity-30 transition-opacity group-hover:opacity-55"
                          style={{ backgroundColor: game.accent }}
                        />
                        <img 
                          src={game.image} 
                          alt={game.title} 
                          className="w-20 h-20 rounded-2xl object-cover relative z-10 border-2 border-neutral-700 shadow-lg"
                        />
                      </div>
                      <h3 className="text-base font-black text-white tracking-wider mt-3 text-center uppercase font-mono">
                        {game.title}
                      </h3>
                      {/* Retro seal of quality sticker */}
                      <div className="mt-1.5 flex items-center justify-center gap-1">
                        <span className="text-[6px] px-1.5 py-0.5 bg-yellow-500/15 border border-yellow-500/40 text-yellow-400 rounded-sm font-mono tracking-wider font-bold animate-pulse">
                          ★ DASI ORIGINAL SEAL ★
                        </span>
                      </div>
                    </div>

                    {/* Footer CTA */}
                    <div className="border-t border-white/5 pt-2.5 text-center z-10">
                      <span className="text-[8px] font-mono font-bold tracking-widest text-[#82a6b0] uppercase group-hover:text-white transition-colors flex items-center justify-center gap-1">
                        READ SPECS <ChevronRight size={8} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* Back Side: Cyber Cartridge Diagnostics & Retro Warnings */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#0a0f1a] border-2 border-neutral-700/80 flex flex-col justify-between p-5 overflow-hidden"
                  style={{ 
                    transform: 'rotateY(180deg)', 
                    backfaceVisibility: 'hidden', 
                    WebkitBackfaceVisibility: 'hidden' 
                  }}
                >
                  <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                    <img src={game.image} className="w-8 h-8 rounded-lg object-cover border border-neutral-700" />
                    <div className="font-mono">
                      <h4 className="text-xs font-black text-white uppercase">{game.title}</h4>
                      <span className="text-[7px] text-[#8596ad] uppercase tracking-wider">// DASI_SYSTEM_CART</span>
                    </div>
                  </div>

                  {/* Specifications details */}
                  <div className="flex-1 my-3 flex flex-col justify-around text-[10px] text-[#8596ad] font-mono">
                    <div className="flex justify-between border-b border-white/5 py-0.5">
                      <span>SYS CHIP</span>
                      <strong className="text-white">16-BIT 68000</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 py-0.5">
                      <span>AUDIO COPROC</span>
                      <strong className="text-white">YM2612 SYNTH</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 py-0.5">
                      <span>ROM CAPACITY</span>
                      <strong className="text-white">32 MEGABITS</strong>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <span>BATTERY SAVE</span>
                      <strong className="text-green-400 font-bold uppercase tracking-wider text-[8px] flex items-center gap-0.5">
                        <CheckCircle2 size={8} /> CR2032 ENGAGED
                      </strong>
                    </div>
                  </div>

                  {/* Nostalgic Retro Warning Label */}
                  <div className="bg-red-950/25 border border-red-500/15 rounded p-1.5 text-[6px] text-red-400/80 uppercase font-mono leading-normal text-center mb-1">
                    WARNING: DO NOT BLOW INTO CONNECTORS. AVOID STATIC DISCHARGE. INSERT FIRMLY.
                  </div>

                  {/* Store Link Actions + Barcode */}
                  <div className="flex gap-2 items-center justify-between border-t border-white/10 pt-3">
                    <div className="flex gap-1.5">
                      <a 
                        href={game.playstoreLink} 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()}
                        rel="noopener noreferrer"
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#8596ad] hover:text-white transition-colors"
                        title="Google Play"
                      >
                        <Laptop size={10} />
                      </a>
                      <a 
                        href={game.appstoreLink} 
                        target="_blank" 
                        onClick={(e) => e.stopPropagation()}
                        rel="noopener noreferrer"
                        className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#8596ad] hover:text-white transition-colors"
                        title="App Store"
                      >
                        <Smartphone size={10} />
                      </a>
                    </div>
                    
                    {/* Retro CSS Barcode */}
                    <div className="flex items-center justify-center gap-[1.5px] bg-white px-2 py-0.5 rounded-sm select-none h-6">
                      <div className="w-[1px] h-full bg-black"></div>
                      <div className="w-[2px] h-full bg-black"></div>
                      <div className="w-[1px] h-full bg-black"></div>
                      <div className="w-[3px] h-full bg-black"></div>
                      <div className="w-[1px] h-full bg-black"></div>
                      <div className="w-[2px] h-full bg-black"></div>
                      <div className="w-[1px] h-full bg-black"></div>
                      <span className="text-[6px] font-mono text-black font-bold ml-1">DASI-{idx}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// WEBGL LIQUID-MORPHING CANVAS SLIDER
function WebGLMorphSlider() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [cursorHovered, setCursorHovered] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const transitionRef = useRef({ active: false });

  // WebGL Context References
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const texturesRef = useRef<WebGLTexture[]>([]);
  const uProgressLocRef = useRef<WebGLUniformLocation | null>(null);
  const uCanvasSizeLocRef = useRef<WebGLUniformLocation | null>(null);
  const uTexture1LocRef = useRef<WebGLUniformLocation | null>(null);
  const uTexture2LocRef = useRef<WebGLUniformLocation | null>(null);

  // Fallback CSS fade system state
  const [prevIndex, setPrevIndex] = useState(0);
  const [fadeProgress, setFadeProgress] = useState(0);

  // Setup WebGL engine
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
    const imageUrls = gamesData.map(g => g.image);
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const handleLoadedImages = (imgs: HTMLImageElement[]) => {
      // Load image files as WebGL textures
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
        // Build procedural colors on canvas if local image links fail
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
      canvas.width = canvas.parentElement?.offsetWidth || 800;
      canvas.height = canvas.parentElement?.offsetHeight || 500;
      drawWebGL(activeIndex, activeIndex, 0);
    };
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // WebGL Render call
  const drawWebGL = (currIdx: number, targetIdx: number, progress: number) => {
    const gl = glRef.current;
    const program = programRef.current;
    const textures = texturesRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || textures.length === 0 || !canvas) return;

    // Viewport resize
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    // Bind textures
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[currIdx]);
    if (uTexture1LocRef.current) gl.uniform1i(uTexture1LocRef.current, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[targetIdx]);
    if (uTexture2LocRef.current) gl.uniform1i(uTexture2LocRef.current, 1);

    // Upload progress uniform
    if (uProgressLocRef.current) gl.uniform1f(uProgressLocRef.current, progress);

    // Upload canvas dimension uniforms
    if (uCanvasSizeLocRef.current) gl.uniform2f(uCanvasSizeLocRef.current, canvas.width, canvas.height);

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  // Trigger liquid transition when index changes
  const transitionTo = (targetIdx: number) => {
    if (targetIdx === activeIndex || transitionRef.current.active) return;
    transitionRef.current.active = true;

    setPrevIndex(activeIndex);
    setActiveIndex(targetIdx);

    const animationObj = { progress: 0 };

    gsap.to(animationObj, {
      progress: 1,
      duration: 1.3,
      ease: 'power2.inOut',
      onUpdate: () => {
        setFadeProgress(animationObj.progress);
        if (webglSupported) {
          drawWebGL(activeIndex, targetIdx, animationObj.progress);
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

    // Stagger animation text inside viewport
    const container = sliderRef.current;
    if (container) {
      gsap.fromTo(
        container.querySelectorAll('.slider-hud-element'),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1, delay: 0.2 }
      );
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setCursorPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const activeGame = gamesData[activeIndex];

  return (
    <div className="flex flex-col h-full">
      {/* Overview Card */}
      <div className="bg-[#0a1429] border border-white/5 p-4 rounded-xl mb-4 flex items-start gap-4 z-10 font-sans">
        <div className="p-2.5 bg-blue-500/10 rounded-lg text-blue-500 mt-1">
          <Cpu size={18} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Concept 3: WebGL Liquid-Morphing Slider</h4>
          <p className="text-xs text-[#8596ad] mt-1 leading-relaxed">
            A premium full-screen slider utilizing a custom WebGL fragment shader. Clicking navigation buttons triggers a displacement morphing shader transition that liquifies and disperses pixels. A custom mouse-follower badge creates organic magnetic interactions.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg text-xs font-semibold">
          <span>GLSL Fragment Shader + GSAP</span>
        </div>
      </div>

      {/* Main Workspace Frame with CRT Screen & Tech Border */}
      <div 
        ref={sliderRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setCursorHovered(true)}
        onMouseLeave={() => setCursorHovered(false)}
        className="flex-1 bg-[#02050b] rounded-2xl border-2 border-[#192b45] shadow-[0_0_20px_rgba(25,43,69,0.3)] relative overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[500px] cursor-none select-none crt-screen crt-flicker"
      >
        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 bg-[#040812] z-50 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#82a6b0]">BUFFERING MEMORY MAP...</span>
          </div>
        )}

        {/* WebGL Canvas */}
        {webglSupported ? (
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          // CSS Fallback Displacement Container
          <div className="absolute inset-0 w-full h-full">
            {/* Background 1 */}
            <img 
              src={gamesData[prevIndex].image} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500" 
              style={{ 
                opacity: 1 - fadeProgress, 
                transform: `scale(${1 + fadeProgress * 0.05})`,
                filter: `blur(${fadeProgress * 10}px)`
              }} 
            />
            {/* Background 2 */}
            <img 
              src={gamesData[activeIndex].image} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500" 
              style={{ 
                opacity: fadeProgress, 
                transform: `scale(${1.05 - fadeProgress * 0.05})`,
                filter: `blur(${(1 - fadeProgress) * 10}px)`
              }} 
            />
          </div>
        )}

        {/* Dark Overlay vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50 z-10 pointer-events-none" />

        {/* Custom Retro Magnetic Wireframe Crosshair Cursor Overlay */}
        <div 
          className="absolute pointer-events-none z-40 transition-transform duration-75 ease-out hidden md:flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${cursorPos.x}px`, 
            top: `${cursorPos.y}px`,
            opacity: cursorHovered ? 1 : 0,
            transform: `translate(-50%, -50%) scale(${cursorHovered ? 1 : 0.2})`
          }}
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            {/* Outer dotted spinning wireframe ring */}
            <div 
              className="absolute inset-0 rounded-full border border-dashed animate-[spin_10s_linear_infinite]"
              style={{ 
                borderColor: activeGame.accent, 
                boxShadow: `0 0 12px ${activeGame.accent}44` 
              }}
            />
            {/* Inner solid ring */}
            <div 
              className="absolute w-8 h-8 rounded-full border border-double"
              style={{ borderColor: activeGame.accent }}
            />
            {/* Crosshair target lines */}
            <div className="absolute w-5 h-[1px]" style={{ backgroundColor: activeGame.accent }} />
            <div className="absolute h-5 w-[1px]" style={{ backgroundColor: activeGame.accent }} />
            {/* HUD Target readout text */}
            <span 
              className="absolute top-10 font-mono text-[7px] bg-black/85 px-1.5 py-0.5 rounded border border-white/10 text-white tracking-widest whitespace-nowrap"
              style={{ textShadow: `0 0 5px ${activeGame.accent}` }}
            >
              LOCK: {activeGame.title.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Foreground Content HUD */}
        <div className="relative z-20 max-w-lg pointer-events-none">
          <span className="slider-hud-element text-[10px] font-mono font-bold text-amber-400 tracking-widest uppercase inline-flex items-center gap-1.5 mb-2 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded shadow-[0_0_8px_rgba(241,196,15,0.15)]">
            <span className="w-1 h-1 bg-amber-400 rounded-full animate-ping" />
            MAINFRAME DISPLACEMENT NODE
          </span>
          <h2 
            className="slider-hud-element text-4xl md:text-6xl font-black text-white uppercase tracking-wider mb-3 leading-none font-mono"
            style={{ textShadow: `0 0 15px ${activeGame.accent}66` }}
          >
            {activeGame.title}
          </h2>
          <p className="slider-hud-element text-xs text-[#8596ad] leading-relaxed mb-4 font-sans">
            {activeGame.description}
          </p>
          
          {/* Retro Diagnostic HUD Panel */}
          <div className="slider-hud-element font-mono text-[8px] text-[#5c728e] border border-white/5 bg-black/60 p-3 rounded-xl space-y-1 mt-4 mb-6 max-w-[280px]">
            <div className="flex justify-between">
              <span>&gt; TRANSITION:</span>
              <span className="text-blue-400 font-bold">COSINE_WAVE_GLSL</span>
            </div>
            <div className="flex justify-between">
              <span>&gt; PIXEL_SAMPLING:</span>
              <span className="text-blue-400 font-bold">BILINEAR_MAPPED</span>
            </div>
            <div className="flex justify-between">
              <span>&gt; RENDER_STATUS:</span>
              <span className="text-green-400 font-bold animate-pulse">LOCK_OK_60FPS</span>
            </div>
          </div>

          <div className="slider-hud-element pointer-events-auto">
            <button 
              className="px-6 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center gap-2 font-mono shadow-lg shadow-white/10"
            >
              <Play size={12} fill="black" /> BOOT_GAME_SYS <ArrowRight size={12} />
            </button>
          </div>
        </div>

        {/* Navigation Dot Indicators */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 pointer-events-auto">
          {gamesData.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => transitionTo(idx)}
              className="group relative flex items-center justify-end w-12 h-12 rounded-full focus:outline-none"
            >
              {/* Tooltip Label */}
              <span className="absolute right-full mr-4 bg-[#080f21]/95 border border-white/10 px-2.5 py-1 rounded-md text-[8px] font-mono font-black text-[#8596ad] uppercase tracking-widest opacity-0 scale-75 origin-right transition-all group-hover:opacity-100 group-hover:scale-100 shadow-[0_0_12px_rgba(0,0,0,0.5)]">
                {game.title}
              </span>
              
              {/* Index number or dot */}
              <span className={`text-xs font-mono font-bold tracking-wider ${
                activeIndex === idx ? 'text-white scale-125' : 'text-[#8596ad] group-hover:text-white transition-colors'
              }`}>
                0{idx + 1}
              </span>

              {/* Active Dot ring */}
              <span className={`absolute bottom-0 right-0 w-full h-full rounded-full border border-white/10 transition-all ${
                activeIndex === idx 
                  ? 'border-white scale-110' 
                  : 'scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-95'
              }`} 
                style={{
                  borderColor: activeIndex === idx ? game.accent : 'rgba(255,255,255,0.1)'
                }}
              />
            </button>
          ))}
        </div>

        {/* Floating retro system status indicator */}
        <div className="absolute top-6 right-6 font-mono text-[8px] text-[#8596ad] flex items-center gap-2 z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
          GLSL_PIXEL_DISPLACEMENT_MORPH
        </div>
      </div>
    </div>
  );
}

// MAIN PAGE COMPONENT
export default function FeaturedShowcaseSandbox() {
  const [activeConcept, setActiveConcept] = useState<'concept1' | 'concept2' | 'concept3'>('concept1');

  return (
    <>
      <style>{`
        @keyframes crt-flicker {
          0% { opacity: 0.98; }
          50% { opacity: 1.0; }
          100% { opacity: 0.985; }
        }
        @keyframes scanline-scroll {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .crt-screen {
          position: relative;
          overflow: hidden;
        }
        .crt-screen::before {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; bottom: 0; right: 0;
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.16) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
          z-index: 28;
          background-size: 100% 3px, 4px 100%;
          pointer-events: none;
        }
        .crt-screen::after {
          content: " ";
          display: block;
          position: absolute;
          top: 0; left: 0; right: 0; height: 100px;
          background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.03), transparent);
          animation: scanline-scroll 8s linear infinite;
          pointer-events: none;
          z-index: 29;
        }
        .crt-flicker {
          animation: crt-flicker 0.15s infinite;
        }
      `}</style>
      <Header />
      <main className="min-h-screen bg-[#050913] text-white pt-28 pb-16 px-6 font-sans relative overflow-hidden">
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Global gradient lights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col gap-6 relative z-10">
          {/* Header Description */}
          <div className="border-b border-white/10 pb-6 mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#82a6b0] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              DASI GAMES CREATIVE LAB
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-wider text-white mt-2 uppercase font-mono">
              Featured Showcase Sandbox
            </h1>
            <p className="text-xs md:text-sm text-[#8596ad] mt-2 max-w-3xl leading-relaxed">
              Explore the three interactive concept sections designed for our premium games portfolio. Click below to experience custom parallax layers, orbit-stabilized canvas vortex physics, and WebGL pixel-displacement shaders.
            </p>
          </div>

          {/* Interactive Concept Switcher Tab */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-2 bg-[#080f1e] border border-white/5 rounded-2xl w-full font-mono">
            <button
              onClick={() => setActiveConcept('concept1')}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeConcept === 'concept1'
                  ? 'bg-amber-500 text-black shadow-[0_0_15px_rgba(241,196,15,0.3)]'
                  : 'text-[#8596ad] hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={14} />
              <span>1. DASI Pocket Parallax</span>
            </button>
            <button
              onClick={() => setActiveConcept('concept2')}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeConcept === 'concept2'
                  ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(46,204,113,0.3)]'
                  : 'text-[#8596ad] hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp size={14} />
              <span>2. Cartridge + Particle Vortex</span>
            </button>
            <button
              onClick={() => setActiveConcept('concept3')}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                activeConcept === 'concept3'
                  ? 'bg-blue-500 text-black shadow-[0_0_15px_rgba(52,152,219,0.3)]'
                  : 'text-[#8596ad] hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu size={14} />
              <span>3. Mainframe WebGL Slider</span>
            </button>
          </div>

          {/* Render Active Concept Workspace */}
          <div className="min-h-[550px] w-full flex flex-col">
            {activeConcept === 'concept1' && <ConceptSplitParallax />}
            {activeConcept === 'concept2' && <ConceptCardVortex />}
            {activeConcept === 'concept3' && <WebGLMorphSlider />}
          </div>

          {/* Specification documentation & Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
            {/* Spec Card 1 */}
            <div className="bg-[#0a1429] border border-white/5 p-6 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#82a6b0] mb-3 flex items-center gap-1.5">
                <Info size={12} /> performance metrics
              </h4>
              <div className="space-y-3.5 text-xs text-[#8596ad]">
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span>Concept 1 CPU Impact</span>
                  <span className="font-mono text-green-400 font-bold">Ultra Low (GSAP DOM)</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                  <span>Concept 2 GPU Impact</span>
                  <span className="font-mono text-amber-400 font-bold">Medium (Canvas 2D loop)</span>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <span>Concept 3 WebGL Load</span>
                  <span className="font-mono text-red-400 font-bold">High (Fragment shader)</span>
                </div>
              </div>
            </div>

            {/* Spec Card 2 */}
            <div className="bg-[#0a1429] border border-white/5 p-6 rounded-2xl">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#82a6b0] mb-3 flex items-center gap-1.5">
                <Cpu size={12} /> developer features
              </h4>
              <ul className="text-xs text-[#8596ad] space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Self-contained GLSL shader compiler
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Responsive CSS grid card perspectives
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  Staggered entrance GSAP animations
                </li>
              </ul>
            </div>

            {/* Spec Card 3 */}
            <div className="bg-[#0a1429] border border-white/5 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-[#82a6b0] mb-2.5 flex items-center gap-1.5">
                  <CheckCircle2 size={12} /> implementation readiness
                </h4>
                <p className="text-xs text-[#8596ad] leading-relaxed">
                  Concept 1 is highly recommended for mobile responsiveness, whereas Concept 2 offers superior card game branding. Concept 3 remains the ultimate visual premium design.
                </p>
              </div>
              <a 
                href="/docs/project_description.md"
                target="_blank"
                className="mt-4 text-[10px] font-black uppercase tracking-widest text-white hover:text-[#82a6b0] flex items-center gap-1"
              >
                view project specs <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
