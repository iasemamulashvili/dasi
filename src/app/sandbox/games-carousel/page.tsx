'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useAnimationFrame, animate } from 'framer-motion';
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

// Official Black Store Badges
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
    videoSrc: "/videos/lumber-chopper.mp4"
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
    videoSrc: "/videos/lumber-chopper.mp4"
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
    videoSrc: "/videos/lumber-chopper.mp4"
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
    videoSrc: "/videos/lumber-chopper.mp4"
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
    videoSrc: "/videos/lumber-chopper.mp4"
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
    videoSrc: "/videos/lumber-chopper.mp4"
  }
];

export default function GamesCarouselSandbox() {
  const [activeTab, setActiveTab] = useState<'kinetic' | 'glide' | 'scrub'>('kinetic');

  return (
    <div className="min-h-screen bg-carbon-black text-alabaster-grey relative overflow-x-hidden select-none">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes scan-line-anim {
          0% { top: 0%; }
          100% { top: 100%; }
        }
        .animate-scan-line {
          animation: scan-line-anim 4s linear infinite;
        }
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      ` }} />
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
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 border-b border-graphite-light/35 pb-5 w-full">
          <div className="flex flex-row overflow-x-auto max-w-full bg-carbon-black-2 border border-graphite-light p-1 rounded-xl gap-1 shrink-0 scrollbar-none">
            <button
              onClick={() => setActiveTab('kinetic')}
              className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer font-sans text-center whitespace-nowrap shrink-0 ${
                activeTab === 'kinetic'
                  ? 'bg-slate-violet text-bright-snow shadow-lg shadow-slate-violet/20'
                  : 'text-alabaster-grey/60 hover:text-bright-snow hover:bg-graphite/40'
              }`}
            >
              Solution A: Kinetic Spin Wheel
            </button>
            <button
              onClick={() => setActiveTab('glide')}
              className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer font-sans text-center whitespace-nowrap shrink-0 ${
                activeTab === 'glide'
                  ? 'bg-slate-violet text-bright-snow shadow-lg shadow-slate-violet/20'
                  : 'text-alabaster-grey/60 hover:text-bright-snow hover:bg-graphite/40'
              }`}
            >
              Solution B: Glide Arrow Buttons
            </button>
            <button
              onClick={() => setActiveTab('scrub')}
              className={`px-5 py-2.5 text-xs font-bold tracking-widest uppercase rounded-lg transition-all cursor-pointer font-sans text-center whitespace-nowrap shrink-0 ${
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
/* ==========================================
   VARIATION A: KINETIC BEZEL DEVICE CARD
   ========================================== */
function KineticCard({ 
  game, 
  index, 
  hoveredIdx, 
  setHoveredIdx,
  isMobile
}: { 
  game: Game; 
  index: number; 
  hoveredIdx: number | null; 
  setHoveredIdx: (idx: number | null) => void;
  isMobile: boolean;
}) {
  const isHovered = !isMobile && hoveredIdx === index;

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
        borderColor: isHovered ? 'var(--color-platinum-silver)' : 'rgba(55, 65, 81, 0.4)'
      }}
      transition={{
        type: 'spring',
        stiffness: 145,
        damping: 20
      }}
      className="h-[320px] bg-carbon-black-2 border border-graphite-light p-4 rounded-2xl flex flex-col justify-between hover:shadow-2xl hover:shadow-white/5 relative group shrink-0 overflow-hidden"
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
        {isHovered && (
          <div className="absolute inset-x-0 h-[1.5px] bg-white/20 pointer-events-none z-10 animate-scan-line" />
        )}
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
          {!isMobile && (
            <span className="text-[9px] font-mono text-alabaster-grey/70">
              {game.downloads || 'FREE'}
            </span>
          )}
          
          {isMobile ? (
            <div className="flex items-center justify-between w-full pointer-events-auto">
              <span className="text-[9px] font-mono text-alabaster-grey/70">
                {game.downloads || 'FREE'}
              </span>
              <div className="flex items-center gap-1.5">
                {activeStores.map((store) => (
                  <a
                    key={store.id}
                    href={store.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cursor-pointer flex shrink-0 py-2 px-1 -my-2 -mx-1"
                    title={store.label}
                  >
                    {store.id === 'ios' ? <AppStoreBadge className="h-[22px] w-auto" /> : 
                     store.id === 'android' ? <PlayStoreBadge className="h-[22px] w-auto" /> : 
                     <PokiPlayBadge className="h-[22px] w-auto" />}
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 relative h-[26px] min-w-[100px] justify-end pointer-events-auto">
              <motion.span
                animate={{ x: isHovered && activeStores.length > 0 ? -(activeStores.length * 82 + 6) : 0 }}
                transition={{ type: 'spring', stiffness: 120, damping: 20 }}
                className="text-[9px] font-bold text-bright-snow flex items-center gap-1 font-outfit uppercase pointer-events-none absolute right-0"
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
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================
   VARIATION B: GLIDE FULL-BLEED BACKDROP CARD
   ========================================== */
function GlideCard({ 
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
        height: isHovered ? 380 : 320,
        scale: isHovered ? 1.02 : 1,
        borderColor: isHovered ? '#7c3aed' : 'rgba(55, 65, 81, 0.4)'
      }}
      transition={{
        type: 'spring',
        stiffness: 145,
        damping: 20
      }}
      className="border border-graphite-light rounded-2xl flex flex-col justify-between hover:shadow-2xl hover:shadow-slate-violet/10 relative group shrink-0 overflow-hidden bg-gradient-to-br from-carbon-black-2 to-graphite/30"
    >
      <div className="absolute inset-px rounded-2xl border border-white/5 pointer-events-none z-20" />

      {/* Backdrop (Static Game Icon when not hovered) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-all duration-500 ease-in-out"
        style={{ opacity: isHovered ? 0 : 0.15 }}
      >
        <img
          src={game.iconSrc}
          alt={game.title}
          className="w-full h-full object-cover filter blur-[20px]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-black via-carbon-black/70 to-transparent" />
      </div>

      {/* Top screen panel for Video/Preview (revealed at full brightness on hover) */}
      <motion.div
        animate={{
          height: isHovered ? 160 : 0,
          opacity: isHovered ? 1 : 0
        }}
        transition={{
          type: 'spring',
          stiffness: 145,
          damping: 20
        }}
        className="w-full bg-zinc-950 overflow-hidden relative shrink-0 z-10 border-b border-graphite-light/20"
      >
        {game.id === 'lumber-chopper' && game.videoSrc ? (
          <>
            <video
              src={game.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-red-600/90 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1 z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[8px] font-mono font-bold text-bright-snow uppercase tracking-wider">Preview</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-carbon-black-2 relative">
            <img
              src={game.iconSrc}
              alt={game.title}
              className="w-16 h-16 rounded-xl object-cover border border-white/10 relative z-10 shadow-lg"
            />
            <img
              src={game.iconSrc}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover filter blur-[8px] opacity-20 pointer-events-none"
            />
          </div>
        )}
      </motion.div>

      {/* Card Details Tray - slides down into solid opaque bg-carbon-black */}
      <div 
        className={`flex-1 flex flex-col justify-between z-10 relative select-none w-full transition-all duration-300 ${
          isHovered 
            ? 'bg-carbon-black p-4' 
            : 'bg-transparent p-5'
        }`}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <img
              src={game.iconSrc}
              alt={game.title}
              className="w-10 h-10 rounded-xl object-cover border border-graphite-light/50 shrink-0"
            />
            <div>
              <h4 className="text-xs font-bold text-bright-snow font-russo-one tracking-wide">
                {game.title}
              </h4>
            </div>
          </div>

          <p className={`text-[10px] text-alabaster-grey/85 font-outfit leading-relaxed line-clamp-3 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-65'}`}>
            {game.description}
          </p>

          {isHovered && game.id === 'lumber-chopper' && (
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

        <div className="flex items-center justify-between border-t border-graphite-light/20 pt-3 mt-2 pointer-events-auto">
          <span className="text-[9px] font-mono text-slate-violet-light shrink-0">
            {game.downloads || 'FREE'}
          </span>
          <div className="flex items-center gap-1.5">
            {game.isIOS && game.appstoreLink && (
              <a href={game.appstoreLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer shrink-0">
                <AppStoreBadge className="h-[26px] w-auto" />
              </a>
            )}
            {game.isAndroid && game.playstoreLink && (
              <a href={game.playstoreLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer shrink-0">
                <PlayStoreBadge className="h-[26px] w-auto" />
              </a>
            )}
            {game.isPoki && game.pokiLink && (
              <a href={game.pokiLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer shrink-0">
                <PokiPlayBadge className="h-[26px] w-auto" />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ==========================================
   VARIATION C: TIMELINE SPLIT APP STORE CARD
   ========================================== */
function TimelineCard({ 
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
  const hasStore = game.isIOS || game.isAndroid || game.isPoki;

  return (
    <motion.div
      onMouseEnter={() => setHoveredIdx(index)}
      onMouseLeave={() => setHoveredIdx(null)}
      animate={{
        scale: isHovered ? 1.03 : 1,
        borderColor: isHovered ? '#7c3aed' : 'rgba(55, 65, 81, 0.4)'
      }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 22
      }}
      className="w-[280px] h-[340px] bg-carbon-black-2 border border-graphite-light rounded-2xl flex flex-col justify-between hover:shadow-2xl hover:shadow-slate-violet/5 relative group shrink-0 overflow-hidden"
    >
      <div className="absolute inset-px rounded-2xl border border-white/5 pointer-events-none z-20" />

      {/* Top 50%: Fixed Continuous Autoplay Video Header / Graphic */}
      <div className="h-[150px] w-full bg-zinc-950 overflow-hidden relative border-b border-graphite-light/30">
        {game.id === 'lumber-chopper' && game.videoSrc ? (
          <>
            <video
              src={game.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-carbon-black/75 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1 z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-mono font-bold text-bright-snow uppercase tracking-wider">Gameplay</span>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-carbon-black-2 relative">
            <img
              src={game.iconSrc}
              alt={game.title}
              className="w-16 h-16 rounded-xl object-cover border border-white/10 relative z-10 shadow-lg"
            />
            <img
              src={game.iconSrc}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover filter blur-[8px] opacity-20 pointer-events-none"
            />
            <div className="absolute top-3 left-3 bg-carbon-black/75 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 flex items-center gap-1 z-10">
              <span className="text-[8px] font-mono font-bold text-bright-snow uppercase tracking-wider">Preview</span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom 50%: Clean dark theme metadata details & slate-violet button */}
      <div className="flex-1 w-full bg-carbon-black-2 text-alabaster-grey p-4 flex flex-col justify-between relative z-10">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <img
                src={game.iconSrc}
                alt={game.title}
                className="w-7 h-7 rounded-lg object-cover border border-graphite-light/30"
              />
              <h4 className="text-xs font-bold text-bright-snow font-russo-one tracking-wide line-clamp-1">
                {game.title}
              </h4>
            </div>
            {game.rating && (
              <div className="flex items-center gap-0.5 bg-carbon-black/60 border border-graphite-light/30 px-1.5 py-0.5 rounded text-[9px] font-bold text-amber-500 font-mono">
                <span>{game.rating}</span>
                <span>★</span>
              </div>
            )}
          </div>
          
          <p className="text-[10px] text-alabaster-grey/70 font-outfit leading-relaxed line-clamp-2">
            {game.description}
          </p>
        </div>

        <div className="flex flex-col gap-2 pt-2 border-t border-graphite-light/20">
          <div className="flex items-center justify-between text-[8px] font-mono text-alabaster-grey/70">
            <span>{game.downloads ? `${game.downloads} DOWNLOADS` : 'FREE TO PLAY'}</span>
          </div>

          {hasStore ? (
            <div className="flex flex-wrap gap-2 justify-center items-center w-full">
              {game.isIOS && game.appstoreLink && (
                <a href={game.appstoreLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer shrink-0">
                  <AppStoreBadge className="h-[28px] w-auto" />
                </a>
              )}
              {game.isAndroid && game.playstoreLink && (
                <a href={game.playstoreLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer shrink-0">
                  <PlayStoreBadge className="h-[28px] w-auto" />
                </a>
              )}
              {game.isPoki && game.pokiLink && (
                <a href={game.pokiLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer shrink-0">
                  <PokiPlayBadge className="h-[28px] w-auto" />
                </a>
              )}
            </div>
          ) : (
            <Link
              href="#"
              className="w-full bg-slate-violet hover:bg-slate-violet-light text-white rounded-xl py-2 text-[10px] font-bold font-sans tracking-widest uppercase text-center cursor-pointer transition-all flex items-center justify-center gap-1"
            >
              <Play size={10} fill="currentColor" /> GET GAME
            </Link>
          )}
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

  const repeatInterval = games.length * 304;

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || window.matchMedia('(pointer: coarse)').matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const trackX = useMotionValue(0);

  useEffect(() => {
    setDragConstraints({
      left: -repeatInterval * 2,
      right: 0
    });
  }, [repeatInterval]);

  // Infinite auto-scroll loop
  useAnimationFrame((time, delta) => {
    // Stop scrolling when dragging, hovered, or cooling down
    if (isDragging || hoveredIdx !== null || isCooldown) return;

    const speed = 0.85 * (delta / 16.6); // normalize ~60fps scroll
    let nextX = trackX.get() - speed;

    // Wrapping boundary logic
    if (nextX < -repeatInterval) {
      nextX += repeatInterval;
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
    if (currentX < -repeatInterval) {
      currentX += repeatInterval;
      trackX.set(currentX);
    } else if (currentX > 0) {
      currentX -= repeatInterval;
      trackX.set(currentX);
    }

    // Wait 4.5 seconds before resuming auto-scroll ticker loop
    cooldownTimer.current = setTimeout(() => {
      setIsCooldown(false);
    }, 4500);
  };

  const animateTo = (targetX: number) => {
    animate(trackX, targetX, {
      type: 'spring',
      stiffness: 100,
      damping: 22
    });
  };

  const handlePrev = () => {
    setIsCooldown(true);
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    
    const currentX = trackX.get();
    const nearestCardIdx = Math.round(currentX / 304);
    let targetX = (nearestCardIdx + 1) * 304;
    
    if (targetX > 0) {
      targetX -= repeatInterval;
    }
    
    animateTo(targetX);
    
    cooldownTimer.current = setTimeout(() => {
      setIsCooldown(false);
    }, 5000);
  };

  const handleNext = () => {
    setIsCooldown(true);
    if (cooldownTimer.current) clearTimeout(cooldownTimer.current);
    
    const currentX = trackX.get();
    const nearestCardIdx = Math.round(currentX / 304);
    let targetX = (nearestCardIdx - 1) * 304;
    
    if (targetX < -repeatInterval * 2) {
      targetX += repeatInterval;
    }
    
    animateTo(targetX);
    
    cooldownTimer.current = setTimeout(() => {
      setIsCooldown(false);
    }, 5000);
  };

  return (
    <div ref={containerRef} className="w-full relative flex flex-col gap-6 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-carbon-black to-transparent z-25 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-carbon-black to-transparent z-25 pointer-events-none" />

      {/* Drag Track Container */}
      <div className="w-full overflow-hidden py-4 cursor-grab active:cursor-grabbing">
        <motion.div
          ref={trackRef}
          drag="x"
          style={{ x: trackX }}
          dragConstraints={dragConstraints}
          dragElastic={0.1}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          className="flex gap-6 w-max px-6 touch-pan-y"
        >
          {tripleGames.map((game, index) => (
            <KineticCard
              key={`${game.id}-kinetic-${index}`}
              game={game}
              index={index}
              hoveredIdx={hoveredIdx}
              setHoveredIdx={setHoveredIdx}
              isMobile={isMobile}
            />
          ))}
        </motion.div>
      </div>

      {/* Manual Arrow Controls & Instruction */}
      <div className="flex flex-col sm:flex-row items-center justify-between px-6 gap-4 z-30">
        <div className="flex justify-center gap-1.5 items-center text-[10px] text-alabaster-grey/70 uppercase tracking-widest font-mono pointer-events-none">
          <MousePointer size={12} />
          <span>Drag track directly or use buttons to navigate</span>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="p-3 md:p-2.5 bg-carbon-black-2 hover:bg-graphite border border-graphite-light hover:border-platinum-silver text-alabaster-grey hover:text-bright-snow rounded-xl transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Previous Game"
          >
            <ChevronLeft size={18} className="md:w-4 md:h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-3 md:p-2.5 bg-carbon-black-2 hover:bg-graphite border border-graphite-light hover:border-platinum-silver text-alabaster-grey hover:text-bright-snow rounded-xl transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Next Game"
          >
            <ChevronRight size={18} className="md:w-4 md:h-4" />
          </button>
        </div>
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
            <GlideCard
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
            <TimelineCard
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
