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

// Canvas Fallback component drawing premium wave lines
function GameVideoFallback({ gameId }: { gameId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Theme-based colors in our new OKLCH brand system
    let primaryColor = 'rgba(109, 109, 128, 0.6)'; // slate-violet
    let secondaryColor = 'rgba(226, 232, 240, 0.4)'; // platinum-silver
    
    if (gameId === 'crown-quest') {
      primaryColor = 'rgba(226, 232, 240, 0.7)';
      secondaryColor = 'rgba(109, 109, 128, 0.4)';
    } else if (gameId === 'lumber-chopper') {
      primaryColor = 'rgba(82, 122, 105, 0.7)'; // Sage green
      secondaryColor = 'rgba(109, 109, 128, 0.4)';
    }

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 300;
      canvas.height = canvas.parentElement?.offsetHeight || 400;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.fillStyle = 'rgba(24, 24, 24, 0.08)'; // Deep carbon-black trailing fade
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Wave 1
      ctx.beginPath();
      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 2.5;
      for (let x = 0; x <= canvas.width; x += 5) {
        const y = canvas.height / 2 + 
          Math.sin(x * 0.008 + time * 0.04) * 25 * Math.cos(x * 0.003 + time * 0.02);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw Wave 2
      ctx.beginPath();
      ctx.strokeStyle = secondaryColor;
      ctx.lineWidth = 1.5;
      for (let x = 0; x <= canvas.width; x += 5) {
        const y = canvas.height / 2 + 
          Math.cos(x * 0.012 - time * 0.03) * 20 * Math.sin(x * 0.005 + time * 0.01);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Draw moving light node across the wave path
      const nodeX = (time * 1.5) % (canvas.width + 100) - 50;
      const nodeY = canvas.height / 2 + 
        Math.sin(nodeX * 0.008 + time * 0.04) * 25 * Math.cos(nodeX * 0.003 + time * 0.02);

      if (nodeX > 0 && nodeX < canvas.width) {
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#f9fafc';
        ctx.shadowBlur = 10;
        ctx.shadowColor = primaryColor;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      time += 0.5;
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [gameId]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />;
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
                {hoveredCardIndex === index && (
                  game.videoSrc ? (
                    <video
                      src={game.videoSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover z-0 video-entrance"
                    />
                  ) : (
                    <div className="absolute inset-0 w-full h-full z-0 video-entrance">
                      <GameVideoFallback gameId={game.id} />
                    </div>
                  )
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
