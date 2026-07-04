'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Globe, ArrowRight, Play, ExternalLink } from 'lucide-react';
import { Game } from '@/utils/db';

gsap.registerPlugin(ScrollTrigger);

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

interface CyberScanningMatrixProps {
  isHovered: boolean;
  gameId: string;
}

function CyberScanningMatrix({ isHovered, gameId }: CyberScanningMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isHoveredRef = useRef(isHovered);

  // Sync hover state ref without recreating the animation loop
  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const fontSize = 10;
    let columns = Math.floor(canvas.width / fontSize) || 20;
    let drops: number[] = Array(columns).fill(0).map(() => Math.random() * -30);

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      columns = Math.floor(canvas.width / fontSize) || 20;
      drops = Array(columns).fill(0).map(() => Math.random() * -30);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZMATRIXSYS';
    let sweepY = 0;
    let sweepDirection = 1;

    let isVisible = false;

    const animate = () => {
      if (!isVisible) return;

      // Fade trail
      ctx.fillStyle = 'rgba(18, 18, 20, 0.12)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 1. Matrix code rain
      ctx.font = `${fontSize}px monospace`;
      
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Draw character
        const randVal = Math.random();
        if (randVal > 0.94) {
          ctx.fillStyle = '#ffffff'; // White highlights
        } else if (randVal > 0.55) {
          ctx.fillStyle = 'oklch(0.91 0.01 240.0)'; // Platinum silver
        } else if (randVal > 0.25) {
          ctx.fillStyle = 'oklch(0.61 0.025 285.0)'; // Slate-violet light
        } else {
          ctx.fillStyle = 'oklch(0.36 0 3.2)'; // Graphite/carbon-black tone
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += isHoveredRef.current ? 1.4 : 0.75;
      }

      // 2. Scan sweep
      const sweepSpeed = isHoveredRef.current ? 3.5 : 1.5;
      sweepY += sweepSpeed * sweepDirection;
      if (sweepY > canvas.height) {
        sweepY = canvas.height;
        sweepDirection = -1;
      } else if (sweepY < 0) {
        sweepY = 0;
        sweepDirection = 1;
      }

      // Sweep gradient glow - slate-violet
      const grad = ctx.createLinearGradient(0, sweepY - 12, 0, sweepY + 12);
      grad.addColorStop(0, 'rgba(120, 119, 198, 0)');
      grad.addColorStop(0.5, 'rgba(120, 119, 198, 0.15)');
      grad.addColorStop(1, 'rgba(120, 119, 198, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, sweepY - 12, canvas.width, 24);

      // Scanline beam - silver/white highlight
      ctx.fillStyle = 'oklch(0.91 0.01 240.0 / 0.4)';
      ctx.fillRect(0, sweepY, canvas.width, 1);

      // 3. Diagnostic vertical tracking bar - graphite/slate-violet
      const padding = 12;
      const barW = 3;
      const barH = canvas.height - padding * 2;
      
      ctx.strokeStyle = 'oklch(0.61 0.025 285.0 / 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(padding, padding, barW, barH);
      
      const level = 0.5 + Math.sin(Date.now() * 0.002) * 0.35;
      ctx.fillStyle = 'oklch(0.61 0.025 285.0 / 0.5)';
      ctx.fillRect(padding, padding + barH * (1 - level), barW, barH * level);

      // 4. CRT Fine scan lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 5. Corner readout
      ctx.fillStyle = 'oklch(0.61 0.025 285.0 / 0.6)';
      ctx.font = '8px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('CYBER_SCAN: ON', padding + 10, padding + 10);
      ctx.fillText(`SWEEP: ${sweepY.toFixed(0)}PX`, padding + 10, padding + 20);

      animationId = requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const wasVisible = isVisible;
        isVisible = entry.isIntersecting;
        if (isVisible && !wasVisible) {
          animate();
        } else if (!isVisible && wasVisible) {
          cancelAnimationFrame(animationId);
        }
      },
      { threshold: 0.02 }
    );
    observer.observe(canvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      observer.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, [gameId]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" />;
}

// Main Component
export default function GamesShowcase({ initialGames }: { initialGames: Game[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const nudgeRef = useRef<HTMLDivElement>(null);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);

  useEffect(() => {
    // Intercept vertical scroll and slide cards horizontally
    const ctx = gsap.context(() => {
      const container = cardsContainerRef.current;
      if (!container) return;
      
      const cards = container.children;
      if (!cards || cards.length === 0) return;

      const totalWidth = container.scrollWidth;
      const viewWidth = window.innerWidth;
      const scrollDistance = totalWidth - viewWidth;

      if (scrollDistance > 0) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: scrollSectionRef.current,
            pin: true,
            scrub: 1.2,
            start: 'top top',
            end: () => `+=${scrollDistance}`,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          }
        });

        tl.to(container, {
          x: -scrollDistance,
          ease: 'none',
        });

        if (nudgeRef.current) {
          tl.to(nudgeRef.current, {
            opacity: 0,
            y: 15,
            ease: 'power1.out',
          }, 0);
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [initialGames]);

  // Handle 3D Tilting on mouse move
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, cardElement: HTMLDivElement) => {
    const rect = cardElement.getBoundingClientRect();
    const x = e.clientX - rect.left; // x coordinate relative to card
    const y = e.clientY - rect.top;  // y coordinate relative to card

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;

    gsap.to(cardElement, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });

    // Move shine element
    const shineEl = cardElement.querySelector('.card-shine') as HTMLElement;
    if (shineEl) {
      gsap.to(shineEl, {
        opacity: 0.15,
        left: `${(x / rect.width) * 100}%`,
        top: `${(y / rect.height) * 100}%`,
        duration: 0.2,
      });
    }
  };

  const handleCardMouseLeave = (cardElement: HTMLDivElement) => {
    gsap.to(cardElement, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });

    const shineEl = cardElement.querySelector('.card-shine') as HTMLElement;
    if (shineEl) {
      gsap.to(shineEl, {
        opacity: 0,
        duration: 0.5,
      });
    }
  };

  return (
    <div id="portfolio" ref={containerRef} className="bg-transparent">
      {/* Scroll Trigger container */}
      <div ref={scrollSectionRef} className="h-screen flex flex-col justify-center overflow-hidden relative">
        {/* Section Title */}
        <div className="max-w-7xl mx-auto px-6 w-full mb-8 z-20">
          <span className="text-xs font-silkscreen tracking-widest text-slate-violet-light uppercase flex items-center gap-2">
            <span>•</span> Our Portfolio Showcase
          </span>
          <h2 className="text-3xl md:text-5xl font-normal text-bright-snow tracking-wide mt-2 font-russo-one retro-heading-shadow">
            Explore Our Creations
          </h2>
        </div>

        {/* Horizontal Card Stream */}
        <div
          ref={cardsContainerRef}
          className="flex items-center gap-8 px-12 md:px-24 w-max select-none z-20 py-8"
        >
          {initialGames.map((game, index) => (
            <div
              key={game.id}
              onMouseMove={(e) => handleCardMouseMove(e, e.currentTarget)}
              onMouseLeave={(e) => {
                handleCardMouseLeave(e.currentTarget);
                setHoveredCardIndex(null);
              }}
              onMouseEnter={() => setHoveredCardIndex(index)}
              className="relative w-[320px] md:w-[360px] h-[460px] md:h-[500px] inset-pixel-card inset-pixel-card-interactive overflow-hidden flex flex-col p-6 cursor-pointer select-none transition-all duration-300 transform-gpu group"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Shine Layer */}
              <div className="card-shine absolute -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full blur-2xl opacity-0 pointer-events-none mix-blend-overlay z-10" />

              {/* Game Visual Area */}
              <div className="relative w-full h-[240px] md:h-[260px] bg-carbon-black rounded-lg overflow-hidden mb-6 flex items-center justify-center border border-graphite-light">
                {/* Fallback Looping Particle Canvas or Looping Video */}
                {game.videoSrc ? (
                  hoveredCardIndex === index && (
                    <video
                      src={game.videoSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover z-0 video-entrance"
                    />
                  )
                ) : (
                  <div className="absolute inset-0 w-full h-full z-0 video-entrance">
                    <CyberScanningMatrix isHovered={hoveredCardIndex === index} gameId={game.id} />
                  </div>
                )}

                {/* Big Game Artwork / Icon - Full-Bleed with Shrink-to-Video Transition */}
                <img
                  src={game.iconSrc}
                  alt={game.iconAlt}
                  className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out z-10 ${
                    hoveredCardIndex === index ? 'scale-90 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
                  }`}
                />

                {/* Play Button Indicator - Smooth Fade Out */}
                <div className={`absolute inset-0 bg-black/20 flex items-center justify-center transition-all duration-500 z-20 ${
                  hoveredCardIndex === index ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}>
                  <span className="p-3 bg-carbon-black/90 border border-graphite-light rounded-xl text-bright-snow shadow-lg transition-transform duration-300 group-hover:scale-110">
                    <Play size={16} fill="currentColor" />
                  </span>
                </div>
              </div>

              {/* Game Metadata info */}
              <div className="flex-1 flex flex-col justify-between relative z-10" style={{ transform: 'translateZ(30px)' }}>
                <div>
                  <h3 className="text-xl font-normal text-bright-snow tracking-wide mb-2 font-russo-one">
                    {game.title}
                  </h3>
                  <p className="text-xs text-alabaster-grey leading-relaxed line-clamp-3 font-outfit font-light">
                    {game.description}
                  </p>
                </div>

                {/* Platforms & Store badge redirection links */}
                <div className="flex items-center justify-between border-t border-graphite-light pt-4 mt-4">
                  {/* Supported Stores badges */}
                  <div className="flex items-center gap-2">
                    {game.isIOS && game.appstoreLink && (
                      <a
                        href={game.appstoreLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-carbon-black border border-graphite-light rounded-none text-alabaster-grey hover:text-bright-snow hover:border-platinum-silver transition-all flex items-center justify-center"
                        title="iOS App Store"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <AppStoreIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {game.isAndroid && game.playstoreLink && (
                      <a
                        href={game.playstoreLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-carbon-black border border-graphite-light rounded-none text-alabaster-grey hover:text-bright-snow hover:border-platinum-silver transition-all flex items-center justify-center"
                        title="Google Play Store"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <PlayStoreIcon className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {game.isPoki && game.pokiLink && (
                      <a
                        href={game.pokiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-carbon-black border border-graphite-light rounded-none text-alabaster-grey hover:text-bright-snow hover:border-platinum-silver transition-all"
                        title="Play on Poki"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe size={14} />
                      </a>
                    )}
                  </div>

                  {/* Play/View Link */}
                  <div className="flex items-center gap-1 text-xs font-silkscreen tracking-widest text-platinum-silver hover:text-bright-snow transition-colors group">
                    <span>PLAY NOW</span>
                    <ArrowRight size={12} className="transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Show More Card */}
          <a
            href="https://play.google.com/store/apps/dev?id=5818328852601157830&hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="relative w-[280px] h-[460px] md:h-[500px] border-2 border-dashed border-graphite-light bg-carbon-black-2 rounded-none flex flex-col items-center justify-center p-6 text-center hover:border-platinum-silver group transition-all duration-300"
          >
            {/* 8-Bit Corner Pixel Blocks */}
            <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-graphite-light group-hover:bg-platinum-silver transition-colors z-30" />
            <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-graphite-light group-hover:bg-platinum-silver transition-colors z-30" />
            <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-graphite-light group-hover:bg-platinum-silver transition-colors z-30" />
            <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-graphite-light group-hover:bg-platinum-silver transition-colors z-30" />

            <div className="p-4 bg-carbon-black rounded-none border border-graphite-light text-alabaster-grey group-hover:border-platinum-silver group-hover:text-platinum-silver transition-all duration-300 mb-4">
              <ExternalLink size={24} />
            </div>
            <h3 className="text-lg font-normal text-bright-snow mb-2 font-russo-one">View All Games</h3>
            <p className="text-xs text-alabaster-grey leading-relaxed mb-6 font-outfit font-light">
              Check out our complete portfolio page on Google Play developer page.
            </p>
            <div className="flex items-center gap-2 text-xs font-silkscreen tracking-widest text-platinum-silver group-hover:text-bright-snow">
              <span>SHOW MORE</span>
              <ArrowRight size={12} />
            </div>
          </a>
        </div>

        {/* Scroll Nudge Indicator */}
        <div 
          ref={nudgeRef}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1.5 pointer-events-none transition-opacity duration-300"
        >
          <span className="text-[9px] font-silkscreen tracking-widest text-slate-violet-light/80 uppercase">
            Scroll Down to Explore
          </span>
          <div className="w-5 h-8 border border-slate-violet-light/40 rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-platinum-silver rounded-full animate-[bounce_1.6s_ease-in-out_infinite]" />
          </div>
        </div>
      </div>
    </div>
  );
}
