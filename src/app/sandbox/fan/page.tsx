'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
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
  Check,
  Trophy,
  Volume2,
  VolumeX,
  X
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

      // Corner readout
      ctx.fillStyle = 'oklch(0.61 0.025 285.0 / 0.6)';
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
  const [empVariant, setEmpVariant] = useState<'A' | 'B' | 'C'>('A');

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
                <span className="text-xs font-mono text-platinum-silver font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-platinum-silver animate-pulse" />
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
                      ? 'bg-slate-950/20 text-platinum-silver border-platinum-silver/40 shadow-[0_0_15px_rgba(226,232,240,0.1)]'
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
                {spotlightOption === 'A' && 'Renders a monochrome graphite and silver code rain using canvas columns, combined with a vertical diagnostic sweep and scanlines.'}
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
            <h4 className="font-bold text-platinum-silver uppercase mb-1.5">Option A: Cyber Matrix</h4>
            <p className="text-alabaster-grey/75 text-[10px]">
              2D Canvas drawing matrix code drops dynamically staggered across grid columns in brand graphite and silver tones. Adds high-frequency CRT screen scanlines and vertical sweep diagnostic loops.
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

        {/* Section: WebGL Slider & EMP Text Warp */}
        <div className="border-t border-graphite-light pt-12 mt-12 flex flex-col gap-8">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-slate-violet-light uppercase tracking-widest bg-graphite/40 border border-graphite-light/50 px-2.5 py-1 rounded w-fit">
              <span className="w-1.5 h-1.5 bg-slate-violet-light rounded-full animate-ping" />
              Interactive EMP Test Lab
            </div>
            <h2 className="text-2xl md:text-4xl font-normal tracking-wide text-bright-snow uppercase font-russo-one retro-heading-shadow">
              WebGL Featured Slider & EMP Text Warp
            </h2>
            <p className="text-xs md:text-sm text-alabaster-grey/85 mt-2.5 max-w-2xl leading-relaxed">
              Click anywhere on the slider viewport below to launch an EMP wave from the coordinates of your cursor. The expanding wavefront will trigger physics-based or digital code offset animations across the title and description letters dynamically.
            </p>
          </div>

          {/* Selectable EMP Variant Controls */}
          <div className="flex flex-wrap items-center gap-4 bg-carbon-black-2 border border-graphite-light p-4 rounded-2xl">
            <span className="text-xs font-mono text-slate-violet-light tracking-wider uppercase font-semibold mr-2">// SELECT EMP WAVE VARIANT:</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEmpVariant('A')}
                className={`px-4 py-2 border rounded-full text-xs font-mono transition-all outline-none cursor-pointer ${
                  empVariant === 'A'
                    ? 'bg-platinum-silver text-carbon-black border-transparent font-semibold shadow-[0_0_15px_rgba(226,232,240,0.15)]'
                    : 'border-graphite-light text-alabaster-grey/70 hover:text-bright-snow hover:border-alabaster-grey/30 bg-transparent'
                }`}
              >
                Option A: Kinetic Offset
              </button>
              <button
                onClick={() => setEmpVariant('B')}
                className={`px-4 py-2 border rounded-full text-xs font-mono transition-all outline-none cursor-pointer ${
                  empVariant === 'B'
                    ? 'bg-platinum-silver text-carbon-black border-transparent font-semibold shadow-[0_0_15px_rgba(226,232,240,0.15)]'
                    : 'border-graphite-light text-alabaster-grey/70 hover:text-bright-snow hover:border-alabaster-grey/30 bg-transparent'
                }`}
              >
                Option B: Matrix Glitch
              </button>
              <button
                onClick={() => setEmpVariant('C')}
                className={`px-4 py-2 border rounded-full text-xs font-mono transition-all outline-none cursor-pointer ${
                  empVariant === 'C'
                    ? 'bg-platinum-silver text-carbon-black border-transparent font-semibold shadow-[0_0_15px_rgba(226,232,240,0.15)]'
                    : 'border-graphite-light text-alabaster-grey/70 hover:text-bright-snow hover:border-alabaster-grey/30 bg-transparent'
                }`}
              >
                Option C: SVG Refractive Warp
              </button>
            </div>
            
            <div className="text-[10px] font-mono text-alabaster-grey/60 mt-1 sm:mt-0 w-full sm:w-auto sm:ml-auto">
              {empVariant === 'A' && '// Pushes text characters outward from click point and skews them'}
              {empVariant === 'B' && '// Staggers cyber-glitch flicker on wave wavefront pass'}
              {empVariant === 'C' && '// Distorts entire text pixels using SVG displacement map'}
            </div>
          </div>

          {/* Mounted WebGL Slider */}
          <SandboxWebGLSlider empVariant={empVariant} />
        </div>

      </div>
    </main>
  );
}

// Helper component to split text into characters for EMP wave propagation
function EmpText({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-block whitespace-nowrap mr-[0.25em]">
          {word.split('').map((char, cIdx) => (
            <span key={cIdx} className="emp-char inline-block origin-center">
              {char}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

// Interface for Wave ripples on shader
interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  intensity: number;
  speed: number;
}

const getVideoFallback = (id: string) => {
  switch (id) {
    case 'crown-quest':
      return 'https://assets.mixkit.co/videos/preview/mixkit-hand-holding-a-smartphone-playing-a-video-game-41584-large.mp4';
    case 'lumber-chopper':
      return '/videos/lumber-chopper.mp4';
    case 'hotel-manager':
      return 'https://assets.mixkit.co/videos/preview/mixkit-luxury-resort-hotel-swimming-pool-and-palm-trees-48744-large.mp4';
    default:
      return '';
  }
};

// Custom local slider component matching WebGLFeaturedSlider but adding text EMP variants
function SandboxWebGLSlider({ empVariant }: { empVariant: 'A' | 'B' | 'C' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const customCursorRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [cursorHovered, setCursorHovered] = useState(false);
  const [webglSupported, setWebglSupported] = useState(true);
  const transitionRef = useRef({ active: false });

  // Gameplay Preview Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const [isModalPlaying, setIsModalPlaying] = useState(true);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // EMP Shockwave Ripple states
  const ripplesRef = useRef<Ripple[]>([]);
  const [rippleTrigger, setRippleTrigger] = useState(0);

  // Map sandboxGames array into rich slider structure
  const gamesData = sandboxGames.map((game) => {
    let image = '/crown-quest.png';
    let subtitle = 'Epic Action RPG Adventure';
    let bgGradient = 'from-graphite/30 via-carbon-black-2/40 to-[#181818]';
    let stats = {
      activePlayers: '1.2M+',
      rating: '4.8',
      downloads: '5M+',
      engine: 'Unity 3D'
    };

    if (game.id === 'lumber-chopper') {
      image = '/lumber-chopper.png';
      subtitle = 'Idle Wood Empire Tycoon';
      bgGradient = 'from-muted-green/20 via-carbon-black-2/40 to-[#181818]';
      stats = {
        activePlayers: '850K+',
        rating: '4.6',
        downloads: '3M+',
        engine: 'Cocos Creator'
      };
    } else if (game.id === 'hotel-manager') {
      image = '/hotel-manager.png';
      subtitle = '5-Star Luxury Resort Simulator';
      bgGradient = 'from-slate-violet/20 via-carbon-black-2/40 to-[#181818]';
      stats = {
        activePlayers: '500K+',
        rating: '4.5',
        downloads: '1.5M+',
        engine: 'Unity 2D'
      };
    }

    return {
      ...game,
      subtitle,
      bgGradient,
      image,
      stats,
      videoSrc: getVideoFallback(game.id)
    };
  });

  // WebGL Context References
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const texturesRef = useRef<WebGLTexture[]>([]);
  const uProgressLocRef = useRef<WebGLUniformLocation | null>(null);
  const uCanvasSizeLocRef = useRef<WebGLUniformLocation | null>(null);
  const uTexture1LocRef = useRef<WebGLUniformLocation | null>(null);
  const uTexture2LocRef = useRef<WebGLUniformLocation | null>(null);
  const uRipplesLocRef = useRef<WebGLUniformLocation | null>(null);

  // Fallback CSS fade system state
  const [prevIndex, setPrevIndex] = useState(0);
  const [fadeProgress, setFadeProgress] = useState(0);

  // Setup WebGL engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
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

      #define MAX_RIPPLES 8
      uniform vec4 u_ripples[MAX_RIPPLES]; // x, y, radius, intensity

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
        vec2 aspect = vec2(u_canvasSize.x / u_canvasSize.y, 1.0);

        vec2 rippleDistortion = vec2(0.0);
        for (int i = 0; i < MAX_RIPPLES; i++) {
          vec4 ripple = u_ripples[i];
          if (ripple.z > 0.0) {
            vec2 center = ripple.xy;
            float radius = ripple.z;
            float intensity = ripple.w;

            vec2 diff = (uv - center) * aspect;
            float dist = length(diff);

            float ringWidth = 0.06;
            if (dist > radius - ringWidth && dist < radius + ringWidth) {
              float peak = abs(dist - radius);
              float norm = peak / ringWidth;
              float force = cos(norm * 3.14159) * 0.5 + 0.5;

              vec2 displace = normalize(diff);
              rippleDistortion += displace * sin((dist - radius) * 45.0) * 0.035 * force * intensity;
            }
          }
        }

        vec2 finalUV = uv + rippleDistortion;
        vec2 imageRatio = vec2(1920.0, 1080.0);
        
        vec2 uv1 = getCoverUV(finalUV, u_canvasSize, imageRatio);
        vec2 uv2 = getCoverUV(finalUV, u_canvasSize, imageRatio);

        float waveNoise = noise(finalUV * 12.0 + vec2(u_progress * 2.0, u_progress * 1.5)) * 0.1;
        
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

    // Geometry vertices
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
    uRipplesLocRef.current = gl.getUniformLocation(program, 'u_ripples');

    // Load textures
    const imageUrls = gamesData.map(g => g.image);
    let loadedCount = 0;
    const loadedImages: HTMLImageElement[] = [];

    const handleLoadedImages = (imgs: HTMLImageElement[]) => {
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
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
      drawWebGL(activeIndex, activeIndex, 0);
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [activeIndex]);

  // WebGL Render call
  const drawWebGL = (currIdx: number, targetIdx: number, progress: number) => {
    const gl = glRef.current;
    const program = programRef.current;
    const textures = texturesRef.current;
    const canvas = canvasRef.current;

    if (!gl || !program || textures.length === 0 || !canvas) return;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, textures[currIdx]);
    if (uTexture1LocRef.current) gl.uniform1i(uTexture1LocRef.current, 0);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, textures[targetIdx]);
    if (uTexture2LocRef.current) gl.uniform1i(uTexture2LocRef.current, 1);

    if (uProgressLocRef.current) gl.uniform1f(uProgressLocRef.current, progress);
    if (uCanvasSizeLocRef.current) gl.uniform2f(uCanvasSizeLocRef.current, canvas.width, canvas.height);

    const rippleArray = new Float32Array(8 * 4);
    for (let i = 0; i < 8; i++) {
      if (i < ripplesRef.current.length) {
        const r = ripplesRef.current[i];
        rippleArray[i * 4] = r.x;
        rippleArray[i * 4 + 1] = r.y;
        rippleArray[i * 4 + 2] = r.radius;
        rippleArray[i * 4 + 3] = r.intensity;
      } else {
        rippleArray[i * 4] = 0.0;
        rippleArray[i * 4 + 1] = 0.0;
        rippleArray[i * 4 + 2] = 0.0;
        rippleArray[i * 4 + 3] = 0.0;
      }
    }
    if (uRipplesLocRef.current) {
      gl.uniform4fv(uRipplesLocRef.current, rippleArray);
    }

    gl.drawArrays(gl.TRIANGLES, 0, 6);
  };

  const transitionTo = (targetIdx: number) => {
    if (targetIdx === activeIndex || transitionRef.current.active) return;
    transitionRef.current.active = true;

    setPrevIndex(activeIndex);
    setActiveIndex(targetIdx);
    setIsModalOpen(false);

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
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (customCursorRef.current) {
      customCursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    }
  };

  const triggerTextEMP = (clickX: number, clickY: number, containerRect: DOMRect) => {
    const slider = sliderRef.current;
    if (!slider) return;

    const charEls = slider.querySelectorAll('.emp-char') as NodeListOf<HTMLElement>;

    if (empVariant === 'A') {
      charEls.forEach((charEl) => {
        const rect = charEl.getBoundingClientRect();
        const charX = rect.left + rect.width / 2 - containerRect.left;
        const charY = rect.top + rect.height / 2 - containerRect.top;

        const dx = charX - clickX;
        const dy = charY - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const speed = 1.3;
        const delay = dist / (speed * 1000);

        const len = dist || 1;
        const nx = dx / len;
        const ny = dy / len;

        const maxPush = 35;
        const force = Math.max(0, 1 - dist / 750);
        const tx = nx * maxPush * force;
        const ty = ny * maxPush * force;
        const skewVal = nx * 25 * force;

        gsap.killTweensOf(charEl);
        gsap.fromTo(charEl,
          { x: 0, y: 0, skewX: 0, scale: 1 },
          {
            x: tx,
            y: ty,
            skewX: skewVal,
            scale: 1.15,
            duration: 0.15,
            delay: delay,
            ease: 'power1.out',
            onComplete: () => {
              gsap.to(charEl, {
                x: 0,
                y: 0,
                skewX: 0,
                scale: 1,
                duration: 0.55,
                ease: 'back.out(1.8)'
              });
            }
          }
        );
      });
    } else if (empVariant === 'B') {
      const symbols = ['#', '@', '%', '&', '*', '$', '!', '?', '<', '>', '{', '}', '0', '1', 'X', 'Y', 'Z'];
      charEls.forEach((charEl) => {
        const rect = charEl.getBoundingClientRect();
        const charX = rect.left + rect.width / 2 - containerRect.left;
        const charY = rect.top + rect.height / 2 - containerRect.top;

        const dx = charX - clickX;
        const dy = charY - clickY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const speed = 1.3;
        const delay = dist / (speed * 1000);

        const originalChar = charEl.getAttribute('data-orig') || charEl.textContent || '';
        if (!charEl.getAttribute('data-orig')) {
          charEl.setAttribute('data-orig', originalChar);
        }

        gsap.killTweensOf(charEl);
        
        const oldInterval = charEl.getAttribute('data-interval');
        if (oldInterval) {
          clearInterval(Number(oldInterval));
          charEl.removeAttribute('data-interval');
        }
        
        charEl.textContent = originalChar;
        charEl.style.color = '';

        gsap.delayedCall(delay, () => {
          let count = 0;
          const maxFlickers = 6 + Math.floor(Math.random() * 4);
          const interval = setInterval(() => {
            charEl.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            charEl.style.color = 'oklch(0.61 0.025 285.0)';
            count++;
            if (count >= maxFlickers) {
              clearInterval(interval);
              charEl.removeAttribute('data-interval');
              charEl.textContent = originalChar;
              charEl.style.color = '';
            }
          }, 45);

          charEl.setAttribute('data-interval', String(interval));
        });
      });
    } else if (empVariant === 'C') {
      const disp = document.getElementById('emp-displacement-map');
      const turb = document.getElementById('emp-turbulence');
      const textContainers = slider.querySelectorAll('.emp-text-container');

      if (disp && turb) {
        gsap.killTweensOf(disp);
        gsap.killTweensOf(turb);

        textContainers.forEach(container => {
          container.classList.add('emp-warp-active');
        });

        gsap.fromTo(disp,
          { attr: { scale: 0 } },
          {
            attr: { scale: 80 },
            duration: 0.18,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(disp, {
                attr: { scale: 0 },
                duration: 0.65,
                ease: 'power2.inOut',
                onComplete: () => {
                  textContainers.forEach(container => {
                    container.classList.remove('emp-warp-active');
                  });
                }
              });
            }
          }
        );

        gsap.fromTo(turb,
          { attr: { baseFrequency: "0.01 0.08" } },
          {
            attr: { baseFrequency: "0.09 0.28" },
            duration: 0.8,
            ease: 'sine.inOut'
          }
        );
      }
    }
  };

  const handleSliderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isModalOpen) return;

    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('a')) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const normX = clickX / rect.width;
    const normY = clickY / rect.height;

    const newRipple: Ripple = {
      x: normX,
      y: normY,
      radius: 0.0,
      maxRadius: 0.55 + Math.random() * 0.15,
      intensity: 1.0,
      speed: 0.38
    };

    ripplesRef.current.push(newRipple);
    if (ripplesRef.current.length > 8) {
      ripplesRef.current.shift();
    }

    const canvas = canvasRef.current;
    if (canvas) {
      gsap.fromTo(canvas,
        { x: () => (Math.random() - 0.5) * 8, y: () => (Math.random() - 0.5) * 8 },
        { x: 0, y: 0, duration: 0.12, ease: 'rough', clearProps: 'x,y' }
      );
    }

    setRippleTrigger(prev => prev + 1);

    // Trigger selected text EMP wave propagation
    triggerTextEMP(clickX, clickY, rect);
  };

  useEffect(() => {
    if (ripplesRef.current.length === 0) return;

    let animationId: number;
    const runFrame = () => {
      const activeRipples = ripplesRef.current;
      for (let i = 0; i < activeRipples.length; i++) {
        const ripple = activeRipples[i];
        ripple.radius += ripple.speed * 0.016;
        ripple.intensity = Math.max(0, 1.0 - (ripple.radius / ripple.maxRadius));
      }
      ripplesRef.current = activeRipples.filter(r => r.radius < r.maxRadius && r.intensity > 0);

      const progress = transitionRef.current.active ? fadeProgress : 0;
      const prevIdx = transitionRef.current.active ? prevIndex : activeIndex;
      if (webglSupported) {
        drawWebGL(prevIdx, activeIndex, progress);
      }

      if (ripplesRef.current.length > 0) {
        animationId = requestAnimationFrame(runFrame);
      } else {
        if (webglSupported) {
          drawWebGL(activeIndex, activeIndex, 0);
        }
      }
    };

    animationId = requestAnimationFrame(runFrame);
    return () => cancelAnimationFrame(animationId);
  }, [rippleTrigger, activeIndex, prevIndex, fadeProgress, webglSupported]);

  useEffect(() => {
    if (isModalOpen) {
      closeBtnRef.current?.focus();
      
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsModalOpen(false);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (isModalOpen && modalVideoRef.current) {
      setIsModalPlaying(true);
      modalVideoRef.current.play().catch(e => {
        console.log("Autoplay blocked", e);
        setIsModalPlaying(false);
      });
    }
  }, [isModalOpen, activeIndex]);

  const togglePlayPause = () => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play().catch(e => console.log("Play failed", e));
      } else {
        modalVideoRef.current.pause();
      }
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  const activeGame = gamesData[activeIndex];

  return (
    <div className="w-full relative">
      {/* SVG filter definition for Option C */}
      <svg className="absolute w-0 h-0 pointer-events-none" style={{ visibility: 'hidden' }}>
        <defs>
          <filter id="emp-refract" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence 
              id="emp-turbulence"
              type="fractalNoise" 
              baseFrequency="0.01 0.08" 
              numOctaves="2" 
              result="noise" 
            />
            <feDisplacementMap 
              id="emp-displacement-map"
              in="SourceGraphic" 
              in2="noise" 
              scale="0" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>

      <style>{`
        .emp-warp-active {
          filter: url(#emp-refract);
        }
        @keyframes crt-flicker {
          0% { opacity: 0.98; }
          50% { opacity: 1; }
          100% { opacity: 0.99; }
        }
        @keyframes crt-scanlines {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-crt-flicker {
          animation: crt-flicker 0.15s infinite;
        }
        .animate-crt-scanlines {
          animation: crt-scanlines 6s linear infinite;
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out forwards;
        }
      `}</style>

      {/* Slider Viewport Container */}
      <div 
        ref={sliderRef}
        onMouseMove={handleMouseMove}
        onClick={handleSliderClick}
        onMouseEnter={() => setCursorHovered(true)}
        onMouseLeave={() => setCursorHovered(false)}
        className={`relative w-full h-[500px] md:h-[600px] bg-carbon-black border border-graphite-light rounded-2xl overflow-hidden flex flex-col justify-end p-8 md:p-12 select-none slider-glow ${isModalOpen ? 'cursor-default' : 'cursor-none'}`}
      >
        {/* Loading Indicator */}
        {loading && (
          <div className="absolute inset-0 bg-[#181818] z-50 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 rounded-full border-2 border-graphite-light border-t-platinum-silver animate-spin" />
            <span className="text-[10px] font-mono tracking-widest text-slate-violet-light animate-pulse">
              INITIALIZING WEBGL SHADERS & TEXTURES...
            </span>
          </div>
        )}

        {/* WebGL Canvas */}
        {webglSupported ? (
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={gamesData[prevIndex].image} 
              alt={gamesData[prevIndex].title}
              className="absolute inset-0 w-full h-full object-cover" 
              style={{ 
                opacity: 1 - fadeProgress, 
                filter: `blur(${fadeProgress * 10}px)`
              }} 
            />
            <img 
              src={gamesData[activeIndex].image} 
              alt={gamesData[activeIndex].title}
              className="absolute inset-0 w-full h-full object-cover" 
              style={{ 
                opacity: fadeProgress, 
                filter: `blur(${(1 - fadeProgress) * 10}px)`
              }} 
            />
          </div>
        )}

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-carbon-black via-carbon-black/45 to-carbon-black/50 z-10 pointer-events-none" />

        {/* Tech Target Reticle Cursor */}
        <div 
          ref={customCursorRef}
          className="absolute pointer-events-none z-40 hidden md:flex items-center justify-center"
          style={{ 
            top: 0,
            left: 0,
            opacity: (cursorHovered && !isModalOpen) ? 1 : 0,
            transform: `translate3d(0px, 0px, 0) translate(-50%, -50%)`,
            scale: cursorHovered ? '1' : '0.2',
            transition: 'opacity 0.2s ease, scale 0.2s ease'
          }}
        >
          <div className="relative w-16 h-16 flex items-center justify-center">
            <div 
              className="absolute w-10 h-10 rounded-full border border-slate-violet-light/95"
              style={{ boxShadow: `0 0 10px rgba(168, 85, 247, 0.7)` }}
            />
            <div className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-slate-violet-light/90" />
            <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-slate-violet-light/90" />
            <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-slate-violet-light/90" />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-slate-violet-light/90" />

            <div className="absolute w-[8px] h-[1.5px] bg-slate-violet-light/95 -translate-x-6" />
            <div className="absolute w-[8px] h-[1.5px] bg-slate-violet-light/95 translate-x-6" />
            <div className="absolute h-[8px] w-[1.5px] bg-slate-violet-light/95 -translate-y-6" />
            <div className="absolute h-[8px] w-[1.5px] bg-slate-violet-light/95 translate-y-6" />

            <div className="absolute w-1.5 h-1.5 rounded-full bg-bright-snow shadow-[0_0_6px_#ffffff]" />

            <span className="absolute top-11 font-mono text-[7px] bg-carbon-black/95 px-2 py-0.5 border border-slate-violet-light/30 rounded text-bright-snow tracking-widest whitespace-nowrap">
              EMP TRIGGER // CLICK VIEWPORT
            </span>
          </div>
        </div>

        {/* HUD Text Content */}
        <div className="relative z-20 max-w-lg pointer-events-none">
          <span className="slider-hud-element text-[9px] font-mono text-platinum-silver tracking-widest uppercase inline-flex items-center gap-1.5 mb-3.5 px-2 py-0.5 bg-graphite/50 border border-graphite-light/40 rounded-md">
            <span className="w-1 h-1 bg-platinum-silver rounded-full animate-ping" />
            FEATURED RELEASE
          </span>
          
          <h3 className="slider-hud-element emp-text-container text-4xl md:text-6xl font-normal text-bright-snow uppercase tracking-wider mb-4 leading-none font-russo-one retro-heading-shadow">
            <EmpText text={activeGame.title} />
          </h3>
          
          <p className="slider-hud-element emp-text-container text-xs md:text-sm text-alabaster-grey leading-relaxed mb-6 font-outfit font-light">
            <EmpText text={activeGame.description} />
          </p>

          {/* Specs Panel */}
          <div className="slider-hud-element font-mono text-[9px] text-alabaster-grey/85 border border-graphite-light/60 bg-carbon-black-2/95 p-4 rounded-xl space-y-1.5 mt-4 mb-6 max-w-[280px] relative backdrop-blur-md shadow-lg">
            <div className="flex justify-between">
              <span>Engine:</span>
              <span className="text-platinum-silver font-bold">{activeGame.stats.engine}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Downloads:</span>
              <span className="text-platinum-silver font-bold">{activeGame.stats.downloads}</span>
            </div>
            <div className="flex justify-between">
              <span>Active Players:</span>
              <span className="text-platinum-silver font-bold">{activeGame.stats.activePlayers}</span>
            </div>
            <div className="flex justify-between">
              <span>Rating:</span>
              <span className="text-muted-green font-bold">{activeGame.stats.rating} ★</span>
            </div>
          </div>

          <div className="slider-hud-element pointer-events-auto flex flex-wrap items-center gap-4">
            {activeGame.videoSrc && (
              <button 
                onClick={() => {
                  setIsModalMuted(false);
                  setIsModalOpen(true);
                  setIsModalPlaying(true);
                }}
                className="inset-pixel-btn-primary group/btn inline-flex items-center py-2 px-4 cursor-pointer"
              >
                <Play size={10} className="mr-2 fill-current" /> GAMEPLAY PREVIEW <ArrowRight size={10} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            )}

            <div className="flex items-center gap-2">
              {activeGame.appstoreLink && (
                <a 
                  href={activeGame.appstoreLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-carbon-black/80 border border-graphite-light/60 hover:border-platinum-silver/80 rounded-md text-alabaster-grey hover:text-bright-snow transition-all hover:scale-105"
                  title="Download on the App Store"
                >
                  <AppStoreIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {activeGame.playstoreLink && (
                <a 
                  href={activeGame.playstoreLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-carbon-black/80 border border-graphite-light/60 hover:border-platinum-silver/80 rounded-md text-alabaster-grey hover:text-bright-snow transition-all hover:scale-105"
                  title="Get it on Google Play"
                >
                  <PlayStoreIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Side Controls Indicators */}
        <div className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-20 pointer-events-auto">
          {gamesData.map((game, idx) => (
            <button
              key={game.id}
              onClick={() => transitionTo(idx)}
              className="group relative flex items-center justify-center w-12 h-12 rounded-full focus:outline-none cursor-pointer"
            >
              <span className="absolute right-full mr-4 bg-carbon-black border border-graphite-light px-3 py-1.5 rounded-lg text-[8px] font-sans text-alabaster-grey uppercase tracking-widest opacity-0 scale-75 origin-right transition-all group-hover:opacity-100 group-hover:scale-100 shadow-lg pointer-events-none">
                {game.title}
              </span>
              
              <span className={`text-[10px] font-sans ${
                activeIndex === idx ? 'text-bright-snow scale-125' : 'text-alabaster-grey group-hover:text-bright-snow transition-colors'
              }`}>
                0{idx + 1}
              </span>

              <span className={`absolute bottom-0 right-0 w-full h-full rounded-full border transition-all ${
                activeIndex === idx 
                  ? 'border-platinum-silver scale-110' 
                  : 'scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-95 border-graphite-light'
              }`} 
              />
            </button>
          ))}
        </div>

        {/* Modal Gameplay Overlay */}
        {isModalOpen && (
          <div
            onClick={handleBackdropClick}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn cursor-default select-none"
            role="dialog"
            aria-modal="true"
            aria-label={`Gameplay Preview - ${activeGame.title}`}
          >
            <div className="relative w-full max-w-2xl aspect-video bg-carbon-black border border-graphite-light rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(109,109,128,0.35)] z-30 flex flex-col justify-between p-5 pointer-events-auto">
              <div className="flex items-center justify-between border-b border-graphite-light/50 pb-3 mb-3">
                <span className="text-xs font-mono text-bright-snow tracking-wider uppercase flex items-center gap-2 select-none">
                  <Cpu size={14} className="text-slate-violet-light animate-spin" />
                  GAMEPLAY PREVIEW: {activeGame.title}
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsModalMuted(!isModalMuted)}
                    className="p-1.5 bg-graphite hover:bg-graphite-light border border-graphite-light hover:border-slate-violet-light/50 rounded-lg text-alabaster-grey hover:text-bright-snow transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-slate-violet-light focus-visible:outline-none"
                    title={isModalMuted ? "Unmute Audio" : "Mute Audio"}
                  >
                    {isModalMuted ? <VolumeX size={14} /> : <Volume2 size={14} className="text-slate-violet-light animate-pulse" />}
                  </button>
                  <button
                    ref={closeBtnRef}
                    onClick={() => setIsModalOpen(false)}
                    className="p-1.5 bg-graphite hover:bg-rose-950/40 border border-graphite-light hover:border-rose-500/40 rounded-lg text-alabaster-grey hover:text-rose-400 transition-all cursor-pointer focus-visible:ring-1 focus-visible:ring-rose-500 focus-visible:outline-none"
                    title="Close Preview"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div 
                onClick={togglePlayPause}
                className="flex-1 rounded-xl border border-graphite-light overflow-hidden bg-black relative group/video cursor-pointer"
              >
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,6px_100%] opacity-20 z-10 animate-crt-flicker" />
                <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_60%,rgba(0,0,0,0.5)_100%)] opacity-60 z-10" />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-slate-violet/5 to-transparent h-[10%] w-full z-10 animate-crt-scanlines" />

                <div className="absolute bottom-3 left-3 z-20 font-mono text-[9px] bg-carbon-black/85 px-2 py-0.5 border border-graphite-light rounded text-bright-snow tracking-widest uppercase flex items-center gap-1.5 select-none pointer-events-none">
                  <span className={`w-1.5 h-1.5 rounded-full ${isModalPlaying ? 'bg-muted-green animate-pulse' : 'bg-rose-500'}`} />
                  {isModalPlaying ? 'PLAYING' : 'PAUSED'}
                </div>

                {!isModalPlaying && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 pointer-events-none">
                    <div className="w-12 h-12 rounded-full bg-carbon-black/90 border border-graphite-light flex items-center justify-center text-bright-snow shadow-lg">
                      <Play size={18} className="fill-current translate-x-0.5" />
                    </div>
                  </div>
                )}

                <video
                  ref={modalVideoRef}
                  src={activeGame.videoSrc}
                  loop
                  muted={isModalMuted}
                  playsInline
                  onPlay={() => setIsModalPlaying(true)}
                  onPause={() => setIsModalPlaying(false)}
                  className="w-full h-full object-cover filter brightness-[1.05] contrast-[1.05] transition-all duration-300 group-hover/video:brightness-110"
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-alabaster-grey/50 mt-3 uppercase tracking-wider select-none border-t border-graphite-light/50 pt-2.5">
                <span className="font-semibold text-slate-violet-light">{activeGame.subtitle}</span>
                <span>PRESS ESC, X OR CLICK OUTSIDE TO CLOSE</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
