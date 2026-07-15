'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useAnimationFrame, animate } from 'framer-motion';
import { 
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  MousePointer
} from 'lucide-react';
import { Game } from '@/utils/db';

// Official Store Badges (charcoal-grey bg, silver/zinc outline on hover)
const AppStoreBadge = ({ className = "h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 120 40"
    className={`${className} group cursor-pointer`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      y="0.5"
      width="119"
      height="39"
      rx="6"
      className="fill-[#18181B] stroke-[#27272A] group-hover:fill-[#27272A] group-hover:stroke-[#a1a1aa] transition-colors duration-300"
      strokeWidth={1}
    />
    <g transform="translate(10, 10) scale(0.035)" fill="#ffffff">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-48.7-22.9-76.9-22.4-36.6.6-70.3 21.6-89.2 54.2-38 65.9-9.8 162.8 27.3 216.3 18.2 26.2 39.8 55.3 68.2 54.2 27.2-1.1 37.5-17.6 68.5-17.6 31.1 0 40.4 17.6 68.8 17.1 29-1 48.2-26.4 66.2-52.7 21-30.7 29.7-60.4 30.2-62-1-1-65.2-25.1-65.7-100zM281.2 81.7c15.2-18.3 25.4-43.9 22.6-69.5-22 1-48.8 14.8-64.6 33.2-13.8 15.9-25.9 41.7-22.7 67 24.5 2 49.7-12.4 64.7-30.7z" />
    </g>
    <text x="32" y="16" fill="#A1A1AA" fontSize="5.5" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="500">Download on the</text>
    <text x="32" y="27" fill="#ffffff" fontSize="11" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700">App Store</text>
  </svg>
);

const PlayStoreBadge = ({ className = "h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 120 40"
    className={`${className} group cursor-pointer`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      y="0.5"
      width="119"
      height="39"
      rx="6"
      className="fill-[#18181B] stroke-[#27272A] group-hover:fill-[#27272A] group-hover:stroke-[#a1a1aa] transition-colors duration-300"
      strokeWidth={1}
    />
    <g transform="translate(10, 11) scale(0.035)">
      {/* Left triangle (Cyan) */}
      <path d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" fill="#00E6FF" />
      {/* Top triangle (Red) */}
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#FF3A44" />
      {/* Right triangle (Yellow) */}
      <path d="M472.2 225.6l-58 33.3 60.1 60.1L512 288c0-22-13.7-47.8-40-62.4z" fill="#FFC700" />
      {/* Bottom triangle (Green) */}
      <path d="M325.3 277.7l60.1 60.1L104.6 499l220.7-221.3z" fill="#00F076" />
    </g>
    <text x="32" y="16" fill="#A1A1AA" fontSize="5.5" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="500">GET IT ON</text>
    <text x="32" y="27" fill="#ffffff" fontSize="11" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700">Google Play</text>
  </svg>
);

const PokiPlayBadge = ({ className = "h-8" }: { className?: string }) => (
  <svg
    viewBox="0 0 120 40"
    className={`${className} group cursor-pointer`}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="0.5"
      y="0.5"
      width="119"
      height="39"
      rx="6"
      className="fill-[#18181B] stroke-[#27272A] group-hover:fill-[#27272A] group-hover:stroke-[#a1a1aa] transition-colors duration-300"
      strokeWidth={1}
    />
    <g transform="translate(10, 12)" fill="#BF5AF2">
      <path d="M15 2H3c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9H4v2H3V9H1V8h2V6h1v2h2v1zm7 .5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zm1.5-2c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5z" />
    </g>
    <text x="32" y="16" fill="#A1A1AA" fontSize="5.5" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="500">PLAY NOW ON</text>
    <text x="32" y="27" fill="#ffffff" fontSize="11" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700">Poki Web</text>
  </svg>
);

// Framer Motion kinetic card representing a handheld console bezel frame screen
function KineticCard({ 
  game, 
  index, 
  hoveredIdx, 
  setHoveredIdx,
  isMobile,
  trackX,
  onCardMouseMove,
  onCardMouseLeave,
  cardWidth,
  cardSpacing
}: { 
  game: Game; 
  index: number; 
  hoveredIdx: number | null; 
  setHoveredIdx: (idx: number | null) => void;
  isMobile: boolean;
  trackX: any;
  onCardMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
  onCardMouseLeave: () => void;
  cardWidth: number;
  cardSpacing: number;
}) {
  const isHovered = !isMobile && hoveredIdx === index;

  const activeStores = [
    ...(game.isIOS && game.appstoreLink ? [{ id: 'ios', href: game.appstoreLink, component: <AppStoreBadge className="h-[28px] w-auto" />, label: 'App Store' }] : []),
    ...(game.isAndroid && game.playstoreLink ? [{ id: 'android', href: game.playstoreLink, component: <PlayStoreBadge className="h-[28px] w-auto" />, label: 'Google Play' }] : []),
    ...(game.isPoki && game.pokiLink ? [{ id: 'poki', href: game.pokiLink, component: <PokiPlayBadge className="h-[28px] w-auto" />, label: 'Poki Web' }] : [])
  ];

  // Dynamic Opacity calculation: fades cards as they approach the left/right boundaries of the screen
  const cardCenterInTrack = index * cardSpacing + cardWidth / 2;

  const opacity = useTransform(trackX, (latestX: number) => {
    if (typeof window === 'undefined') return 1;
    const viewportWidth = window.innerWidth;
    const centerX = viewportWidth / 2;
    const cardCenterInViewport = latestX + cardCenterInTrack;
    const distanceFromCenter = Math.abs(cardCenterInViewport - centerX);
    
    // Broaden fading boundary and increase minimum opacity for mobile viewports
    const maxDistance = isMobile ? viewportWidth * 0.75 : viewportWidth * 0.45;
    const normalized = Math.min(distanceFromCenter / maxDistance, 1);
    const minOpacity = isMobile ? 0.35 : 0.15;
    return 1 - normalized * (1 - minOpacity);
  });

  return (
    <motion.div
      onMouseEnter={() => setHoveredIdx(index)}
      onMouseLeave={onCardMouseLeave}
      onMouseMove={onCardMouseMove}
      animate={{
        width: isHovered ? 460 : cardWidth,
        borderColor: isHovered ? 'var(--color-platinum-silver)' : 'rgba(55, 65, 81, 0.4)'
      }}
      transition={{
        type: 'spring',
        stiffness: 145,
        damping: 20
      }}
      style={{ opacity, willChange: 'width, transform' }}
      className="h-[310px] md:h-[360px] bg-carbon-black-2 border border-graphite-light p-4 rounded-2xl flex flex-col justify-between hover:shadow-2xl hover:shadow-white/5 relative group shrink-0 overflow-hidden select-none"
    >
      <div className="absolute inset-px rounded-2xl border border-white/5 pointer-events-none z-25" />

      {/* Handheld Device Bezel Frame Screen */}
      <div className="relative w-full aspect-video bg-zinc-950 rounded-xl border-[5px] border-zinc-800 shadow-[inset_0_0_12px_rgba(0,0,0,0.85)] overflow-hidden flex items-center justify-center">
        {/* Mock Handheld Buttons (visible when card expands) */}
        <div className="absolute left-1.5 top-1/2 -translate-y-1/2 flex flex-col gap-1 z-20 opacity-0 group-hover:opacity-40 transition-opacity duration-300">
          <div className="w-1.5 h-3 bg-zinc-500 rounded-sm" />
          <div className="w-3 h-1.5 bg-zinc-500 rounded-sm -ml-0.5" />
        </div>
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex gap-1.5 z-20 opacity-0 group-hover:opacity-40 transition-opacity duration-300">
          <div className="w-2.5 h-2.5 bg-zinc-500 rounded-full" />
          <div className="w-2.5 h-2.5 bg-zinc-500 rounded-full" />
        </div>

        {/* Video plays continuously in background if present */}
        {game.videoSrc ? (
          <video
            src={game.videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
        ) : null}

        {/* Ambient static icon fallback in background */}
        {!game.videoSrc && (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-zinc-950 z-0">
            <img
              src={game.iconSrc}
              alt={game.title}
              className="w-16 h-16 rounded-xl object-cover border border-white/10 relative z-10 shadow-lg"
            />
            {/* Ambient background blur of the icon */}
            <img
              src={game.iconSrc}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover filter blur-[12px] opacity-20 pointer-events-none"
            />
          </div>
        )}

        {/* Full screen cover thumbnail that shrinks on hover */}
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none origin-center"
          animate={{
            scale: isHovered ? (game.videoSrc ? 0 : 0.45) : 1,
            opacity: isHovered ? (game.videoSrc ? 0 : 1) : 1,
            borderRadius: isHovered && !game.videoSrc ? '12px' : '0px'
          }}
          transition={{
            type: 'spring',
            stiffness: 140,
            damping: 18
          }}
        >
          <img
            src={game.iconSrc}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.15)_50%)] bg-[length:100%_4px] opacity-25" />
        </motion.div>

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none z-30 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_50%,rgba(0,0,0,0.12)_50%)] bg-[size:100%_4px]" />
        
        {/* Bezel inner shadow */}
        <div className="absolute inset-0 pointer-events-none z-30 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
        
        {/* Scanning horizontal line */}
        {isHovered && (
          <div className="absolute inset-x-0 h-[1.5px] bg-white/20 pointer-events-none z-35 animate-scan-line" />
        )}
      </div>

      {/* Card Details */}
      <div className="relative z-10 flex flex-col justify-between flex-1 mt-3 pointer-events-none select-none">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={game.iconSrc}
              alt={game.title}
              className="w-9 h-9 rounded-lg object-cover border border-graphite-light/50"
            />
            <div>
              <h4 className="text-[13px] font-bold text-bright-snow font-russo-one tracking-wide">
                {game.title}
              </h4>
            </div>
          </div>
          <p className={`text-[11px] text-alabaster-grey/75 font-outfit leading-relaxed mt-2.5 line-clamp-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
            {game.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-graphite-light/20 pt-2.5 mt-2 relative">
          {!isMobile && (
            <span className="text-[10px] font-mono text-alabaster-grey/70">
              {game.downloads || 'FREE'}
            </span>
          )}
          
          {isMobile ? (
            <div className="flex items-center justify-between w-full pointer-events-auto">
              <span className="text-[10px] font-mono text-alabaster-grey/70">
                {game.downloads || 'FREE'}
              </span>
              <div className="flex items-center gap-2">
                {activeStores.map((store) => (
                  <a
                    key={store.id}
                    href={store.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer flex shrink-0 py-2 px-1 -my-2 -mx-1"
                    title={store.label}
                  >
                    {store.id === 'ios' ? <AppStoreBadge className="h-[24px] w-auto" /> : 
                     store.id === 'android' ? <PlayStoreBadge className="h-[24px] w-auto" /> : 
                     <PokiPlayBadge className="h-[24px] w-auto" />}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 relative h-[30px] min-w-[120px] justify-end pointer-events-auto">
              <motion.span
                animate={{ x: isHovered && activeStores.length > 0 ? -(activeStores.length * 94 + 6) : 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className="text-[10px] font-bold text-bright-snow flex items-center gap-1 font-outfit uppercase pointer-events-none absolute right-0"
              >
                Play Game <ChevronRight size={12} />
              </motion.span>
              
              <div className="absolute right-0 flex items-center gap-1.5">
                <AnimatePresence>
                  {isHovered && activeStores.map((store, sIdx) => (
                    <motion.a
                      key={store.id}
                      href={store.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      initial={{ opacity: 0, scale: 0, x: 15 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0, x: 15 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: isHovered ? sIdx * 0.08 : 0
                      }}
                      className="cursor-pointer flex shrink-0"
                      title={store.label}
                    >
                      {store.component}
                    </motion.a>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// Kinetic spin stream loop
function KineticSpinStream({ games }: { games: Game[] }) {
  const tripleGames = [...games, ...games, ...games];
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Standard Spacing: Mobile is 265px card + 16px gap, Desktop is 320px card + 24px gap
  const cardWidth = isMobile ? 265 : 320;
  const cardGap = isMobile ? 16 : 24;
  const spacing = cardWidth + cardGap;
  const repeatInterval = games.length * spacing;

  const trackX = useMotionValue(0);
  const hoverOffset = useMotionValue(0);
  const hoverOffsetSpring = useSpring(hoverOffset, { stiffness: 100, damping: 20 });
  
  // Combine core scroll translation with cursor hover shift
  const finalX = useTransform<number, number>([trackX, hoverOffsetSpring], (inputs) => inputs[0] + inputs[1]);

  // Kinetic speed state management (default autoplay direction is leftwards)
  const defaultSpeed = -0.85;
  const currentSpeed = useRef(defaultSpeed);

  useEffect(() => {
    setDragConstraints({
      left: -repeatInterval * 2,
      right: 0
    });
    trackX.set(-repeatInterval);
  }, [repeatInterval, trackX]);

  useAnimationFrame((time, delta) => {
    const currentX = trackX.get();
    const nearestCardIdx = Math.round(-currentX / spacing);
    const mappedActive = ((nearestCardIdx % games.length) + games.length) % games.length;
    if (mappedActive !== activeIndex) {
      setActiveIndex(mappedActive);
    }

    if (isDragging) return;

    const frameFactor = delta / 16.6;

    // Pause on hover, otherwise decay to baseline
    if (hoveredIdx !== null) {
      currentSpeed.current = currentSpeed.current + (0 - currentSpeed.current) * 0.08 * frameFactor;
    } else {
      currentSpeed.current = currentSpeed.current + (defaultSpeed - currentSpeed.current) * 0.035 * frameFactor;
    }

    const speed = currentSpeed.current * frameFactor;
    let nextX = currentX + speed;

    // Continuous loop wrapping
    if (nextX < -repeatInterval * 1.5) {
      nextX += repeatInterval;
    } else if (nextX > -repeatInterval * 0.5) {
      nextX -= repeatInterval;
    }
    trackX.set(nextX);
  });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) - 0.5; // range: -0.5 to 0.5
    // Map this to +/- 15px max displacement shift
    const targetOffset = percentage * 30;
    hoverOffset.set(targetOffset);
  };

  const handleCardMouseLeave = () => {
    setHoveredIdx(null);
    animate(hoverOffset, 0, { type: 'spring', stiffness: 100, damping: 20 });
  };

  const handleDragStart = () => {
    setIsDragging(true);
    currentSpeed.current = defaultSpeed;
  };

  const handleDragEnd = (e: any, info: any) => {
    setIsDragging(false);
    currentSpeed.current = defaultSpeed;

    let currentX = trackX.get();
    if (currentX < -repeatInterval * 1.5) {
      currentX += repeatInterval;
      trackX.set(currentX);
    } else if (currentX > -repeatInterval * 0.5) {
      currentX -= repeatInterval;
      trackX.set(currentX);
    }
  };

  const animateTo = (targetX: number) => {
    animate(trackX, targetX, {
      type: 'spring',
      stiffness: 100,
      damping: 22
    });
  };

  const handleDotClick = (idx: number) => {
    currentSpeed.current = defaultSpeed;
    const targetX = -(games.length + idx) * spacing;
    animateTo(targetX);
    setActiveIndex(idx);
  };

  return (
    <div ref={containerRef} className="w-full relative flex flex-col gap-6 overflow-hidden">
      {/* Dynamic left and right fading edge gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-[#181818] to-transparent z-25 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-[#181818] to-transparent z-25 pointer-events-none" />

      {/* Drag Track Container */}
      <div className="w-full overflow-hidden py-4 cursor-grab active:cursor-grabbing">
        <motion.div style={{ x: hoverOffsetSpring }}>
          <motion.div
            ref={trackRef}
            drag="x"
            style={{ x: trackX }}
            dragConstraints={dragConstraints}
            dragElastic={0.1}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className="flex gap-4 md:gap-6 w-max px-6 touch-pan-y"
          >
            {tripleGames.map((game, index) => (
              <KineticCard
                key={`${game.id}-kinetic-${index}`}
                game={game}
                index={index}
                hoveredIdx={hoveredIdx}
                setHoveredIdx={setHoveredIdx}
                isMobile={isMobile}
                trackX={trackX}
                onCardMouseMove={handleCardMouseMove}
                onCardMouseLeave={handleCardMouseLeave}
                cardWidth={cardWidth}
                cardSpacing={spacing}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Centered Glassmorphic Navigation controls & tech indicator */}
      <div className="flex flex-col items-center justify-center gap-3 w-full mt-4 z-30 px-6">
        {/* Navigation Bar wrapper with Glassmorphism */}
        <div className="flex items-center gap-6 px-5 py-2.5 bg-carbon-black-2/40 backdrop-blur-md border border-slate-700/50 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.45)] relative">
          {/* Clickable Line Dots */}
          <div className="flex gap-2 items-center relative px-2">
            {games.map((_, idx) => (
              <button
                key={idx}
                onClick={() => handleDotClick(idx)}
                className="relative py-2 focus:outline-none cursor-pointer"
                title={`Go to game ${idx + 1}`}
              >
                <motion.div
                  animate={{
                    width: idx === activeIndex ? 24 : 6,
                    backgroundColor: idx === activeIndex ? '#ffffff' : '#3f3f46',
                    opacity: idx === activeIndex ? 1.0 : 0.6
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 20
                  }}
                  className="h-1.5 rounded-full relative z-10"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Shortened helper caption below navigation bar */}
        <div className="text-[8px] font-mono tracking-widest text-alabaster-grey/50 uppercase select-none pointer-events-none">
          DRAG TO SCROLL PORTFOLIO
        </div>
      </div>
    </div>
  );
}

export default function GamesShowcase({ initialGames }: { initialGames: Game[] }) {
  return (
    <section id="portfolio" className="py-20 md:py-32 relative overflow-hidden bg-transparent z-20 flex flex-col gap-10">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-line-anim {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line-anim 4s linear infinite;
        }
      ` }} />

      {/* Section Title */}
      <div className="max-w-7xl mx-auto px-6 w-full flex flex-col md:flex-row md:items-end justify-between gap-4 z-20">
        <div>
          <span className="text-xs font-silkscreen tracking-widest text-alabaster-grey/85 uppercase flex items-center gap-2">
            <span>•</span> OUR PORTFOLIO
          </span>
          <h2 className="text-3xl md:text-5xl font-normal text-bright-snow tracking-wide mt-2 font-russo-one retro-heading-shadow">
            Explore Our Creations
          </h2>
        </div>
        
        <a
          href="https://play.google.com/store/apps/dev?id=5818328852601157830&hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="inset-pixel-btn-secondary font-silkscreen text-[9px] tracking-widest py-2.5 px-5 flex items-center gap-2 self-start md:self-auto"
        >
          <span>VIEW ALL ON GOOGLE PLAY</span>
          <ExternalLink size={12} className="text-slate-violet-light group-hover:text-bright-snow transition-colors" />
        </a>
      </div>

      {/* Kinetic Drag-to-Spin Carousel */}
      <div className="w-full relative z-20">
        <KineticSpinStream games={initialGames} />
      </div>
    </section>
  );
}
