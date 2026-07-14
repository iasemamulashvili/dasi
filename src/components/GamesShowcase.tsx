'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useAnimationFrame } from 'framer-motion';
import { 
  ExternalLink,
  ChevronRight,
  MousePointer
} from 'lucide-react';
import { Game } from '@/utils/db';

// Official Store Badges (charcoal-grey bg, violet glowing border on hover)
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
      className="fill-[#18181B] stroke-[#27272A] group-hover:fill-[#27272A] group-hover:stroke-[#7c3aed] transition-colors duration-300"
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
      className="fill-[#18181B] stroke-[#27272A] group-hover:fill-[#27272A] group-hover:stroke-[#7c3aed] transition-colors duration-300"
      strokeWidth={1}
    />
    <g transform="translate(10, 11) scale(0.035)">
      <path d="M47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0z" fill="#00E6FF" />
      <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1z" fill="#FF3A44" />
      <path d="M472.2 225.6l-58 33.3 60.1 60.1L512 288c0-22-13.7-47.8-40-62.4z" fill="#FFC700" />
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
      className="fill-[#18181B] stroke-[#27272A] group-hover:fill-[#27272A] group-hover:stroke-[#7c3aed] transition-colors duration-300"
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
  setHoveredIdx 
}: { 
  game: Game; 
  index: number; 
  hoveredIdx: number | null; 
  setHoveredIdx: (idx: number | null) => void;
}) {
  const isHovered = hoveredIdx === index;

  const activeStores = [
    ...(game.isIOS && game.appstoreLink ? [{ id: 'ios', href: game.appstoreLink, component: <AppStoreBadge className="h-[26px] w-auto" />, label: 'App Store' }] : []),
    ...(game.isAndroid && game.playstoreLink ? [{ id: 'android', href: game.playstoreLink, component: <PlayStoreBadge className="h-[26px] w-auto" />, label: 'Google Play' }] : []),
    ...(game.isPoki && game.pokiLink ? [{ id: 'poki', href: game.pokiLink, component: <PokiPlayBadge className="h-[26px] w-auto" />, label: 'Poki Web' }] : [])
  ];

  return (
    <motion.div
      onMouseEnter={() => setHoveredIdx(index)}
      onMouseLeave={() => setHoveredIdx(null)}
      animate={{
        width: isHovered ? 400 : 280,
        borderColor: isHovered ? '#7c3aed' : 'rgba(55, 65, 81, 0.4)'
      }}
      transition={{
        type: 'spring',
        stiffness: 145,
        damping: 20
      }}
      className="h-[320px] bg-carbon-black-2 border border-graphite-light p-4 rounded-2xl flex flex-col justify-between hover:shadow-2xl hover:shadow-slate-violet/5 relative group shrink-0 overflow-hidden"
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

        {/* Video plays continuously only for lumber-chopper */}
        {game.id === 'lumber-chopper' && game.videoSrc ? (
          <video
            src={game.videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          /* Static game graphic/icon placeholder */
          <div className="w-full h-full flex items-center justify-center bg-carbon-black-2 relative">
            <img
              src={game.iconSrc}
              alt={game.title}
              className="w-16 h-16 rounded-xl object-cover border border-white/10 relative z-10 shadow-lg"
            />
            {/* Ambient background blur of the icon */}
            <img
              src={game.iconSrc}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover filter blur-[8px] opacity-20 pointer-events-none"
            />
          </div>
        )}

        {/* CRT Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_50%,rgba(0,0,0,0.12)_50%)] bg-[size:100%_4px]" />
        
        {/* Bezel inner shadow */}
        <div className="absolute inset-0 pointer-events-none z-10 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.45)_100%)]" />
        
        {/* Scanning horizontal line */}
        <div className="absolute inset-x-0 h-[1.5px] bg-slate-violet/30 pointer-events-none z-10 animate-scan-line" />
      </div>

      {/* Card Details */}
      <div className="relative z-10 flex flex-col justify-between flex-1 mt-3 pointer-events-none select-none">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={game.iconSrc}
              alt={game.title}
              className="w-8 h-8 rounded-lg object-cover border border-graphite-light/50"
            />
            <div>
              <h4 className="text-xs font-bold text-bright-snow font-russo-one tracking-wide">
                {game.title}
              </h4>
            </div>
          </div>
          <p className={`text-[10px] text-alabaster-grey/70 font-outfit leading-relaxed mt-2 line-clamp-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-70'}`}>
            {game.description}
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-graphite-light/20 pt-2.5 mt-2 relative">
          <span className="text-[9px] font-mono text-slate-violet-light">
            {game.downloads || 'FREE'}
          </span>
          <div className="flex items-center gap-2 relative h-[26px] min-w-[100px] justify-end pointer-events-auto">
            <motion.span
              animate={{ x: isHovered && activeStores.length > 0 ? -(activeStores.length * 82 + 6) : 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              className="text-[9px] font-bold text-bright-snow group-hover:text-slate-violet-light transition-colors flex items-center gap-1 font-outfit uppercase pointer-events-none absolute right-0"
            >
              Play Game <ChevronRight size={10} />
            </motion.span>
            
            <div className="absolute right-0 flex items-center gap-1">
              <AnimatePresence>
                {isHovered && activeStores.map((store, sIdx) => (
                  <motion.a
                    key={store.id}
                    href={store.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, scale: 0, x: 10 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0, x: 10 }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 20,
                      delay: sIdx * 0.05
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
  const [isCooldown, setIsCooldown] = useState(false);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });
  const [oneIterationWidth, setOneIterationWidth] = useState(0);

  const trackX = useMotionValue(0);
  const trackSpringX = useSpring(trackX, { stiffness: 100, damping: 22 });

  useEffect(() => {
    const updateConstraints = () => {
      if (containerRef.current && trackRef.current) {
        const totalScrollWidth = trackRef.current.scrollWidth;
        const singleIterationW = totalScrollWidth / 3;

        setOneIterationWidth(singleIterationW);
        setDragConstraints({
          left: -singleIterationW * 2,
          right: 0
        });
      }
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [games]);

  useAnimationFrame((time, delta) => {
    if (isDragging || hoveredIdx !== null || isCooldown) return;

    const speed = 0.85 * (delta / 16.6);
    let nextX = trackX.get() - speed;

    if (nextX < -oneIterationWidth) {
      nextX += oneIterationWidth;
    }
    trackX.set(nextX);
  });

  const handleDragStart = () => {
    setIsDragging(true);
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
  };

  const handleDragEnd = (e: any, info: any) => {
    setIsDragging(false);
    setIsCooldown(true);

    let currentX = trackX.get();
    if (currentX < -oneIterationWidth) {
      currentX += oneIterationWidth;
      trackX.set(currentX);
    } else if (currentX > 0) {
      currentX -= oneIterationWidth;
      trackX.set(currentX);
    }

    cooldownTimer.current = setTimeout(() => {
      setIsCooldown(false);
    }, 4500);
  };

  return (
    <div ref={containerRef} className="w-full relative flex flex-col gap-6 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#0b0b0c] to-transparent z-25 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#0b0b0c] to-transparent z-25 pointer-events-none" />

      {/* Drag Track Container */}
      <div className="w-full overflow-hidden py-4 cursor-grab active:cursor-grabbing">
        <motion.div
          ref={trackRef}
          drag="x"
          style={{ x: trackSpringX }}
          dragConstraints={dragConstraints}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="flex gap-6 w-max px-6"
        >
          {tripleGames.map((game, index) => (
            <KineticCard
              key={`${game.id}-kinetic-${index}`}
              game={game}
              index={index}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
            />
          ))}
        </motion.div>
      </div>

      <div className="flex justify-center gap-1.5 items-center text-[10px] text-slate-violet-light/70 uppercase tracking-widest font-mono">
        <MousePointer size={12} />
        <span>Drag track directly to spin or explore games</span>
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
          <span className="text-xs font-silkscreen tracking-widest text-slate-violet-light uppercase flex items-center gap-2">
            <span>•</span> Our Portfolio Showcase
          </span>
          <h2 className="text-3xl md:text-5xl font-normal text-bright-snow tracking-wide mt-2 font-russo-one retro-heading-shadow">
            Explore Our Creations
          </h2>
        </div>
        
        <a
          href="https://play.google.com/store/apps/dev?id=5818328852601157830&hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs font-silkscreen tracking-widest text-slate-violet-light hover:text-bright-snow border border-slate-violet/20 hover:border-slate-violet bg-slate-violet/5 hover:bg-slate-violet/10 px-4 py-2.5 rounded-xl transition-all w-fit cursor-pointer self-start md:self-auto"
        >
          <span>VIEW ALL ON GOOGLE PLAY</span>
          <ExternalLink size={12} />
        </a>
      </div>

      {/* Kinetic Drag-to-Spin Carousel */}
      <div className="w-full relative z-20">
        <KineticSpinStream games={initialGames} />
      </div>
    </section>
  );
}
