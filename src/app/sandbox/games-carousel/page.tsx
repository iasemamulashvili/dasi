'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useAnimationFrame } from 'framer-motion';
import { 
  Trophy, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  Globe,
  Play,
  Sparkles,
  Smartphone,
  MousePointer,
  Navigation
} from 'lucide-react';

// Official Store SVGs
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

interface Game {
  id: string;
  title: string;
  description: string;
  iconSrc: string;
  iconAlt: string;
  playstoreLink: string;
  appstoreLink: string;
  pokiLink: string;
  isAndroid: boolean;
  isIOS: boolean;
  isPoki: boolean;
  rating?: string;
  downloads?: string;
  videoSrc?: string;
}

const mockGames: Game[] = [
  {
    id: "crown-quest",
    title: "Crown Quest",
    description: "Embark on an epic fantasy RPG quest. Command legendary heroes, conquer tactical grid battles, and construct your royal stronghold in a war-torn kingdom.",
    iconSrc: "https://play-lh.googleusercontent.com/YI2kzNZ-04oONlOGjZRriWAu80b6Gve8oXs0I2A1xLreESb4fwES4FT0aP3HrgvOFw=s256-rw",
    iconAlt: "Crown_Quest",
    playstoreLink: "https://play.google.com/store/apps/details?id=dasi.arpg.crownquest&hl=en",
    appstoreLink: "https://apps.apple.com/us/app/crown-quest-action-rpg/id6477858164",
    pokiLink: "",
    isAndroid: true,
    isIOS: true,
    isPoki: false,
    rating: "4.8",
    downloads: "5M+",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-playing-a-video-game-41584-large.mp4"
  },
  {
    id: "lumber-chopper",
    title: "Lumber Chopper",
    description: "Harvest resources, optimize lumber mills, and build a massive wood-chopping dynasty. Automate operations and manage supply chains in this highly addictive idle tycoon.",
    iconSrc: "https://play-lh.googleusercontent.com/0_2l4Yk9uqKwTvAv-yZp02Og-DRr5GT-AfsH42zjExvkQkKsP4NUsyZz0lp8APHMaQ=s256-rw",
    iconAlt: "Lumber_Chopper",
    playstoreLink: "https://play.google.com/store/apps/details?id=dasi.prs2.lumberchopper&hl=en",
    appstoreLink: "https://apps.apple.com/us/app/lumber-chopper-harvest-empire/id6738272884",
    pokiLink: "",
    isAndroid: true,
    isIOS: true,
    isPoki: false,
    rating: "4.6",
    downloads: "3M+",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-industrial-forest-log-loader-working-43187-large.mp4"
  },
  {
    id: "hotel-manager",
    title: "Hotel Manager",
    description: "Design, build, and run a 5-star luxury resort empire. Hire world-class chefs, staff, and design stunning suites to keep VIP clients happy and maximize profits.",
    iconSrc: "https://play-lh.googleusercontent.com/Z3HMAnuhBtnY9EvIUO_xRQCc9ciOscrn74X16Jp0BASxll1Wfdxih_HLxpKqO3asZe0=s256-rw",
    iconAlt: "Hotel_Manager",
    playstoreLink: "https://play.google.com/store/apps/details?id=dasi.prs3.hotelmanager&hl=en",
    appstoreLink: "https://apps.apple.com/us/app/hotel-manager-resort-empire/id6748454899",
    pokiLink: "",
    isAndroid: true,
    isIOS: true,
    isPoki: false,
    rating: "4.5",
    downloads: "1.5M+",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-hotel-swimming-pool-and-palm-trees-48744-large.mp4"
  },
  {
    id: "coworking-manager",
    title: "Coworking Manager",
    description: "Grow your tiny office into a bustling workspace and rent out desks in this detailed administrative business sim.",
    iconSrc: "https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=256,height=256,fit=cover,f=auto/4316bedecdcabc2e0135b69e83094078.png",
    iconAlt: "Coworking_Space",
    playstoreLink: "https://play.google.com/store/apps/details?id=dasi.prk1.coworking",
    appstoreLink: "https://apps.apple.com/us/app/coworking-space-manager/id6477774068",
    pokiLink: "https://poki.com/en/g/dasi-office-manager",
    isAndroid: true,
    isIOS: true,
    isPoki: true,
    rating: "4.3",
    downloads: "800K+",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-typing-on-a-laptop-in-a-sunny-office-close-up-41585-large.mp4"
  },
  {
    id: "hospital-manager",
    title: "Hospital Manager",
    description: "Manage a huge hospital, build treatment rooms, hire medical professionals, and save people's lives in this quick-service simulator.",
    iconSrc: "https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=256,height=256,fit=cover,f=auto/ce0c769964665f7a1114f732d0117c3e.png",
    iconAlt: "Hospital_Manager",
    playstoreLink: "",
    appstoreLink: "",
    pokiLink: "https://poki.com/en/g/dasi-hospital-manager",
    isAndroid: false,
    isIOS: false,
    isPoki: true,
    rating: "4.4",
    downloads: "1.2M+",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-doctor-explaining-prescriptions-to-a-patient-48756-large.mp4"
  },
  {
    id: "my-spa-resort",
    title: "My Spa Resort",
    description: "Comfort guests, maintain soothing spaces, and hire world-class spa experts to expand your tranquil wellness getaway.",
    iconSrc: "https://img.poki-cdn.com/cdn-cgi/image/quality=78,width=256,height=256,fit=cover,f=auto/58ec31c3f7cb2b5117fd36fc82bb139e.png",
    iconAlt: "My_Spa_Resort",
    playstoreLink: "https://play.google.com/store/apps/details?id=dasi.pr63.mysparesort&hl=en",
    appstoreLink: "",
    pokiLink: "",
    isAndroid: true,
    isIOS: false,
    isPoki: false,
    rating: "4.2",
    downloads: "400K+",
    videoSrc: "https://assets.mixkit.co/videos/preview/mixkit-massage-therapist-applying-hot-stones-to-a-womans-back-48749-large.mp4"
  }
];

export default function GamesCarouselSandbox() {
  const [activeTab, setActiveTab] = useState<'kinetic' | 'glide' | 'scrub'>('kinetic');

  return (
    <div className="min-h-screen bg-carbon-black text-alabaster-grey relative overflow-x-hidden select-none">
      {/* Decorative Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-violet/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      {/* Top Navigation */}
      <header className="border-b border-graphite-light/40 bg-carbon-black/60 backdrop-blur-md sticky top-0 z-45">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="cursor-pointer">
              <img
                src="https://dasigames.com/Images/low_res_images/dasigames_logo(transparent).png"
                alt="Logo"
                className="h-8 w-auto object-contain hover:opacity-80 transition-all"
              />
            </Link>
            <span className="text-[10px] font-bold tracking-widest text-slate-violet-light bg-slate-violet/10 border border-slate-violet/20 px-2.5 py-1 rounded-full uppercase">
              Sandbox Playground
            </span>
          </div>
          <Link 
            href="/"
            className="text-xs font-outfit text-alabaster-grey/60 hover:text-bright-snow flex items-center gap-1.5 transition-all cursor-pointer"
          >
            Back to mainpage
          </Link>
        </div>
      </header>

      {/* Main Console Container */}
      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10 flex flex-col gap-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-wider font-russo-one text-bright-snow uppercase">
            Game List Redesign
          </h1>
          <p className="text-sm text-alabaster-grey/70 mt-2 font-outfit max-w-3xl leading-relaxed">
            Comparing three different **manual scroll control** architectures over our autoplaying video-expanding infinite stream component.
          </p>
        </div>

        {/* Tab Switcher Console */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-graphite-light/35 pb-5">
          <div className="flex bg-carbon-black-2 border border-graphite-light p-1 rounded-xl w-full md:w-auto scrollbar-none overflow-x-auto whitespace-nowrap gap-1">
            <button
              onClick={() => setActiveTab('kinetic')}
              className={`px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer font-sans shrink-0 ${
                activeTab === 'kinetic'
                  ? 'bg-slate-violet text-bright-snow shadow-lg shadow-slate-violet/20'
                  : 'text-alabaster-grey/60 hover:text-bright-snow hover:bg-graphite/40'
              }`}
            >
              Solution A: Kinetic Spin Wheel
            </button>
            <button
              onClick={() => setActiveTab('glide')}
              className={`px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer font-sans shrink-0 ${
                activeTab === 'glide'
                  ? 'bg-slate-violet text-bright-snow shadow-lg shadow-slate-violet/20'
                  : 'text-alabaster-grey/60 hover:text-bright-snow hover:bg-graphite/40'
              }`}
            >
              Solution B: Glide Arrow Buttons
            </button>
            <button
              onClick={() => setActiveTab('scrub')}
              className={`px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer font-sans shrink-0 ${
                activeTab === 'scrub'
                  ? 'bg-slate-violet text-bright-snow shadow-lg shadow-slate-violet/20'
                  : 'text-alabaster-grey/60 hover:text-bright-snow hover:bg-graphite/40'
              }`}
            >
              Solution C: Timeline Scrubber
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-violet-light/90 font-outfit select-none bg-slate-violet/5 border border-slate-violet/10 px-3.5 py-1.5 rounded-xl">
            <Info size={14} />
            <span>Click and drag cards or use controls to test the scroll mechanics.</span>
          </div>
        </div>

        {/* Dynamic Switcher Render Area */}
        <div className="min-h-[480px] w-full flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {activeTab === 'kinetic' && (
              <motion.div
                key="kinetic"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="w-full"
              >
                <KineticSpinStream games={mockGames} />
              </motion.div>
            )}

            {activeTab === 'glide' && (
              <motion.div
                key="glide"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="w-full"
              >
                <GlideButtonStream games={mockGames} />
              </motion.div>
            )}

            {activeTab === 'scrub' && (
              <motion.div
                key="scrub"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="w-full"
              >
                <TimelineScrubberStream games={mockGames} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ==========================================
   SHARED VIDEO CARD COMPONENT
   ========================================== */
function VideoGameCard({ 
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
      className="h-[320px] bg-carbon-black-2 border border-graphite-light p-5 rounded-2xl flex flex-col justify-between hover:shadow-2xl hover:shadow-slate-violet/5 relative group shrink-0 overflow-hidden"
    >
      <div className="absolute inset-px rounded-2xl border border-white/5 pointer-events-none z-10" />

      {/* Autoplay Video Loop Backdrop */}
      <AnimatePresence>
        {isHovered && game.videoSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="absolute inset-0 z-0 pointer-events-none overflow-hidden"
          >
            <video
              src={game.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-carbon-black via-carbon-black/45 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Details */}
      <div className="relative z-10 flex flex-col justify-between h-full pointer-events-none select-none">
        <div className="flex items-center gap-3">
          <img
            src={game.iconSrc}
            alt={game.title}
            className="w-10 h-10 rounded-xl object-cover border border-graphite-light/50"
          />
          <div>
            <h4 className="text-xs font-bold text-bright-snow font-russo-one tracking-wide">
              {game.title}
            </h4>
            <div className="flex gap-1 mt-0.5 text-alabaster-grey/50">
              {game.isIOS && <AppStoreIcon className="w-2.5 h-2.5 text-slate-violet-light" />}
              {game.isAndroid && <PlayStoreIcon className="w-2.5 h-2.5 text-slate-violet-light" />}
              {game.isPoki && <Globe size={10} className="text-slate-violet-light" />}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <p className={`text-[10px] text-alabaster-grey/85 font-outfit leading-relaxed line-clamp-3 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-65'}`}>
            {game.description}
          </p>

          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1.5 text-[8px] font-bold text-slate-violet-light uppercase tracking-wider font-mono"
            >
              <Sparkles size={10} className="animate-pulse" />
              <span>Autoplay Gameplay Preview</span>
            </motion.div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-graphite-light/20 pt-3">
          <span className="text-[9px] font-mono text-slate-violet-light">
            {game.downloads || 'FREE'}
          </span>
          <span className="text-[9px] font-bold text-bright-snow group-hover:text-slate-violet-light transition-colors flex items-center gap-1 font-outfit uppercase">
            View Game <ChevronRight size={10} />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================
   SOLUTION A: KINETIC DRAG-TO-SPIN STREAM
   ========================================== */
function KineticSpinStream({ games }: { games: Game[] }) {
  // Triple the array to create a seamless infinite wrapping loop
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
        const containerWidth = containerRef.current.offsetWidth;
        const totalScrollWidth = trackRef.current.scrollWidth;
        const singleIterationW = totalScrollWidth / 3;

        setOneIterationWidth(singleIterationW);
        setDragConstraints({
          left: -singleIterationW * 2, // Allow wrapping in both directions
          right: 0
        });
      }
    };

    updateConstraints();
    window.addEventListener('resize', updateConstraints);
    return () => window.removeEventListener('resize', updateConstraints);
  }, [games]);

  // Infinite auto-scroll loop
  useAnimationFrame((time, delta) => {
    // Stop scrolling when dragging, hovered, or cooling down
    if (isDragging || hoveredIdx !== null || isCooldown) return;

    const speed = 0.85 * (delta / 16.6); // normalize ~60fps scroll
    let nextX = trackX.get() - speed;

    // Wrapping boundary logic
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

    // Apply wrapping loop adjustment directly post-drag
    let currentX = trackX.get();
    if (currentX < -oneIterationWidth) {
      currentX += oneIterationWidth;
      trackX.set(currentX);
    } else if (currentX > 0) {
      currentX -= oneIterationWidth;
      trackX.set(currentX);
    }

    // Wait 4.5 seconds before resuming auto-scroll ticker loop
    cooldownTimer.current = setTimeout(() => {
      setIsCooldown(false);
    }, 4500);
  };

  return (
    <div ref={containerRef} className="w-full relative flex flex-col gap-6 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-carbon-black to-transparent z-25 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-carbon-black to-transparent z-25 pointer-events-none" />

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
            <VideoGameCard
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
        <span>Drag track directly to spin or search games</span>
      </div>
    </div>
  );
}

/* ==========================================
   SOLUTION B: GLIDE BUTTON NAVIGATION STREAM
   ========================================== */
function GlideButtonStream({ games }: { games: Game[] }) {
  // Triple the array to provide circular glide bounds
  const tripleGames = [...games, ...games, ...games];
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  
  const [activeSegmentIdx, setActiveSegmentIdx] = useState(games.length); // start at the first duplicate segment
  const cardWidthWithGap = 304; // 280px width + 24px gap

  const trackX = useMotionValue(-activeSegmentIdx * cardWidthWithGap);
  const trackSpringX = useSpring(trackX, { stiffness: 100, damping: 20 });
  
  const [isCooldown, setIsCooldown] = useState(false);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll loop
  useAnimationFrame((time, delta) => {
    if (hoveredIdx !== null || isCooldown) return;

    const speed = 0.85 * (delta / 16.6);
    let nextX = trackX.get() - speed;

    const limit = -(games.length * 2 * cardWidthWithGap);
    if (nextX < limit) {
      nextX += (games.length * cardWidthWithGap);
    }
    trackX.set(nextX);

    // Sync activeSegmentIdx to index representation
    const currentIdx = Math.round(-nextX / cardWidthWithGap);
    setActiveSegmentIdx(currentIdx);
  });

  const triggerCooldown = () => {
    setIsCooldown(true);
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    cooldownTimer.current = setTimeout(() => {
      setIsCooldown(false);
    }, 7000); // 7s grace period after manual glide
  };

  const handlePrev = () => {
    triggerCooldown();
    let prevIdx = activeSegmentIdx - 1;
    
    // Circular wrap bounds
    if (prevIdx < games.length) {
      prevIdx += games.length;
      trackX.set(-prevIdx * cardWidthWithGap);
      prevIdx -= 1;
    }
    
    setActiveSegmentIdx(prevIdx);
    trackX.set(-prevIdx * cardWidthWithGap);
  };

  const handleNext = () => {
    triggerCooldown();
    let nextIdx = activeSegmentIdx + 1;
    
    // Circular wrap bounds
    if (nextIdx >= games.length * 2) {
      nextIdx -= games.length;
      trackX.set(-nextIdx * cardWidthWithGap);
      nextIdx += 1;
    }

    setActiveSegmentIdx(nextIdx);
    trackX.set(-nextIdx * cardWidthWithGap);
  };

  return (
    <div className="w-full relative flex flex-col gap-8 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-carbon-black to-transparent z-25 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-carbon-black to-transparent z-25 pointer-events-none" />

      {/* Stream Viewport */}
      <div className="w-full overflow-hidden py-4">
        <motion.div
          style={{ x: trackSpringX }}
          className="flex gap-6 w-max px-6"
        >
          {tripleGames.map((game, index) => (
            <VideoGameCard
              key={`${game.id}-glide-${index}`}
              game={game}
              index={index}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
            />
          ))}
        </motion.div>
      </div>

      {/* Manual Glide Controller Buttons */}
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={handlePrev}
          className="p-3 bg-carbon-black-2 hover:bg-graphite border border-graphite-light hover:border-slate-violet text-alabaster-grey hover:text-bright-snow rounded-xl transition-all cursor-pointer z-30"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex gap-1.5">
          {games.map((_, idx) => {
            const mappedActive = activeSegmentIdx % games.length;
            return (
              <button
                key={idx}
                onClick={() => {
                  triggerCooldown();
                  setActiveSegmentIdx(games.length + idx);
                  trackX.set(-(games.length + idx) * cardWidthWithGap);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer z-30 ${
                  idx === mappedActive ? 'w-6 bg-slate-violet' : 'w-1.5 bg-graphite-light/60'
                }`}
              />
            );
          })}
        </div>

        <button
          onClick={handleNext}
          className="p-3 bg-carbon-black-2 hover:bg-graphite border border-graphite-light hover:border-slate-violet text-alabaster-grey hover:text-bright-snow rounded-xl transition-all cursor-pointer z-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   SOLUTION C: TIMELINE SCROLLBAR SCRUBBER
   ========================================== */
function TimelineScrubberStream({ games }: { games: Game[] }) {
  // Triple the array
  const tripleGames = [...games, ...games, ...games];
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const sliderBarRef = useRef<HTMLDivElement>(null);

  const [oneIterationWidth, setOneIterationWidth] = useState(0);
  const maxScrollWidth = useRef(0);
  const maxSliderTravel = 200; // width of scrollbar track (260px) - handle width (60px)

  const trackX = useMotionValue(0);
  const trackSpringX = useSpring(trackX, { stiffness: 100, damping: 20 });
  const handleX = useMotionValue(0);

  const [isScrubbing, setIsScrubbing] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);
  const cooldownTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (trackRef.current) {
      const singleIterationW = trackRef.current.scrollWidth / 3;
      setOneIterationWidth(singleIterationW);
      maxScrollWidth.current = singleIterationW;
    }
  }, [games]);

  // Sync scrollbar handle position to track X during auto-scroll
  useEffect(() => {
    const unsubscribeX = trackX.on("change", (latestX) => {
      if (isScrubbing) return;
      // map negative track position (0 -> -oneIterationWidth) to positive handle progress (0 -> maxSliderTravel)
      const normalizedX = Math.abs(latestX) % oneIterationWidth;
      const progressPct = normalizedX / oneIterationWidth;
      handleX.set(progressPct * maxSliderTravel);
    });

    return () => unsubscribeX();
  }, [oneIterationWidth, isScrubbing]);

  // Auto-scroll loop
  useAnimationFrame((time, delta) => {
    if (hoveredIdx !== null || isScrubbing || isCooldown) return;

    const speed = 0.85 * (delta / 16.6);
    let nextX = trackX.get() - speed;

    if (nextX < -oneIterationWidth) {
      nextX += oneIterationWidth;
    }
    trackX.set(nextX);
  });

  const handleScrubberDrag = (e: any, info: any) => {
    setIsScrubbing(true);
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);

    const currentHandleX = handleX.get();
    const progressPct = Math.min(1.0, Math.max(0.0, currentHandleX / maxSliderTravel));
    // Set track X based on scrubber position
    trackX.set(-progressPct * oneIterationWidth);
  };

  const handleScrubberDragEnd = () => {
    setIsScrubbing(false);
    setIsCooldown(true);

    cooldownTimer.current = setTimeout(() => {
      setIsCooldown(false);
    }, 4000); // Resume auto scroll after 4 seconds of idle time
  };

  return (
    <div ref={containerRef} className="w-full relative flex flex-col gap-8 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-carbon-black to-transparent z-25 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-carbon-black to-transparent z-25 pointer-events-none" />

      {/* Stream Viewport */}
      <div className="w-full overflow-hidden py-4">
        <motion.div
          ref={trackRef}
          style={{ x: trackSpringX }}
          className="flex gap-6 w-max px-6"
        >
          {tripleGames.map((game, index) => (
            <VideoGameCard
              key={`${game.id}-scrub-${index}`}
              game={game}
              index={index}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
            />
          ))}
        </motion.div>
      </div>

      {/* Timeline Scrubber Bar */}
      <div className="w-full max-w-sm mx-auto flex flex-col items-center gap-2">
        <div 
          ref={sliderBarRef}
          className="w-[260px] h-1.5 bg-graphite rounded-full relative overflow-visible border border-graphite-light/20"
        >
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: maxSliderTravel }}
            dragElastic={0}
            style={{ x: handleX }}
            onDrag={handleScrubberDrag}
            onDragStart={() => setIsScrubbing(true)}
            onDragEnd={handleScrubberDragEnd}
            className="absolute top-1/2 -translate-y-1/2 w-[60px] h-3.5 bg-slate-violet hover:bg-slate-violet-light border border-slate-violet-light/35 rounded-full cursor-pointer z-30 shadow-[0_0_8px_rgba(124,58,237,0.4)]"
          />
        </div>
        <span className="text-[9px] tracking-widest text-alabaster-grey/30 uppercase font-mono mt-1 select-none flex items-center gap-1.5">
          <Navigation size={10} /> Scrub timeline to seek games
        </span>
      </div>
    </div>
  );
}
