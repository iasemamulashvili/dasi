'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Trophy, 
  ChevronLeft, 
  ChevronRight, 
  Info,
  Globe,
  Play,
  VolumeX,
  Sparkles,
  Smartphone
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
  const [activeTab, setActiveTab] = useState<'stacked' | 'infinite' | 'kinetic'>('stacked');

  return (
    <div className="min-h-screen bg-carbon-black text-alabaster-grey relative overflow-x-hidden select-none">
      {/* Decorative Grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none z-0" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-slate-violet/5 blur-[120px] rounded-full pointer-events-none z-0" />
      
      {/* Top Navigation / Breadcrumbs */}
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
            Testing components to resolve the vertical-scroll horizontal-view confusion in our current UI. Explore three high-agency responsive variations leveraging Framer Motion physics, dynamic scaling, and hardware acceleration.
          </p>
        </div>

        {/* Tab Switcher Console */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-graphite-light/35 pb-5">
          <div className="flex bg-carbon-black-2 border border-graphite-light p-1 rounded-xl w-full md:w-auto scrollbar-none overflow-x-auto whitespace-nowrap gap-1">
            <button
              onClick={() => setActiveTab('stacked')}
              className={`px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer font-sans shrink-0 ${
                activeTab === 'stacked'
                  ? 'bg-slate-violet text-bright-snow shadow-lg shadow-slate-violet/20'
                  : 'text-alabaster-grey/60 hover:text-bright-snow hover:bg-graphite/40'
              }`}
            >
              Variation A: 5-Card Coordinated Wheel
            </button>
            <button
              onClick={() => setActiveTab('infinite')}
              className={`px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer font-sans shrink-0 ${
                activeTab === 'infinite'
                  ? 'bg-slate-violet text-bright-snow shadow-lg shadow-slate-violet/20'
                  : 'text-alabaster-grey/60 hover:text-bright-snow hover:bg-graphite/40'
              }`}
            >
              Variation B: Video Hover Stream
            </button>
            <button
              onClick={() => setActiveTab('kinetic')}
              className={`px-5 py-2 text-xs font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer font-sans shrink-0 ${
                activeTab === 'kinetic'
                  ? 'bg-slate-violet text-bright-snow shadow-lg shadow-slate-violet/20'
                  : 'text-alabaster-grey/60 hover:text-bright-snow hover:bg-graphite/40'
              }`}
            >
              Variation C: Liquid Lens Accordion
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-violet-light/90 font-outfit select-none bg-slate-violet/5 border border-slate-violet/10 px-3.5 py-1.5 rounded-xl">
            <Info size={14} />
            <span>Interactive showcase. Explore animations, hover expansions, and 3D paths.</span>
          </div>
        </div>

        {/* Dynamic Variation Containers */}
        <div className="min-h-[580px] w-full flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {activeTab === 'stacked' && (
              <motion.div
                key="stacked"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full flex flex-col items-center justify-center"
              >
                <StackedCarousel games={mockGames} />
              </motion.div>
            )}

            {activeTab === 'infinite' && (
              <motion.div
                key="infinite"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full"
              >
                <InfiniteScrollStream games={mockGames} />
              </motion.div>
            )}

            {activeTab === 'kinetic' && (
              <motion.div
                key="kinetic"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="w-full"
              >
                <LiquidLensAccordion games={mockGames} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

/* ==========================================
   VARIATION A: 5-CARD COORDINATED 3D WHEEL
   ========================================== */
function StackedCarousel({ games }: { games: Game[] }) {
  const [activeIdx, setActiveIdx] = useState(2); // start in middle index
  const dragX = useMotionValue(0);
  const dragXSpring = useSpring(dragX, { stiffness: 120, damping: 22 });

  // Map drag pixels continuously to fractional index values
  // A drag of 180px represents shifting exactly 1 index unit.
  const cardSpacingWidth = 180;
  const rawFractionalIndex = useTransform(dragXSpring, (latestX) => {
    return activeIdx - (latestX / cardSpacingWidth);
  });

  const nextCard = () => {
    setActiveIdx((prev) => (prev + 1) % games.length);
  };

  const prevCard = () => {
    setActiveIdx((prev) => (prev - 1 + games.length) % games.length);
  };

  return (
    <div className="w-full max-w-5xl flex flex-col items-center select-none">
      {/* 500px Height Container to prevent top cropping */}
      <div className="relative w-full h-[500px] flex items-center justify-center perspective-[1400px] overflow-visible">
        {/* Continuous Drag Zone Overlay */}
        <motion.div
          drag="x"
          style={{ x: dragX }}
          dragConstraints={{ left: -10, right: 10 }}
          dragElastic={0.1}
          onDragStart={() => {
            // Keep current offset during movement
          }}
          onDragEnd={(e, info) => {
            const dragDistance = info.offset.x;
            // Reset drag tracking motion value immediately to prevent jumps
            dragX.set(0);

            // Determine if threshold is crossed to switch index
            if (dragDistance < -60) {
              nextCard();
            } else if (dragDistance > 60) {
              prevCard();
            }
          }}
          className="absolute inset-0 z-40 cursor-grab active:cursor-grabbing"
        />

        {games.map((game, index) => {
          return (
            <motion.div
              key={game.id}
              // Calculate values based on the continuous rawFractionalIndex
              style={{
                zIndex: useTransform(rawFractionalIndex, (fracIndex) => {
                  let diff = index - fracIndex;
                  if (diff < -games.length / 2) diff += games.length;
                  if (diff > games.length / 2) diff -= games.length;
                  return Math.round(30 - Math.abs(diff) * 10);
                }),
                transformStyle: 'preserve-3d',
                x: useTransform(rawFractionalIndex, (fracIndex) => {
                  let diff = index - fracIndex;
                  if (diff < -games.length / 2) diff += games.length;
                  if (diff > games.length / 2) diff -= games.length;
                  return diff * 200;
                }),
                scale: useTransform(rawFractionalIndex, (fracIndex) => {
                  let diff = index - fracIndex;
                  if (diff < -games.length / 2) diff += games.length;
                  if (diff > games.length / 2) diff -= games.length;
                  return 1 - Math.min(0.24, Math.abs(diff) * 0.12);
                }),
                rotateY: useTransform(rawFractionalIndex, (fracIndex) => {
                  let diff = index - fracIndex;
                  if (diff < -games.length / 2) diff += games.length;
                  if (diff > games.length / 2) diff -= games.length;
                  return diff * -25;
                }),
                opacity: useTransform(rawFractionalIndex, (fracIndex) => {
                  let diff = index - fracIndex;
                  if (diff < -games.length / 2) diff += games.length;
                  if (diff > games.length / 2) diff -= games.length;
                  const absD = Math.abs(diff);
                  if (absD > 2.2) return 0; // hide 6th+ card
                  return 1 - absD * 0.35;
                }),
                filter: useTransform(rawFractionalIndex, (fracIndex) => {
                  let diff = index - fracIndex;
                  if (diff < -games.length / 2) diff += games.length;
                  if (diff > games.length / 2) diff -= games.length;
                  const blurAmount = Math.min(6, Math.abs(diff) * 2.5);
                  return `blur(${blurAmount}px)`;
                }),
              }}
              onClick={() => {
                setActiveIdx(index);
              }}
              className={`absolute w-[260px] sm:w-[320px] aspect-[3/4] bg-gradient-to-b from-carbon-black-2 to-carbon-black border rounded-[2rem] p-6 flex flex-col justify-between shadow-[0_25px_60px_rgba(0,0,0,0.9)] border-l-white/10 pointer-events-none select-none ${
                index === activeIdx ? 'border-slate-violet shadow-slate-violet/5' : 'border-graphite-light/60'
              }`}
            >
              {/* Header Info */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={game.iconSrc}
                    alt={game.title}
                    className="w-10 h-10 rounded-xl object-cover border border-graphite-light/50 shadow-inner"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-bright-snow font-russo-one tracking-wide">
                      {game.title}
                    </h3>
                    <div className="flex gap-1.5 mt-0.5 text-alabaster-grey/50">
                      {game.isIOS && <AppStoreIcon className="w-3 h-3 text-slate-violet-light" />}
                      {game.isAndroid && <PlayStoreIcon className="w-3 h-3 text-slate-violet-light" />}
                      {game.isPoki && <Globe size={11} className="text-slate-violet-light" />}
                    </div>
                  </div>
                </div>

                {game.rating && (
                  <div className="flex items-center gap-1 bg-graphite/40 px-2 py-0.5 border border-graphite-light/50 rounded-lg text-[9px] font-bold text-bright-snow font-mono">
                    <Trophy size={10} className="text-slate-violet-light" />
                    <span>{game.rating}</span>
                  </div>
                )}
              </div>

              {/* Main Card graphic body */}
              <div className="my-4 flex-1 rounded-xl bg-carbon-black border border-graphite-light/20 overflow-hidden relative group/nested shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                <img
                  src={game.iconSrc}
                  alt={game.title}
                  className="w-full h-full object-cover opacity-35 scale-105"
                />
                
                {/* Visual Glass refraction overlay */}
                <div className="absolute inset-x-3 bottom-3 z-20 bg-carbon-black-2/70 border border-white/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md rounded-xl p-3">
                  <p className="text-[10px] text-alabaster-grey/85 line-clamp-2 leading-relaxed font-outfit">
                    {game.description}
                  </p>
                </div>
              </div>

              {/* Card CTA Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-graphite-light/20">
                <span className="text-[10px] font-bold tracking-widest text-slate-violet-light font-mono">
                  {game.downloads || 'PLAY NOW'}
                </span>
                <span className="px-4 py-1.5 bg-slate-violet border border-slate-violet-light/10 text-[10px] font-bold tracking-widest uppercase rounded-lg text-bright-snow font-sans">
                  LAUNCH
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Manual Switcher Controls */}
      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={prevCard}
          className="p-3 bg-carbon-black-2 hover:bg-graphite border border-graphite-light text-alabaster-grey hover:text-bright-snow rounded-xl transition-all cursor-pointer z-50"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex gap-2">
          {games.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer z-50 ${
                idx === activeIdx ? 'w-6 bg-slate-violet' : 'w-1.5 bg-graphite-light/60'
              }`}
            />
          ))}
        </div>

        <button
          onClick={nextCard}
          className="p-3 bg-carbon-black-2 hover:bg-graphite border border-graphite-light text-alabaster-grey hover:text-bright-snow rounded-xl transition-all cursor-pointer z-50"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

/* ==========================================
   VARIATION B: HOVER-EXPANDING VIDEO STREAM
   ========================================== */
function InfiniteScrollStream({ games }: { games: Game[] }) {
  // Triple the array to ensure perfectly seamless looping
  const tripleGames = [...games, ...games, ...games];
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full relative flex flex-col gap-6 select-none">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-carbon-black to-transparent z-25 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-carbon-black to-transparent z-25 pointer-events-none" />

      {/* Scrolling Ticker Track */}
      <div className="w-full overflow-hidden py-6 relative">
        <div 
          className="infinite-scroll-track gap-6"
          style={{
            animationPlayState: hoveredIdx !== null ? 'paused' : 'running'
          }}
        >
          {tripleGames.map((game, index) => {
            const isHovered = hoveredIdx === index;

            return (
              <motion.div
                key={`${game.id}-${index}`}
                onMouseEnter={() => setHoveredIdx(index)}
                onMouseLeave={() => setHoveredIdx(null)}
                animate={{
                  width: isHovered ? 400 : 280,
                  borderColor: isHovered ? '#7c3aed' : 'rgba(55, 65, 81, 0.4)'
                }}
                transition={{
                  type: 'spring',
                  stiffness: 140,
                  damping: 18
                }}
                className="h-[320px] bg-carbon-black-2 border border-graphite-light p-5 rounded-2xl flex flex-col justify-between hover:shadow-2xl hover:shadow-slate-violet/5 relative group shrink-0 overflow-hidden"
              >
                {/* Refraction edge border overlay */}
                <div className="absolute inset-px rounded-2xl border border-white/5 pointer-events-none z-10" />

                {/* Autoplay Gameplay Video Element */}
                <AnimatePresence>
                  {isHovered && game.videoSrc && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.6 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
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
                      <div className="absolute inset-0 bg-gradient-to-t from-carbon-black via-carbon-black/40 to-transparent" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Card Content Overlay */}
                <div className="relative z-10 flex flex-col justify-between h-full pointer-events-none">
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

                  <div className="flex flex-col gap-3">
                    <p className={`text-[10px] text-alabaster-grey/85 font-outfit leading-relaxed line-clamp-3 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-65'}`}>
                      {game.description}
                    </p>

                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1.5 text-[9px] font-bold text-slate-violet-light uppercase tracking-wider font-mono"
                      >
                        <Sparkles size={11} className="animate-pulse" />
                        <span>Autoplay video gameplay running</span>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center justify-between border-t border-graphite-light/20 pt-3">
                    <span className="text-[9px] font-mono text-slate-violet-light">
                      {game.downloads || 'EXPLORE'}
                    </span>
                    <span className="text-[9px] font-bold text-bright-snow group-hover:text-slate-violet-light transition-colors flex items-center gap-1 font-outfit uppercase">
                      View Game <ChevronRight size={10} />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* CSS Animation injection to keep execution 100% off the main thread */}
      <style>{`
        .infinite-scroll-track {
          display: flex;
          width: max-content;
          animation: scroll-infinite-stream 30s linear infinite;
        }
        @keyframes scroll-infinite-stream {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-33.333%, 0, 0);
          }
        }
      `}</style>
    </div>
  );
}

/* ==========================================
   VARIATION C: LIQUID LENS ACCORDION
   ========================================== */
function LiquidLensAccordion({ games }: { games: Game[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Horizontal Flex Grid Wrapper */}
      <div className="w-full h-[380px] flex gap-4 overflow-hidden py-2">
        {games.map((game, index) => {
          const isHovered = hoveredIdx === index;
          const isAnythingHovered = hoveredIdx !== null;
          
          // Determine flex state
          // Default: 1. If hovered: 4.5. If other is hovered: 0.6.
          let flexVal = 1;
          if (isAnythingHovered) {
            flexVal = isHovered ? 4.5 : 0.6;
          }

          return (
            <motion.div
              key={game.id}
              layout
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              animate={{
                flex: flexVal,
                borderColor: isHovered ? '#7c3aed' : 'rgba(55, 65, 81, 0.35)'
              }}
              transition={{
                type: 'spring',
                stiffness: 90,
                damping: 18
              }}
              className={`relative h-full bg-carbon-black-2 border rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between p-6 group shadow-lg ${
                isHovered ? 'shadow-slate-violet/5' : ''
              }`}
            >
              {/* Card Refraction Overlay */}
              <div className="absolute inset-px rounded-3xl border border-white/5 pointer-events-none z-10" />

              {/* Background cover image blurring & scaling */}
              <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent z-10" />
                <motion.img
                  src={game.iconSrc}
                  alt={game.title}
                  animate={{
                    scale: isHovered ? 1.15 : 1.0,
                    filter: isHovered ? 'blur(10px) brightness(0.2)' : 'blur(20px) brightness(0.12)'
                  }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CARD BODY IN COLLAPSED STATE */}
              <AnimatePresence>
                {!isHovered && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-between py-6 px-2 pointer-events-none"
                  >
                    {/* Index Number */}
                    <span className="text-[10px] font-mono font-bold text-slate-violet-light/70 tracking-widest">
                      0{index + 1}
                    </span>

                    {/* Vertical rotated game title */}
                    <h3 
                      className="text-xs font-bold text-alabaster-grey/40 uppercase font-russo-one tracking-widest whitespace-nowrap"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)'
                      }}
                    >
                      {game.title}
                    </h3>

                    {/* Collapsed Store Icon badge */}
                    <div className="bg-graphite/40 border border-graphite-light/40 p-1.5 rounded-lg flex items-center justify-center">
                      <img
                        src={game.iconSrc}
                        alt={game.title}
                        className="w-4 h-4 rounded object-cover"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CARD BODY IN EXPANDED STATE */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="relative z-20 flex flex-col justify-between h-full pointer-events-none"
                  >
                    {/* Header Info */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={game.iconSrc}
                          alt={game.title}
                          className="w-12 h-12 rounded-2xl object-cover border border-graphite-light/50 shadow-inner"
                        />
                        <div>
                          <h3 className="text-sm sm:text-base font-bold text-bright-snow font-russo-one tracking-wide">
                            {game.title}
                          </h3>
                          <div className="flex gap-1.5 mt-0.5 text-alabaster-grey/50">
                            {game.isIOS && <AppStoreIcon className="w-3 h-3 text-slate-violet-light" />}
                            {game.isAndroid && <PlayStoreIcon className="w-3 h-3 text-slate-violet-light" />}
                            {game.isPoki && <Globe size={11} className="text-slate-violet-light" />}
                          </div>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono text-slate-violet-light/50">
                        0{index + 1}
                      </span>
                    </div>

                    {/* Description Details */}
                    <div className="my-6">
                      <p className="text-xs text-alabaster-grey/85 leading-relaxed font-outfit max-w-md">
                        {game.description}
                      </p>
                    </div>

                    {/* Footer CTAs */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex gap-4">
                        {game.rating && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-bright-snow">
                            <span className="text-slate-violet-light">★</span> {game.rating}
                          </div>
                        )}
                        {game.downloads && (
                          <div className="flex items-center gap-1.5 text-[10px] font-bold font-mono text-alabaster-grey/50">
                            <Smartphone size={10} className="text-slate-violet-light" /> {game.downloads}
                          </div>
                        )}
                      </div>

                      <span className="px-4 py-1.5 bg-slate-violet border border-slate-violet-light/10 text-[9px] font-bold tracking-widest uppercase rounded-lg text-bright-snow flex items-center gap-1 shadow-md shadow-slate-violet/20 font-sans">
                        LAUNCH <Play size={8} fill="currentColor" />
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
