'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smartphone, Laptop, Globe, ArrowRight, Play, ExternalLink } from 'lucide-react';
import { Game } from '@/utils/db';

gsap.registerPlugin(ScrollTrigger);

// Particle system helper for the canvas video fallback
class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
  gravity?: number;

  constructor(x: number, y: number, color: string, type: string) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * 3 + 1;
    this.color = color;
    this.alpha = 1;
    this.decay = Math.random() * 0.02 + 0.005;

    if (type === 'crown-quest') {
      // Fire particle rising
      this.vx = Math.random() * 1.5 - 0.75;
      this.vy = -(Math.random() * 2 + 1);
    } else if (type === 'lumber-chopper') {
      // Wood chips falling
      this.vx = Math.random() * 2 - 1;
      this.vy = Math.random() * 2 + 1.5;
      this.gravity = 0.05;
    } else {
      // General floating nodes
      this.vx = Math.random() * 0.8 - 0.4;
      this.vy = Math.random() * 0.8 - 0.4;
    }
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.gravity) this.vy += this.gravity;
    this.alpha -= this.decay;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.restore();
  }
}

// Canvas Fallback component
function GameVideoFallback({ gameId }: { gameId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const particles: Particle[] = [];

    // Colors matching game themes
    let colors = ['#62909d', '#82a6b0', '#ebf0fa']; // general
    if (gameId === 'crown-quest') colors = ['#e05a36', '#f39c12', '#f1c40f']; // fire/gold
    if (gameId === 'lumber-chopper') colors = ['#27ae60', '#2ecc71', '#d35400']; // green/orange
    if (gameId === 'hotel-manager') colors = ['#3498db', '#9b59b6', '#ecf0f1']; // luxury blue/purple

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.offsetWidth || 300;
      canvas.height = canvas.parentElement?.offsetHeight || 400;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const animate = () => {
      ctx.fillStyle = 'rgba(7, 14, 29, 0.2)'; // fade trail
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add particles
      if (Math.random() < 0.2) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        if (gameId === 'crown-quest') {
          // Add flame particles at bottom center
          particles.push(new Particle(canvas.width / 2 + (Math.random() * 40 - 20), canvas.height - 10, color, gameId));
        } else if (gameId === 'lumber-chopper') {
          // Add wood chip particles from top
          particles.push(new Particle(Math.random() * canvas.width, 0, color, gameId));
        } else {
          // Random float
          particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height, color, gameId));
        }
      }

      // Draw and clean particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      // Special backdrop effects
      if (gameId === 'crown-quest') {
        // Draw a central glowing orb
        const grad = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 10, canvas.width / 2, canvas.height / 2, 80);
        grad.addColorStop(0, 'rgba(224, 90, 54, 0.15)');
        grad.addColorStop(1, 'rgba(7, 14, 29, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, 80, 0, Math.PI * 2);
        ctx.fill();
      }

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
        gsap.to(container, {
          x: -scrollDistance,
          ease: 'none',
          scrollTrigger: {
            trigger: scrollSectionRef.current,
            pin: true,
            scrub: 1.2,
            start: 'top top',
            end: () => `+=${scrollDistance}`,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
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

    // Calculate rotation angles (max 10 degrees)
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
    <div id="games" ref={containerRef} className="bg-dasi-black-950">
      {/* Scroll Trigger container */}
      <div ref={scrollSectionRef} className="h-screen flex flex-col justify-center overflow-hidden relative">
        {/* Section Title */}
        <div className="max-w-7xl mx-auto px-6 w-full mb-8 z-20">
          <span className="text-xs font-bold tracking-widest text-dasi-alice-400 uppercase flex items-center gap-2">
            <span>•</span> OUR PORTFOLIO SHOWCASE
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-wide mt-2">
            EXPLORE OUR CREATIONS
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
              className="relative w-[320px] md:w-[360px] h-[460px] md:h-[500px] bg-dasi-black-900 border border-white/5 rounded-2xl overflow-hidden glass-panel glass-panel-hover flex flex-col p-6 cursor-pointer select-none transition-all duration-300 transform-gpu"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Card Glow Border */}
              <div
                className={`absolute inset-0 border-2 rounded-2xl pointer-events-none transition-opacity duration-500 z-30 ${
                  hoveredCardIndex === index ? 'border-dasi-alice-400/30 opacity-100 glow-border-cyan' : 'border-transparent opacity-0'
                }`}
              />

              {/* Shine Layer */}
              <div className="card-shine absolute -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full blur-2xl opacity-0 pointer-events-none pointer-events-none mix-blend-overlay z-10" />

              {/* Game Visual Area */}
              <div className="relative w-full h-[240px] md:h-[260px] bg-dasi-black-950 rounded-xl overflow-hidden mb-6 flex items-center justify-center border border-white/5">
                {/* Fallback Looping Particle Canvas or Looping Video */}
                {hoveredCardIndex === index ? (
                  game.videoSrc ? (
                    <video
                      src={game.videoSrc}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover z-0"
                    />
                  ) : (
                    <GameVideoFallback gameId={game.id} />
                  )
                ) : null}

                {/* Big Game Artwork / Icon */}
                <div
                  className={`flex flex-col items-center justify-center transition-all duration-500 ${
                    hoveredCardIndex === index ? 'scale-75 opacity-20 pointer-events-none' : 'scale-100 opacity-100'
                  } z-10`}
                >
                  <img
                    src={game.iconSrc}
                    alt={game.iconAlt}
                    className="w-24 h-24 rounded-2xl object-cover shadow-lg shadow-black/40 border border-white/10"
                  />
                </div>

                {/* Play Button Indicator */}
                {hoveredCardIndex !== index && (
                  <div className="absolute inset-0 bg-black/10 hover:bg-black/20 flex items-center justify-center transition-colors">
                    <span className="p-3 bg-dasi-black-950/80 backdrop-blur-sm border border-white/10 rounded-full text-white scale-95 hover:scale-100 transition-all duration-300">
                      <Play size={16} fill="white" />
                    </span>
                  </div>
                )}
              </div>

              {/* Game Metadata info */}
              <div className="flex-1 flex flex-col justify-between relative z-10" style={{ transform: 'translateZ(30px)' }}>
                <div>
                  <h3 className="text-xl font-bold text-white tracking-wide mb-2">
                    {game.title}
                  </h3>
                  <p className="text-xs text-dasi-steel-400 leading-relaxed line-clamp-3">
                    {game.description}
                  </p>
                </div>

                {/* Platforms & Store badge redirection links */}
                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4">
                  {/* Supported Stores badges */}
                  <div className="flex items-center gap-2">
                    {game.isIOS && game.appstoreLink && (
                      <a
                        href={game.appstoreLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-dasi-ink-900 border border-white/5 rounded-lg text-dasi-steel-400 hover:text-white hover:border-dasi-alice-400 transition-all"
                        title="iOS App Store"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Smartphone size={14} />
                      </a>
                    )}
                    {game.isAndroid && game.playstoreLink && (
                      <a
                        href={game.playstoreLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-dasi-ink-900 border border-white/5 rounded-lg text-dasi-steel-400 hover:text-white hover:border-dasi-alice-400 transition-all"
                        title="Google Play Store"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Laptop size={14} />
                      </a>
                    )}
                    {game.isPoki && game.pokiLink && (
                      <a
                        href={game.pokiLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-dasi-ink-900 border border-white/5 rounded-lg text-dasi-steel-400 hover:text-white hover:border-dasi-alice-400 transition-all"
                        title="Play on Poki"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Globe size={14} />
                      </a>
                    )}
                  </div>

                  {/* Play/View Link */}
                  <div className="flex items-center gap-1 text-xs font-bold tracking-wider text-dasi-alice-400 hover:text-white transition-colors group">
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
            className="relative w-[280px] h-[460px] md:h-[500px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center p-6 text-center hover:border-dasi-alice-400 group transition-all duration-300"
          >
            <div className="p-4 bg-dasi-ink-900 rounded-full border border-white/5 text-dasi-steel-400 group-hover:border-dasi-alice-400 group-hover:text-dasi-alice-400 transition-all duration-300 mb-4">
              <ExternalLink size={24} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">View All Games</h3>
            <p className="text-xs text-dasi-steel-400 leading-relaxed mb-6">
              Check out our complete portfolio page on Google Play developer page.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-dasi-alice-400 group-hover:underline">
              <span>SHOW MORE</span>
              <ArrowRight size={12} />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
