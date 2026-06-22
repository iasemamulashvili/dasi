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

      {/* Main Workspace Frame */}
      <div className="flex-1 bg-black rounded-2xl border border-white/10 overflow-hidden relative flex flex-col min-h-[500px]">
        {/* Top Browser Bar */}
        <div className="h-10 bg-[#0a1429] border-b border-white/5 flex items-center px-4 justify-between select-none z-30 shrink-0">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="text-[10px] text-[#8596ad] font-mono tracking-widest uppercase">
            PINNED VIEWPORT SIMULATOR ({Math.round(scrollProgress * 100)}% SCROLL)
          </span>
          <div className="w-14" />
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
          <div className={`w-full md:w-[45%] h-1/2 md:h-full p-6 md:p-12 flex flex-col justify-center transition-all duration-1000 bg-gradient-to-br ${activeGame.bgGradient} border-b md:border-b-0 md:border-r border-white/5 relative z-10 overflow-hidden`}>
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="relative z-10">
              {gamesData.map((game, idx) => {
                if (idx !== activeIndex) return null;
                return (
                  <div 
                    key={game.id} 
                    ref={(el) => { textSectionRefs.current[idx] = el; }}
                    className="flex flex-col"
                  >
                    <span className="text-xs font-bold uppercase tracking-widest text-[#82a6b0] mb-2 animate-fade-in-stagger inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      FEATURED FLAGSHIP GAME
                    </span>
                    <h3 className="text-3xl md:text-5xl font-black text-white tracking-wide uppercase mb-3">
                      {game.title.split('').map((char, cIdx) => (
                        <span key={cIdx} className="inline-block animate-title-split origin-bottom">
                          {char === ' ' ? '\u00A0' : char}
                        </span>
                      ))}
                    </h3>
                    <p className="text-sm font-medium text-amber-400/90 mb-4 tracking-wide uppercase animate-fade-in-stagger">
                      {game.subtitle}
                    </p>
                    <p className="text-xs text-[#8596ad] leading-relaxed mb-6 max-w-sm animate-fade-in-stagger">
                      {game.description}
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6 border-t border-white/5 pt-4 animate-fade-in-stagger">
                      <div>
                        <span className="text-[10px] uppercase text-[#8596ad] tracking-widest block">Active Players</span>
                        <span className="text-lg font-black text-white">{game.stats.activePlayers}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase text-[#8596ad] tracking-widest block">Rating</span>
                        <span className="text-lg font-black text-white">⭐ {game.stats.rating} / 5</span>
                      </div>
                    </div>

                    {/* Redirection Links */}
                    <div className="flex items-center gap-4 animate-fade-in-stagger">
                      <a 
                        href={game.playstoreLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-[#8596ad] hover:text-white hover:border-amber-400 hover:bg-amber-400/5 transition-all"
                      >
                        <Laptop size={14} />
                        <span>Google Play</span>
                      </a>
                      <a 
                        href={game.appstoreLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-[#8596ad] hover:text-white hover:border-amber-400 hover:bg-amber-400/5 transition-all"
                      >
                        <Smartphone size={14} />
                        <span>App Store</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel: Widescreen visual mockup window (55%) */}
          <div className="w-full md:w-[55%] h-1/2 md:h-full bg-[#050b15] relative flex items-center justify-center p-6 select-none z-10">
            {/* Ambient blur background */}
            <div 
              className="absolute inset-0 opacity-20 blur-3xl transition-all duration-1000"
              style={{
                background: `radial-gradient(circle, ${activeGame.accent} 0%, transparent 60%)`
              }}
            />

            {/* Simulated Mobile Device Chassis Container */}
            <div className="relative w-[280px] h-[480px] md:w-[310px] md:h-[520px] bg-[#0a1429] border-[6px] border-white/15 rounded-[40px] shadow-2xl shadow-black/80 overflow-hidden flex flex-col justify-between p-2.5 z-10">
              {/* Speaker Bezel */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-2xl z-40 flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-800" />
              </div>

              {/* Dynamic screen display */}
              <div className="relative flex-1 bg-black rounded-[30px] overflow-hidden border border-white/5 flex items-center justify-center">
                {/* Parallax moving image wrapper */}
                <div 
                  className="absolute inset-0 w-full h-[120%] transition-transform duration-500 ease-out"
                  style={{ 
                    transform: `translateY(${parallaxOffset}px)`,
                  }}
                >
                  {/* Dynamic gameplay video for lumber chopper, otherwise rich cover graphic */}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

                {/* Overlaid UI Element representing mobile HUD */}
                <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img src={activeGame.image} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <h5 className="text-[10px] font-black text-white uppercase">{activeGame.title}</h5>
                      <span className="text-[8px] text-[#8596ad]">DASI GAMES</span>
                    </div>
                  </div>
                  <span className="text-[8px] font-bold px-2 py-1 bg-amber-400 text-black rounded-md flex items-center gap-0.5 animate-pulse">
                    <Play size={8} fill="black" /> PLAY
                  </span>
                </div>
              </div>
            </div>
            
            {/* Scroll Indicator helper */}
            <div className="absolute bottom-4 right-6 flex items-center gap-1.5 font-mono text-[9px] text-[#8596ad] z-20">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
              {autoplay ? 'AUTOPLAY ACTIVE' : 'USE WHEEL TO SCROLL'}
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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      baseVx: number;
      baseVy: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 800;
      canvas.height = canvas.parentElement?.offsetHeight || 600;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Populate particles
    const particleCount = 100;
    for (let i = 0; i < particleCount; i++) {
      const vx = (Math.random() - 0.5) * 0.8;
      const vy = (Math.random() - 0.5) * 0.8;
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx,
        vy,
        baseVx: vx,
        baseVy: vy,
        size: Math.random() * 2 + 1,
        color: '#62909d',
        alpha: Math.random() * 0.4 + 0.2
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(7, 14, 29, 0.15)'; // Fade trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Select active theme color
      let themeColor = 'rgba(98, 144, 157, '; // Default alice-blue
      if (hoveredIndex === 0) themeColor = 'rgba(241, 196, 15, '; // Gold
      else if (hoveredIndex === 1) themeColor = 'rgba(46, 204, 113, '; // Green
      else if (hoveredIndex === 2) themeColor = 'rgba(52, 152, 219, '; // Blue

      particles.forEach(p => {
        if (hoveredIndex !== null && hoveredCenter) {
          // Gravitate towards active card center
          const dx = hoveredCenter.x - p.x;
          const dy = hoveredCenter.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist > 10) {
            const pullForce = 0.18;
            p.vx += (dx / dist) * pullForce;
            p.vy += (dy / dist) * pullForce;

            // Swirl orbital rotation force
            const swirlForce = 0.08;
            p.vx += (-dy / dist) * swirlForce;
            p.vy += (dx / dist) * swirlForce;
          }

          // Speed ceiling
          const maxSpeed = 7;
          const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
          if (speed > maxSpeed) {
            p.vx = (p.vx / speed) * maxSpeed;
            p.vy = (p.vy / speed) * maxSpeed;
          }

          // Glow particle color
          p.color = themeColor + p.alpha.toFixed(2) + ')';
        } else {
          // Drag back to default drift
          p.vx += (p.baseVx - p.vx) * 0.08;
          p.vy += (p.baseVy - p.vy) * 0.08;
          
          // Smooth fade back to neutral alice-blue
          p.color = 'rgba(98, 144, 157, ' + p.alpha.toFixed(2) + ')';
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around borders
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Render particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        if (hoveredIndex !== null) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = themeColor + '0.8)';
        } else {
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, [hoveredIndex, hoveredCenter]);

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
        <div className="p-2.5 bg-green-500/10 rounded-lg text-green-500 mt-1">
          <TrendingUp size={18} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">Concept 2: 3D Flip Card & Canvas Particle Vortex</h4>
          <p className="text-xs text-[#8596ad] mt-1 leading-relaxed">
            Gamified experience using interactive 3D elements. Hovering cards triggers a real-time mouse-linked 3D depth-tilt, while an HTML5 Canvas behind the grid orbits theme-colored vortex particles around the focused card. Clicking a card flips it over to show detailed stats.
          </p>
        </div>
        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-xs font-semibold">
          <span>Interaction: Click / Hover</span>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div 
        ref={containerRef}
        className="flex-1 bg-[#070e1d] rounded-2xl border border-white/10 relative flex items-center justify-center p-8 overflow-hidden min-h-[500px]"
      >
        {/* Particle Vortex Background */}
        <CanvasParticleVortex hoveredIndex={hoveredIndex} hoveredCenter={hoveredCenter} />

        {/* 3D Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl z-10">
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
                {/* Front Side */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#0a1429]/90 backdrop-blur-sm border border-white/5 flex flex-col justify-between p-5 overflow-hidden"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                  {/* Card Shine */}
                  <div className="card-shine absolute -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full blur-3xl opacity-0 pointer-events-none mix-blend-overlay z-10" />

                  {/* Header */}
                  <div className="flex justify-between items-center z-10">
                    <span className="text-[9px] font-bold px-2 py-0.5 bg-white/5 border border-white/10 rounded-full text-[#8596ad] tracking-widest uppercase">
                      {game.stats.engine}
                    </span>
                    <span className="text-xs text-[#8596ad] font-bold">⭐ {game.stats.rating}</span>
                  </div>

                  {/* Visual Center */}
                  <div className="flex flex-col items-center justify-center my-4 z-10">
                    <div className="relative group-hover:scale-105 transition-all duration-500">
                      {/* Accent glow behind image */}
                      <div 
                        className="absolute inset-0 rounded-3xl blur-2xl opacity-40 transition-opacity group-hover:opacity-60"
                        style={{ backgroundColor: game.accent }}
                      />
                      <img 
                        src={game.image} 
                        alt={game.title} 
                        className="w-24 h-24 rounded-3xl object-cover relative z-10 border border-white/10 shadow-xl"
                      />
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-wide mt-4 text-center">
                      {game.title}
                    </h3>
                    <p className="text-[10px] text-amber-400 font-mono tracking-widest uppercase mt-1">
                      {game.subtitle}
                    </p>
                  </div>

                  {/* Footer CTA */}
                  <div className="border-t border-white/5 pt-3 text-center z-10">
                    <span className="text-[9px] font-bold tracking-widest text-[#82a6b0] uppercase group-hover:text-white transition-colors flex items-center justify-center gap-1">
                      READ SPECS <ChevronRight size={10} />
                    </span>
                  </div>
                </div>

                {/* Back Side */}
                <div 
                  className="absolute inset-0 w-full h-full rounded-2xl bg-[#0b0f19] border border-white/10 flex flex-col justify-between p-5 overflow-hidden"
                  style={{ 
                    transform: 'rotateY(180deg)', 
                    backfaceVisibility: 'hidden', 
                    WebkitBackfaceVisibility: 'hidden' 
                  }}
                >
                  <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                    <img src={game.image} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <h4 className="text-xs font-black text-white uppercase">{game.title}</h4>
                      <span className="text-[8px] text-[#8596ad] uppercase font-mono tracking-widest">{game.stats.engine}</span>
                    </div>
                  </div>

                  {/* Specifications details */}
                  <div className="flex-1 my-3 flex flex-col justify-around text-xs text-[#8596ad]">
                    <div className="flex justify-between border-b border-white/5 py-1">
                      <span>Active Community</span>
                      <strong className="text-white">{game.stats.activePlayers}</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 py-1">
                      <span>Total Downloads</span>
                      <strong className="text-white">{game.stats.downloads}</strong>
                    </div>
                    <div className="flex justify-between border-b border-white/5 py-1">
                      <span>Platform Coverage</span>
                      <strong className="text-white font-mono text-[9px] uppercase">Cross-Platform</strong>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Status</span>
                      <strong className="text-green-400 font-bold uppercase tracking-wider text-[9px] flex items-center gap-1">
                        <CheckCircle2 size={10} /> LIVE IN STORES
                      </strong>
                    </div>
                  </div>

                  {/* Store Link Actions */}
                  <div className="flex gap-2 justify-center border-t border-white/5 pt-3">
                    <a 
                      href={game.playstoreLink} 
                      target="_blank" 
                      onClick={(e) => e.stopPropagation()}
                      rel="noopener noreferrer"
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#8596ad] hover:text-white transition-colors"
                      title="Google Play"
                    >
                      <Laptop size={12} />
                    </a>
                    <a 
                      href={game.appstoreLink} 
                      target="_blank" 
                      onClick={(e) => e.stopPropagation()}
                      rel="noopener noreferrer"
                      className="p-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[#8596ad] hover:text-white transition-colors"
                      title="App Store"
                    >
                      <Smartphone size={12} />
                    </a>
                    <button 
                      className="flex-1 text-[9px] font-bold tracking-widest text-[#070e1d] bg-white rounded-lg flex items-center justify-center gap-1 py-2 hover:bg-neutral-200 transition-colors"
                    >
                      FLIP CARD
                    </button>
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
      <div className="bg-[#0a1429] border border-white/5 p-4 rounded-xl mb-4 flex items-start gap-4 z-10">
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

      {/* Main Workspace Frame */}
      <div 
        ref={sliderRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setCursorHovered(true)}
        onMouseLeave={() => setCursorHovered(false)}
        className="flex-1 bg-black rounded-2xl border border-white/10 relative overflow-hidden flex flex-col justify-end p-8 md:p-12 min-h-[500px] cursor-none select-none"
      >
        {/* Loader */}
        {loading && (
          <div className="absolute inset-0 bg-[#070e1d] z-50 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 rounded-full border-2 border-white/10 border-t-blue-500 animate-spin" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#82a6b0]">Loading Textures...</span>
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 z-10 pointer-events-none" />

        {/* Custom Magnetic Cursor Overlay */}
        <div 
          className="absolute pointer-events-none z-40 transition-transform duration-100 ease-out hidden md:flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${cursorPos.x}px`, 
            top: `${cursorPos.y}px`,
            opacity: cursorHovered ? 1 : 0,
            transform: `translate(-50%, -50%) scale(${cursorHovered ? 1 : 0.2})`
          }}
        >
          <div 
            className="w-16 h-16 rounded-full border border-white/40 bg-black/40 backdrop-blur-sm flex items-center justify-center animate-pulse"
            style={{ boxShadow: `0 0 20px ${activeGame.accent}33` }}
          >
            <span className="text-[8px] font-black text-white tracking-widest uppercase">MORPH</span>
          </div>
        </div>

        {/* Foreground Content HUD */}
        <div className="relative z-20 max-w-lg pointer-events-none">
          <span className="slider-hud-element text-[10px] font-bold text-amber-400 tracking-widest uppercase inline-block mb-2">
            PREMIUM SCREEN REVOLUTION
          </span>
          <h2 className="slider-hud-element text-4xl md:text-6xl font-black text-white uppercase tracking-wide mb-3 leading-none">
            {activeGame.title}
          </h2>
          <p className="slider-hud-element text-xs text-[#8596ad] leading-relaxed mb-6">
            {activeGame.description}
          </p>
          <div className="slider-hud-element pointer-events-auto">
            <button className="px-6 py-3 rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors flex items-center gap-2">
              <Play size={12} fill="black" /> PLAY NOW <ArrowRight size={12} />
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
              <span className="absolute right-full mr-4 bg-[#0a1429]/90 border border-white/5 px-2.5 py-1 rounded-md text-[9px] font-black text-[#8596ad] uppercase tracking-widest opacity-0 scale-75 origin-right transition-all group-hover:opacity-100 group-hover:scale-100">
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

        {/* Floating tech badge */}
        <div className="absolute top-6 right-6 font-mono text-[9px] text-[#8596ad] flex items-center gap-1.5 z-20">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping" />
          WebGL fragment rendering active
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
      <Header />
      <main className="min-h-screen bg-[#070e1d] text-white pt-28 pb-16 px-6 font-sans relative overflow-hidden">
        {/* Decorative Grid Mesh */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        {/* Global gradient lights */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col gap-6 relative z-10">
          {/* Header Description */}
          <div className="border-b border-white/10 pb-6 mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#82a6b0] flex items-center gap-1.5">
              <span>●</span> CREATIVE PLAYGROUND
            </span>
            <h1 className="text-3xl md:text-5xl font-black tracking-wide text-white mt-2 uppercase">
              Featured Showcase Sandbox
            </h1>
            <p className="text-xs md:text-sm text-[#8596ad] mt-2 max-w-3xl leading-relaxed">
              Test, inspect, and experience the three design concepts proposed for our premium featured games landing sections. Click between options to play with interactive animations, canvas physics, and fragment shaders.
            </p>
          </div>

          {/* Interactive Concept Switcher Tab */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-1.5 bg-[#0a1429]/80 backdrop-blur-md border border-white/5 rounded-2xl w-full">
            <button
              onClick={() => setActiveConcept('concept1')}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeConcept === 'concept1'
                  ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                  : 'text-[#8596ad] hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={14} />
              <span>1. Split-Screen Parallax</span>
            </button>
            <button
              onClick={() => setActiveConcept('concept2')}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeConcept === 'concept2'
                  ? 'bg-green-500 text-[#070e1d] shadow-lg shadow-green-500/20'
                  : 'text-[#8596ad] hover:text-white hover:bg-white/5'
              }`}
            >
              <TrendingUp size={14} />
              <span>2. 3D Card + Canvas Vortex</span>
            </button>
            <button
              onClick={() => setActiveConcept('concept3')}
              className={`flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeConcept === 'concept3'
                  ? 'bg-blue-500 text-[#070e1d] shadow-lg shadow-blue-500/20'
                  : 'text-[#8596ad] hover:text-white hover:bg-white/5'
              }`}
            >
              <Cpu size={14} />
              <span>3. WebGL Liquid Slider</span>
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
