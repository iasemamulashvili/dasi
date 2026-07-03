'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { 
  Cpu, 
  Sparkles, 
  RefreshCw, 
  Play, 
  ArrowRight, 
  Globe, 
  Eye, 
  Grid, 
  Monitor, 
  Check 
} from 'lucide-react';

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

// Game interface matching GamesShowcase
interface SandboxGame {
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
}

const sandboxGames: SandboxGame[] = [
  {
    id: 'crown-quest',
    title: 'Crown Quest',
    description: 'Embark on an epic fantasy RPG quest. Command legendary heroes, conquer tactical grid battles, and construct your royal stronghold in a war-torn kingdom.',
    iconSrc: 'https://play-lh.googleusercontent.com/YI2kzNZ-04oONlOGjZRriWAu80b6Gve8oXs0I2A1xLreESb4fwES4FT0aP3HrgvOFw=s256-rw',
    iconAlt: 'Crown_Quest',
    playstoreLink: 'https://play.google.com/store/apps/details?id=dasi.arpg.crownquest&hl=en',
    appstoreLink: 'https://apps.apple.com/us/app/crown-quest-action-rpg/id6477858164',
    pokiLink: '',
    isAndroid: true,
    isIOS: true,
    isPoki: false
  },
  {
    id: 'lumber-chopper',
    title: 'Lumber Chopper',
    description: 'Harvest resources, optimize lumber mills, and build a massive wood-chopping dynasty. Automate operations and manage supply chains in this highly addictive idle tycoon.',
    iconSrc: 'https://play-lh.googleusercontent.com/0_2l4Yk9uqKwTvAv-yZp02Og-DRr5GT-AfsH42zjExvkQkKsP4NUsyZz0lp8APHMaQ=s256-rw',
    iconAlt: 'Lumber_Chopper',
    playstoreLink: 'https://play.google.com/store/apps/details?id=dasi.prs2.lumberchopper&hl=en',
    appstoreLink: 'https://apps.apple.com/us/app/lumber-chopper-harvest-empire/id6738272884',
    pokiLink: '',
    isAndroid: true,
    isIOS: true,
    isPoki: false
  },
  {
    id: 'hotel-manager',
    title: 'Hotel Manager',
    description: 'Design, build, and run a 5-star luxury resort empire. Hire world-class chefs, staff, and design stunning suites to keep VIP clients happy and maximize profits.',
    iconSrc: 'https://play-lh.googleusercontent.com/Z3HMAnuhBtnY9EvIUO_xRQCc9ciOscrn74X16Jp0BASxll1Wfdxih_HLxpKqO3asZe0=s256-rw',
    iconAlt: 'Hotel_Manager',
    playstoreLink: 'https://play.google.com/store/apps/details?id=dasi.prs3.hotelmanager&hl=en',
    appstoreLink: 'https://apps.apple.com/us/app/hotel-manager-resort-empire/id6748454899',
    pokiLink: '',
    isAndroid: true,
    isIOS: true,
    isPoki: false
  }
];

// Option A: Cyber Scanning Matrix (2D Canvas)
function CyberScanningMatrix({ isHovered }: { isHovered: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const fontSize = 10;
    let columns = Math.floor(canvas.width / fontSize) || 20;
    let drops: number[] = Array(columns).fill(0).map(() => Math.random() * -30);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      columns = Math.floor(canvas.width / fontSize) || 20;
      drops = Array(columns).fill(0).map(() => Math.random() * -30);
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZMATRIXSYS';
    let sweepY = 0;
    let sweepDirection = 1;

    const render = () => {
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
        if (Math.random() > 0.96) {
          ctx.fillStyle = '#ffffff';
        } else {
          // Phosphor high contrast green
          ctx.fillStyle = 'oklch(0.82 0.23 140.0)';
        }

        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += isHovered ? 1.4 : 0.75;
      }

      // 2. Scan sweep
      const sweepSpeed = isHovered ? 3.5 : 1.5;
      sweepY += sweepSpeed * sweepDirection;
      if (sweepY > canvas.height) {
        sweepY = canvas.height;
        sweepDirection = -1;
      } else if (sweepY < 0) {
        sweepY = 0;
        sweepDirection = 1;
      }

      // Sweep gradient glow
      const grad = ctx.createLinearGradient(0, sweepY - 12, 0, sweepY + 12);
      grad.addColorStop(0, 'rgba(34, 197, 94, 0)');
      grad.addColorStop(0.5, 'rgba(34, 197, 94, 0.25)');
      grad.addColorStop(1, 'rgba(34, 197, 94, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, sweepY - 12, canvas.width, 24);

      // Scanline beam
      ctx.fillStyle = 'rgba(34, 197, 94, 0.7)';
      ctx.fillRect(0, sweepY, canvas.width, 1);

      // 3. Diagnostic vertical tracking bar
      const padding = 12;
      const barW = 3;
      const barH = canvas.height - padding * 2;
      
      ctx.strokeStyle = 'rgba(34, 197, 94, 0.2)';
      ctx.lineWidth = 1;
      ctx.strokeRect(padding, padding, barW, barH);
      
      const level = 0.5 + Math.sin(Date.now() * 0.002) * 0.35;
      ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
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

      // Corner readout
      ctx.fillStyle = 'rgba(34, 197, 94, 0.5)';
      ctx.font = '8px monospace';
      ctx.fillText('CYBER_SCAN: ON', padding + 10, padding + 10);
      ctx.fillText(`SWEEP: ${sweepY.toFixed(0)}PX`, padding + 10, padding + 20);

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isHovered]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" />;
}

// Option B: Vector Waveform Spectrum
function VectorWaveformSpectrum({ isHovered }: { isHovered: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;
    let speedMult = 1.0;
    let ampMult = 1.0;

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const render = () => {
      // Background tail fade
      ctx.fillStyle = 'rgba(18, 18, 20, 0.15)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Smooth transition for speed and amplitude based on hover state
      const targetSpeed = isHovered ? 2.2 : 1.0;
      const targetAmp = isHovered ? 1.5 : 1.0;
      speedMult += (targetSpeed - speedMult) * 0.08;
      ampMult += (targetAmp - ampMult) * 0.08;

      const drawWave = (
        color: string, 
        baseFreq: number, 
        baseAmp: number, 
        lineWidth: number, 
        phase: number,
        fillUnder: boolean
      ) => {
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.shadowBlur = isHovered ? 16 : 6;
        ctx.shadowColor = color;

        const cy = canvas.height / 2;
        const amplitude = baseAmp * ampMult;
        const frequency = baseFreq;

        for (let x = 0; x <= canvas.width; x += 5) {
          const y = cy + 
            Math.sin(x * frequency + time * 0.04 * speedMult + phase) * amplitude * 
            Math.cos(x * 0.003 - time * 0.015 * speedMult);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        if (fillUnder) {
          ctx.lineTo(canvas.width, canvas.height);
          ctx.lineTo(0, canvas.height);
          ctx.closePath();
          const grad = ctx.createLinearGradient(0, cy - amplitude, 0, canvas.height);
          grad.addColorStop(0, color.replace('0.65', '0.04').replace('0.7', '0.04'));
          grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = grad;
          ctx.fill();
        }
      };

      // Blue Wave (flowing oklch equivalent)
      drawWave('rgba(59, 130, 246, 0.65)', 0.007, 32, 2.0, 0, true);

      // Pink Wave (opposite phase)
      drawWave('rgba(236, 72, 153, 0.65)', 0.011, 22, 1.5, Math.PI, true);

      // Draw interactive nodes that glide along the blue wave path
      const nodeX = ((time * 1.0 * speedMult)) % (canvas.width + 40) - 20;
      if (nodeX > 0 && nodeX < canvas.width) {
        const cy = canvas.height / 2;
        const amplitude = 32 * ampMult;
        const frequency = 0.007;
        const nodeY = cy + 
          Math.sin(nodeX * frequency + time * 0.04 * speedMult) * amplitude * 
          Math.cos(nodeX * 0.003 - time * 0.015 * speedMult);

        ctx.beginPath();
        ctx.arc(nodeX, nodeY, isHovered ? 4.5 : 3.0, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 12;
        ctx.shadowColor = 'rgba(59, 130, 246, 0.9)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      time += 0.6;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isHovered]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" />;
}

// Option C: 8-Bit Glitch Terminal
function GlitchTerminal({ isHovered, gameId }: { isHovered: boolean; gameId: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let progress = 0;
    
    // Choose theme colors dynamically based on gameId to look highly customized
    let phosphorColor = 'rgba(34, 197, 94, 0.85)'; // Default green
    let glowColor = 'rgba(34, 197, 94, 0.35)';
    
    if (gameId === 'crown-quest') {
      phosphorColor = 'rgba(245, 158, 11, 0.85)'; // Amber
      glowColor = 'rgba(245, 158, 11, 0.35)';
    } else if (gameId === 'hotel-manager') {
      phosphorColor = 'rgba(6, 182, 212, 0.85)'; // Cyan
      glowColor = 'rgba(6, 182, 212, 0.35)';
    }

    const handleResize = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    const logs = [
      'BOOT_SECTOR: OK',
      'DECOMPRESSING_RESOURCES...',
      'RAM CHECK: 640KB OK',
      'CRT_SYNC: REFRESH 60HZ',
      'INITIALIZING ENGINE...',
      'NET_CONN: SYN_ACK',
      'CORE_ASSETS: OK',
      'READY.'
    ];

    let visibleLogs: string[] = [];

    const render = () => {
      // Background charcoal black
      ctx.fillStyle = 'rgba(15, 15, 17, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const now = Date.now();
      const flickerVal = Math.random();
      
      // Drifting sync bar
      const syncY = (now * 0.05) % canvas.height;
      ctx.fillStyle = `rgba(255, 255, 255, ${flickerVal > 0.92 ? 0.025 : 0.008})`;
      ctx.fillRect(0, syncY, canvas.width, 18);

      // CRT Scanlines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 3) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Progress bar simulation
      const speed = isHovered ? 0.65 : 0.22;
      progress = (progress + speed);
      if (progress >= 100) {
        if (progress > 135) {
          progress = 0;
          visibleLogs = [];
        }
      }

      const activeCount = Math.min(
        logs.length,
        Math.floor((progress / 100) * logs.length) + 1
      );

      if (visibleLogs.length < activeCount && activeCount <= logs.length) {
        visibleLogs = logs.slice(0, activeCount);
      }

      // Draw logs
      ctx.font = '9px monospace';
      ctx.fillStyle = phosphorColor;
      ctx.shadowBlur = 3;
      ctx.shadowColor = glowColor;

      const paddingX = 14;
      const startY = 24;
      const lineH = 12;

      visibleLogs.forEach((log, index) => {
        let text = `> ${log}`;
        if (isHovered && Math.random() > 0.98 && index < visibleLogs.length - 1) {
          text = `> ${log.slice(0, -3)}#!$`;
        }
        ctx.fillText(text, paddingX, startY + index * lineH);
      });

      // Terminal cursor
      if (visibleLogs.length > 0 && progress < 100) {
        const lastLog = visibleLogs[visibleLogs.length - 1];
        const textWidth = ctx.measureText(`> ${lastLog}`).width;
        const cursorX = paddingX + textWidth + 3;
        const cursorY = startY + (visibleLogs.length - 1) * lineH - 7;
        if (Math.floor(now / 200) % 2 === 0) {
          ctx.fillRect(cursorX, cursorY, 4, 8);
        }
      }

      // Progress bar
      const barY = canvas.height - 30;
      const barW = canvas.width - paddingX * 2;
      const barH = 8;

      ctx.strokeStyle = phosphorColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(paddingX, barY, barW, barH);

      const fillPct = Math.min(100, Math.floor(progress));
      const filledW = Math.floor(barW * (fillPct / 100));

      // Draw block progress loaders
      const blockWidth = 5;
      const gap = 1;
      const blocksCount = Math.floor(filledW / (blockWidth + gap));
      
      ctx.fillStyle = phosphorColor;
      for (let b = 0; b < blocksCount; b++) {
        ctx.fillRect(paddingX + 1 + b * (blockWidth + gap), barY + 1, blockWidth, barH - 2);
      }

      ctx.font = '8px monospace';
      ctx.fillText(`LOADING: ${fillPct}%`, paddingX, barY - 5);

      ctx.shadowBlur = 0;
      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, [isHovered, gameId]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0" />;
}

// Wrapper Game Card component matching GamesShowcase layout, styling, and 3D tilting
function SandboxGameCard({ 
  game, 
  fallbackType, 
  showArtwork
}: { 
  game: SandboxGame; 
  fallbackType: 'A' | 'B' | 'C'; 
  showArtwork: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 800,
      scale: 1.02,
      duration: 0.3,
      ease: 'power2.out',
    });

    const shineEl = card.querySelector('.card-shine') as HTMLElement;
    if (shineEl) {
      gsap.to(shineEl, {
        opacity: 0.15,
        left: `${(x / rect.width) * 100}%`,
        top: `${(y / rect.height) * 100}%`,
        duration: 0.2,
      });
    }
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    setIsHovered(false);
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });

    const shineEl = card.querySelector('.card-shine') as HTMLElement;
    if (shineEl) {
      gsap.to(shineEl, {
        opacity: 0,
        duration: 0.5,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      className="relative w-[320px] md:w-[350px] h-[460px] md:h-[490px] inset-pixel-card inset-pixel-card-interactive overflow-hidden flex flex-col p-6 cursor-pointer select-none transition-all duration-300 transform-gpu group"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Shine Layer */}
      <div className="card-shine absolute -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white rounded-full blur-2xl opacity-0 pointer-events-none mix-blend-overlay z-10" />

      {/* Game Visual Area */}
      <div className="relative w-full h-[240px] md:h-[260px] bg-carbon-black rounded-lg overflow-hidden mb-6 flex items-center justify-center border border-graphite-light">
        {/* Loading fallbacks inside visual area */}
        {fallbackType === 'A' && (
          <CyberScanningMatrix isHovered={isHovered} />
        )}
        {fallbackType === 'B' && (
          <VectorWaveformSpectrum isHovered={isHovered} />
        )}
        {fallbackType === 'C' && (
          <GlitchTerminal isHovered={isHovered} gameId={game.id} />
        )}

        {/* Game Icon / Artwork - fades out on hover if showArtwork is true */}
        <img
          src={game.iconSrc}
          alt={game.iconAlt}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-out z-10 ${
            showArtwork && !isHovered ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
          }`}
        />

        {/* Play Button Indicator - fading overlay */}
        <div className={`absolute inset-0 bg-black/25 flex items-center justify-center transition-all duration-500 z-20 ${
          isHovered || !showArtwork ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}>
          <span className="p-3 bg-carbon-black/90 border border-graphite-light rounded-xl text-bright-snow shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play size={16} fill="currentColor" />
          </span>
        </div>
      </div>

      {/* Game Metadata info */}
      <div className="flex-1 flex flex-col justify-between relative z-10" style={{ transform: 'translateZ(30px)' }}>
        <div>
          <span className="text-[9px] font-mono text-slate-violet-light uppercase tracking-wider block mb-1">
            {fallbackType === 'A' && 'Opt A // Matrix Sweep'}
            {fallbackType === 'B' && 'Opt B // Vector Wave'}
            {fallbackType === 'C' && 'Opt C // 8-Bit Glitch'}
          </span>
          <h3 className="text-xl font-normal text-bright-snow tracking-wide mb-2 font-russo-one">
            {game.title}
          </h3>
          <p className="text-xs text-alabaster-grey leading-relaxed line-clamp-3 font-outfit font-light">
            {game.description}
          </p>
        </div>

        {/* Platforms & Store badge links */}
        <div className="flex items-center justify-between border-t border-graphite-light pt-4 mt-4">
          <div className="flex items-center gap-1.5">
            {game.isIOS && (
              <span className="p-1.5 bg-carbon-black border border-graphite-light text-alabaster-grey hover:text-bright-snow transition-all flex items-center justify-center">
                <AppStoreIcon className="w-3.5 h-3.5" />
              </span>
            )}
            {game.isAndroid && (
              <span className="p-1.5 bg-carbon-black border border-graphite-light text-alabaster-grey hover:text-bright-snow transition-all flex items-center justify-center">
                <PlayStoreIcon className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[10px] font-mono tracking-widest text-platinum-silver hover:text-bright-snow transition-colors">
            <span>PLAY NOW</span>
            <ArrowRight size={10} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Lab Page
export default function FallbackLabPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'spotlight'>('grid');
  const [spotlightOption, setSpotlightOption] = useState<'A' | 'B' | 'C'>('A');
  const [showArtwork, setShowArtwork] = useState(false);

  return (
    <main className="min-h-screen w-full bg-carbon-black text-bright-snow flex flex-col items-center py-16 px-6 font-sans">
      <div className="max-w-7xl w-full flex flex-col gap-8">
        
        {/* Title Bar */}
        <div className="border-b border-graphite-light pb-6 mb-2 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-slate-violet-light uppercase tracking-widest bg-graphite/40 border border-graphite-light/50 px-2.5 py-1 rounded w-fit">
              <span className="w-1.5 h-1.5 bg-slate-violet-light rounded-full animate-ping" />
              Developer Sandbox // Fallbacks Lab
            </div>
            <h1 className="text-3xl md:text-5xl font-bold tracking-wider text-bright-snow font-russo-one uppercase leading-none retro-heading-shadow">
              Card Fallback Animations
            </h1>
            <p className="text-xs md:text-sm text-alabaster-grey/85 mt-2.5 max-w-2xl leading-relaxed">
              Test and compare high-fidelity fallback canvas loading animations for game cards. They animate continuously, support full mouse hover states, and use modern dark OKLCH styling.
            </p>
          </div>

          {/* Configuration Controls */}
          <div className="flex flex-wrap items-center gap-3.5">
            {/* Show/Hide Artwork Toggle */}
            <button
              onClick={() => setShowArtwork(prev => !prev)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full text-xs font-mono transition-all outline-none focus-visible:ring-2 focus-visible:ring-slate-violet-light cursor-pointer ${
                showArtwork 
                  ? 'bg-platinum-silver text-carbon-black border-transparent font-semibold' 
                  : 'border-graphite-light text-alabaster-grey/70 hover:text-bright-snow hover:border-alabaster-grey/30'
              }`}
            >
              <Eye size={12} />
              {showArtwork ? 'ARTWORK ON' : 'SIMULATING LOAD (ARTWORK OFF)'}
            </button>

            {/* View Mode Switcher */}
            <div className="bg-carbon-black-2 border border-graphite-light rounded-full p-1 flex items-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all outline-none cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-graphite text-bright-snow font-semibold'
                    : 'text-alabaster-grey/60 hover:text-bright-snow'
                }`}
              >
                <Grid size={12} />
                Side-By-Side
              </button>
              <button
                onClick={() => setViewMode('spotlight')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono transition-all outline-none cursor-pointer ${
                  viewMode === 'spotlight'
                    ? 'bg-graphite text-bright-snow font-semibold'
                    : 'text-alabaster-grey/60 hover:text-bright-snow'
                }`}
              >
                <Monitor size={12} />
                Spotlight Switcher
              </button>
            </div>
          </div>
        </div>

        {/* View mode render */}
        {viewMode === 'grid' ? (
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-violet-light">
              <span>// DIRECT COMPARISON (GRID MODE)</span>
              <span>3 ANIMATIONS ACTIVE</span>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-between gap-6 md:gap-8 py-4">
              {/* Option A Card */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  OPTION A: CYBER MATRIX
                </span>
                <SandboxGameCard 
                  game={sandboxGames[0]} 
                  fallbackType="A" 
                  showArtwork={showArtwork}
                />
              </div>

              {/* Option B Card */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono text-pink-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                  OPTION B: VECTOR WAVEFORM
                </span>
                <SandboxGameCard 
                  game={sandboxGames[1]} 
                  fallbackType="B" 
                  showArtwork={showArtwork}
                />
              </div>

              {/* Option C Card */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  OPTION C: 8-BIT TERMINAL
                </span>
                <SandboxGameCard 
                  game={sandboxGames[2]} 
                  fallbackType="C" 
                  showArtwork={showArtwork}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center justify-center">
            {/* Config panel on left */}
            <div className="lg:col-span-1 bg-carbon-black-2 border border-graphite-light p-6 rounded-2xl flex flex-col gap-6 shadow-xl h-fit">
              <div>
                <span className="text-[10px] font-mono text-slate-violet-light uppercase tracking-wider">// SPOTLIGHT CONFIG</span>
                <h2 className="text-xl font-bold uppercase tracking-wider text-bright-snow font-russo-one mt-1">Select animation</h2>
                <p className="text-xs text-alabaster-grey/80 mt-2 leading-relaxed">
                  Select an animation style below to apply it dynamically to the game preview card. Use the hover effect to test user interaction.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setSpotlightOption('A')}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-mono transition-all outline-none cursor-pointer ${
                    spotlightOption === 'A'
                      ? 'bg-emerald-950/20 text-emerald-400 border-emerald-500/40'
                      : 'text-alabaster-grey/60 border-graphite-light hover:border-alabaster-grey/30 bg-transparent'
                  }`}
                >
                  <span>OPTION A: CYBER MATRIX</span>
                  {spotlightOption === 'A' && <Check size={14} />}
                </button>

                <button
                  onClick={() => setSpotlightOption('B')}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-mono transition-all outline-none cursor-pointer ${
                    spotlightOption === 'B'
                      ? 'bg-pink-950/20 text-pink-400 border-pink-500/40'
                      : 'text-alabaster-grey/60 border-graphite-light hover:border-alabaster-grey/30 bg-transparent'
                  }`}
                >
                  <span>OPTION B: VECTOR WAVEFORM</span>
                  {spotlightOption === 'B' && <Check size={14} />}
                </button>

                <button
                  onClick={() => setSpotlightOption('C')}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-xs font-mono transition-all outline-none cursor-pointer ${
                    spotlightOption === 'C'
                      ? 'bg-amber-950/20 text-amber-400 border-amber-500/40'
                      : 'text-alabaster-grey/60 border-graphite-light hover:border-alabaster-grey/30 bg-transparent'
                  }`}
                >
                  <span>OPTION C: 8-BIT TERMINAL</span>
                  {spotlightOption === 'C' && <Check size={14} />}
                </button>
              </div>

              <div className="bg-carbon-black border border-graphite-light p-4 rounded-xl flex flex-col gap-2 font-mono text-[10px] text-alabaster-grey/70 leading-normal">
                <span className="text-bright-snow font-bold uppercase mb-1">// ANIMATION TECH</span>
                {spotlightOption === 'A' && 'Renders a green code rain using canvas columns, combined with a vertical diagnostic sweep and scanlines.'}
                {spotlightOption === 'B' && 'Renders glowing bezier sine waves in pink/blue OKLCH. Hovering expands and accelerates waves smoothly.'}
                {spotlightOption === 'C' && 'Renders 8-bit text logs and a block progress loader with customizable phosphor colors and CRT flickering.'}
              </div>
            </div>

            {/* Spotlight Card Preview (Center / Right) */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center gap-4 py-6">
              <span className="text-xs font-mono text-slate-violet-light uppercase tracking-wider">
                Live Preview (Spotlight)
              </span>
              <SandboxGameCard 
                game={sandboxGames[0]} 
                fallbackType={spotlightOption} 
                showArtwork={showArtwork}
              />
            </div>
          </div>
        )}

        {/* Technical features summary */}
        <div className="p-6 bg-carbon-black-2 border border-graphite-light rounded-2xl grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-[11px] leading-relaxed">
          <div>
            <h4 className="font-bold text-emerald-400 uppercase mb-1.5">Option A: Cyber Matrix</h4>
            <p className="text-alabaster-grey/75 text-[10px]">
              2D Canvas drawing matrix code drops dynamically staggered across grid columns. Adds high-frequency CRT screen scanlines and vertical sweep diagnostic loops.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-pink-400 uppercase mb-1.5">Option B: Vector Waveform</h4>
            <p className="text-alabaster-grey/75 text-[10px]">
              Dual overlayed bezier sin/cos paths drawing glowing vector lines in pink and blue oklch spaces. Reacts dynamically with linear interpolations on mouse hover.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-amber-400 uppercase mb-1.5">Option C: 8-Bit Terminal</h4>
            <p className="text-alabaster-grey/75 text-[10px]">
              Prints a sequence of boot up events character-by-character. Loops loading status using solid pixel block segment graphics with randomized CRT flickering overlays.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}
