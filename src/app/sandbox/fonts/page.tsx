'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Orbitron,
  Rajdhani,
  Share_Tech_Mono,
  Plus_Jakarta_Sans,
  Cinzel,
  Montserrat,
  Mulish,
  Russo_One,
  Silkscreen,
  Outfit,
  Geist,
  Geist_Mono
} from 'next/font/google';
import {
  ArrowRight,
  Sparkles,
  Cpu,
  Swords,
  Gamepad2,
  RefreshCw,
  Sliders,
  HelpCircle,
  FileText
} from 'lucide-react';

// Initialize the google fonts
const orbitron = Orbitron({ subsets: ['latin'], variable: '--font-orbitron' });
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['500', '600', '700'], variable: '--font-rajdhani' });
const shareTechMono = Share_Tech_Mono({ subsets: ['latin'], weight: '400', variable: '--font-share-tech-mono' });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-plus-jakarta-sans' });

const cinzel = Cinzel({ subsets: ['latin'], variable: '--font-cinzel' });
const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' });
const mulish = Mulish({ subsets: ['latin'], variable: '--font-mulish' });

const russoOne = Russo_One({ subsets: ['latin'], weight: '400', variable: '--font-russo-one' });
const silkscreen = Silkscreen({ subsets: ['latin'], weight: '400', variable: '--font-silkscreen' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' });

// Load all font classes
const fontsClass = `${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable} ${plusJakartaSans.variable} ${cinzel.variable} ${montserrat.variable} ${mulish.variable} ${russoOne.variable} ${silkscreen.variable} ${outfit.variable} ${geistSans.variable} ${geistMono.variable}`;

type TypographySystem = 'geist' | 'neon' | 'mythic' | 'retro';

export default function FontsSandbox() {
  const [selectedSystem, setSelectedSystem] = useState<TypographySystem>('neon');
  const [glowIntensity, setGlowIntensity] = useState<number>(3); // 1-5 scale
  const [trackingOffset, setTrackingOffset] = useState<string>('normal'); // tight, normal, wide, ultra-wide
  const [customHeadingText, setCustomHeadingText] = useState<string>('DASI GAMES');

  // Specs for each system
  const systemsInfo = {
    geist: {
      name: 'Default Geist System',
      description: 'The current default modern clean tech sans-serif style.',
      displayFont: 'Geist Sans (Sans)',
      uiFont: 'Geist Mono (Mono)',
      bodyFont: 'Geist Sans (Sans)',
      colorAccent: 'text-dasi-steel-300',
      borderStyle: 'border-white/10 rounded-lg',
      bgCard: 'bg-dasi-black-900/60',
    },
    neon: {
      name: 'Neon Overdrive (Cyberpunk/Sci-Fi)',
      description: 'Designed for high-tech, futuristic, cybernetic, and digital themes. High-energy, sharp geometric shapes with tech console accents.',
      displayFont: 'Orbitron (Google Font)',
      uiFont: 'Share Tech Mono (Google Font)',
      bodyFont: 'Plus Jakarta Sans (Google Font)',
      colorAccent: 'text-dasi-alice-400',
      borderStyle: 'border-dasi-alice-500/20 rounded-none border-l-4 border-r-0',
      bgCard: 'bg-dasi-ink-950/80',
    },
    mythic: {
      name: 'Mythic Legend (Epic RPG/Fantasy)',
      description: 'Designed for narrative-driven RPGs, historic adventure, and epic fantasy. Timeless serif headers evoke high-end craft and ancient lore.',
      displayFont: 'Cinzel (Google Font)',
      uiFont: 'Montserrat (Google Font)',
      bodyFont: 'Mulish (Google Font)',
      colorAccent: 'text-amber-200/90',
      borderStyle: 'border-amber-500/10 rounded-sm border-double border-2',
      bgCard: 'bg-gradient-to-br from-dasi-black-950 to-dasi-ink-900',
    },
    retro: {
      name: 'Retro Arcade (Arcade/Tycoon)',
      description: 'Designed for hybrid arcade titles and management tycoon simulation. Chunky retro headers with pixel accent widgets capture 8-bit/16-bit nostalgia.',
      displayFont: 'Russo One (Google Font)',
      uiFont: 'Silkscreen (Google Font)',
      bodyFont: 'Outfit (Google Font)',
      colorAccent: 'text-cyan-400',
      borderStyle: 'border-white/20 rounded-2xl border-4',
      bgCard: 'bg-[#0f1b2f]',
    },
  };

  // Helper classes mapping based on active system
  const getDisplayFontClass = () => {
    switch (selectedSystem) {
      case 'neon': return 'font-orbitron';
      case 'mythic': return 'font-cinzel font-medium';
      case 'retro': return 'font-russo-one';
      default: return 'font-geist-sans font-black';
    }
  };

  const getUiFontClass = () => {
    switch (selectedSystem) {
      case 'neon': return 'font-share-tech-mono uppercase tracking-widest';
      case 'mythic': return 'font-montserrat uppercase tracking-wider font-bold';
      case 'retro': return 'font-silkscreen uppercase tracking-tight';
      default: return 'font-geist-mono uppercase tracking-wider';
    }
  };

  const getBodyFontClass = () => {
    switch (selectedSystem) {
      case 'neon': return 'font-plus-jakarta-sans';
      case 'mythic': return 'font-mulish';
      case 'retro': return 'font-outfit';
      default: return 'font-geist-sans';
    }
  };

  // Custom text shadows based on theme & glow slider
  const getHeadingShadow = () => {
    if (selectedSystem === 'geist') return {};
    
    const glowOpacities = [0.05, 0.15, 0.3, 0.5, 0.7];
    const op = glowOpacities[glowIntensity - 1];
    
    if (selectedSystem === 'neon') {
      const color = `rgba(98, 144, 157, ${op})`;
      const colorAlt = `rgba(98, 144, 157, ${op * 0.5})`;
      return {
        textShadow: `0 0 8px ${color}, 0 0 20px ${colorAlt}`,
      };
    }
    
    if (selectedSystem === 'mythic') {
      const color = `rgba(251, 191, 36, ${op * 0.4})`;
      return {
        textShadow: `0 2px 4px rgba(0,0,0,0.8), 0 0 12px ${color}`,
      };
    }
    
    if (selectedSystem === 'retro') {
      // 3D blocky text offset
      return {
        textShadow: `3px 3px 0px rgba(31, 61, 122, 0.9), 5px 5px 0px rgba(7, 14, 29, 0.8)`,
      };
    }
    
    return {};
  };

  // Letter spacing classes
  const getTrackingClass = () => {
    if (trackingOffset !== 'normal') {
      if (trackingOffset === 'tight') return 'tracking-tight';
      if (trackingOffset === 'wide') return 'tracking-widest';
      if (trackingOffset === 'ultra-wide') return 'tracking-[0.25em]';
    }
    
    switch (selectedSystem) {
      case 'neon': return 'tracking-wider';
      case 'mythic': return 'tracking-[0.2em]';
      case 'retro': return 'tracking-normal';
      default: return 'tracking-wide';
    }
  };

  return (
    <div className={`min-h-screen bg-dasi-black-950 text-dasi-black-50 p-6 md:p-12 ${fontsClass}`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-dasi-alice-400 font-geist-mono uppercase mb-1">
              <span>•</span> Studio UI Sandbox
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-geist-sans">Typography Upgrade Environment</h1>
            <p className="text-sm text-dasi-steel-400 mt-1 font-geist-sans max-w-xl">
              Compare 3 custom-crafted gameified font pairings for Dasi Games. Use the controls below to preview layouts live.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/"
              className="px-4 py-2 border border-white/10 hover:border-white/20 rounded-lg text-xs font-semibold font-geist-sans transition-colors"
            >
              Back to Home
            </Link>
            <a
              href="#report-summary"
              className="px-4 py-2 bg-dasi-black-500 hover:bg-dasi-black-600 text-white rounded-lg text-xs font-semibold font-geist-sans transition-all flex items-center gap-1.5"
            >
              <FileText size={14} />
              View Design Spec
            </a>
          </div>
        </div>

        {/* Global Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-dasi-black-900 border border-white/5 rounded-2xl p-6 flex flex-col gap-6 font-geist-sans">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Sliders className="text-dasi-alice-400" size={16} />
              <h2 className="text-sm font-bold uppercase tracking-wider">Theme Controls</h2>
            </div>

            {/* System Selectors */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-dasi-steel-500 uppercase tracking-widest font-geist-mono">Choose System</span>
              <button
                onClick={() => setSelectedSystem('neon')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selectedSystem === 'neon'
                    ? 'border-dasi-alice-400 bg-dasi-alice-950/30 text-white shadow-lg'
                    : 'border-white/5 bg-transparent text-dasi-steel-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <Cpu size={18} className={selectedSystem === 'neon' ? 'text-dasi-alice-400' : ''} />
                <div>
                  <div className="text-xs font-bold">Neon Overdrive</div>
                  <div className="text-[10px] opacity-75">Futuristic & Cyberpunk</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedSystem('mythic')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selectedSystem === 'mythic'
                    ? 'border-amber-500/50 bg-amber-950/20 text-white shadow-lg'
                    : 'border-white/5 bg-transparent text-dasi-steel-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <Swords size={18} className={selectedSystem === 'mythic' ? 'text-amber-400' : ''} />
                <div>
                  <div className="text-xs font-bold">Mythic Legend</div>
                  <div className="text-[10px] opacity-75">Epic Cinematic RPG</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedSystem('retro')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selectedSystem === 'retro'
                    ? 'border-cyan-400/50 bg-cyan-950/20 text-white shadow-lg'
                    : 'border-white/5 bg-transparent text-dasi-steel-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <Gamepad2 size={18} className={selectedSystem === 'retro' ? 'text-cyan-400' : ''} />
                <div>
                  <div className="text-xs font-bold">Retro Arcade</div>
                  <div className="text-[10px] opacity-75">Arcade & Tycoon</div>
                </div>
              </button>

              <button
                onClick={() => setSelectedSystem('geist')}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selectedSystem === 'geist'
                    ? 'border-white/30 bg-white/5 text-white'
                    : 'border-white/5 bg-transparent text-dasi-steel-400 hover:border-white/10'
                }`}
              >
                <RefreshCw size={14} />
                <div>
                  <div className="text-xs font-bold">Default Geist</div>
                  <div className="text-[10px] opacity-75">Original Sandbox</div>
                </div>
              </button>
            </div>

            {/* Custom Heading Input */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-dasi-steel-500 uppercase tracking-widest font-geist-mono">Sandbox Text Input</label>
              <input
                type="text"
                value={customHeadingText}
                onChange={(e) => setCustomHeadingText(e.target.value.toUpperCase())}
                className="w-full bg-dasi-black-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-dasi-alice-400 font-geist-mono"
                placeholder="TYPE HEADING TEXT..."
              />
            </div>

            {/* Tracking slider */}
            <div className="flex flex-col gap-2">
              <label className="text-[11px] font-semibold text-dasi-steel-500 uppercase tracking-widest font-geist-mono flex justify-between">
                <span>Letter Spacing</span>
                <span className="text-dasi-alice-400 font-bold">{trackingOffset}</span>
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(['tight', 'normal', 'wide', 'ultra-wide'] as const).map((space) => (
                  <button
                    key={space}
                    onClick={() => setTrackingOffset(space)}
                    className={`text-[9px] font-bold p-1.5 border rounded-md uppercase transition-all font-geist-mono ${
                      trackingOffset === space
                        ? 'border-dasi-alice-400 bg-dasi-alice-950/20 text-white'
                        : 'border-white/5 bg-transparent text-dasi-steel-400 hover:border-white/10'
                    }`}
                  >
                    {space.replace('-', '\n')}
                  </button>
                ))}
              </div>
            </div>

            {/* Glow/3D Offset Strength */}
            {selectedSystem !== 'geist' && (
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px] font-semibold text-dasi-steel-500 uppercase tracking-widest font-geist-mono">
                  <span>{selectedSystem === 'retro' ? '3D Offset' : 'Glow Intensity'}</span>
                  <span className="text-dasi-alice-400 font-bold">{glowIntensity}/5</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={glowIntensity}
                  onChange={(e) => setGlowIntensity(parseInt(e.target.value))}
                  className="w-full accent-dasi-alice-400 cursor-pointer h-1.5 bg-dasi-black-950 rounded-lg appearance-none"
                />
              </div>
            )}

            {/* active font specs summary */}
            <div className="mt-auto pt-4 border-t border-white/5 text-[10px] text-dasi-steel-400 font-geist-mono flex flex-col gap-2">
              <div className="text-[11px] font-semibold text-dasi-steel-500 uppercase tracking-widest">Active Font Pairings</div>
              <div><strong className="text-white">Headers:</strong> {systemsInfo[selectedSystem].displayFont}</div>
              <div><strong className="text-white">UI Accents:</strong> {systemsInfo[selectedSystem].uiFont}</div>
              <div><strong className="text-white">Body Text:</strong> {systemsInfo[selectedSystem].bodyFont}</div>
            </div>

          </div>

          {/* Sandbox Live Preview Container */}
          <div className="lg:col-span-3 bg-dasi-black-900 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden">
            {/* Grid graphic background for retro/cyberpunk */}
            {selectedSystem === 'retro' && (
              <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0" />
            )}
            {selectedSystem === 'neon' && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(98,144,157,0.08)_0%,transparent_50%)] pointer-events-none z-0" />
            )}

            <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 font-geist-sans">
              <span className="text-[10px] font-bold tracking-widest font-geist-mono text-dasi-steel-500 uppercase flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live Preview (Dasi Games Branding Demo)
              </span>
              <span className="text-xs text-dasi-alice-400 font-geist-mono">System: {systemsInfo[selectedSystem].name.split(' (')[0]}</span>
            </div>

            {/* MOCK HERO PREVIEW */}
            <div className="flex flex-col items-start gap-4 py-4 relative z-10">
              {/* UI Accent Alert */}
              <div className={`px-3 py-1 text-xs font-semibold ${getUiFontClass()} ${systemsInfo[selectedSystem].colorAccent} ${systemsInfo[selectedSystem].borderStyle} bg-white/5 flex items-center gap-2`}>
                <Sparkles size={12} className="animate-pulse" />
                <span>[GAMEPLAY PREVIEW AVAILABLE • VER 1.0.4]</span>
              </div>

              {/* Title display */}
              <h2
                className={`${getDisplayFontClass()} ${getTrackingClass()} text-5xl md:text-7xl font-extrabold text-white leading-none break-all`}
                style={getHeadingShadow()}
              >
                {customHeadingText}
              </h2>

              {/* Subheading tagline */}
              <h3 className={`${getUiFontClass()} ${systemsInfo[selectedSystem].colorAccent} text-sm md:text-lg font-bold tracking-widest mt-1`}>
                Crafting unique gaming experiences
              </h3>

              {/* Description Body Paragraph */}
              <p className={`${getBodyFontClass()} text-sm md:text-base text-dasi-steel-400 max-w-2xl leading-relaxed mt-2`}>
                Dasi Games bridges art, logic, and high performance to build addictive mobile, hybrid arcade RPG, and tycoon titles. Partner with us for cutting-edge game development and premium art outsourcing solutions.
              </p>

              {/* Button CTA */}
              <div className="mt-4 flex flex-wrap gap-4">
                <button className={`flex items-center gap-2.5 px-6 py-3 bg-dasi-black-500 hover:bg-dasi-black-600 text-white font-bold tracking-wider text-xs uppercase ${selectedSystem === 'retro' ? 'rounded-none border-b-4 border-r-4 border-black/30' : 'rounded-lg'} transition-all shadow-lg`}>
                  <span className={getUiFontClass()}>LET&apos;S TALK</span>
                  <ArrowRight size={14} />
                </button>
                <button className={`flex items-center gap-2 px-6 py-3 border border-white/10 hover:border-white/20 text-dasi-steel-300 hover:text-white text-xs ${selectedSystem === 'retro' ? 'rounded-none' : 'rounded-lg'} transition-all`}>
                  <span className={getUiFontClass()}>View Games</span>
                </button>
              </div>
            </div>

            {/* MOCK LAYOUT ELEMENTS COMPONENT: GAMES & STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5 relative z-10">
              
              {/* Stat Card 1 */}
              <div className={`p-5 ${systemsInfo[selectedSystem].bgCard} border ${systemsInfo[selectedSystem].borderStyle} flex flex-col gap-2`}>
                <span className={`${getUiFontClass()} text-[10px] text-dasi-steel-500 font-bold`}>STUDIO_SCALE</span>
                <div className="flex items-baseline gap-1">
                  <span className={`${getDisplayFontClass()} text-3xl font-bold text-white`}>100</span>
                  <span className={`${getUiFontClass()} text-lg ${systemsInfo[selectedSystem].colorAccent} font-bold`}>+</span>
                </div>
                <p className={`${getBodyFontClass()} text-xs text-dasi-steel-400 leading-normal`}>
                  Premium game assets, scripts, and mobile titles deployed globally.
                </p>
              </div>

              {/* Stat Card 2 */}
              <div className={`p-5 ${systemsInfo[selectedSystem].bgCard} border ${systemsInfo[selectedSystem].borderStyle} flex flex-col gap-2`}>
                <span className={`${getUiFontClass()} text-[10px] text-dasi-steel-500 font-bold`}>FOUNDING_YEAR</span>
                <div className="flex items-baseline gap-1">
                  <span className={`${getDisplayFontClass()} text-3xl font-bold text-white`}>2021</span>
                </div>
                <p className={`${getBodyFontClass()} text-xs text-dasi-steel-400 leading-normal`}>
                  Established in Tbilisi, Georgia, with a global team of developers.
                </p>
              </div>

              {/* Game Item Card Mock */}
              <div className={`p-5 ${systemsInfo[selectedSystem].bgCard} border ${systemsInfo[selectedSystem].borderStyle} flex flex-col justify-between h-full`}>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-2 py-0.5 bg-dasi-black-950 border border-white/5 text-[9px] text-dasi-alice-400 font-bold ${getUiFontClass()}`}>
                      ARCADE RPG
                    </span>
                    <span className={`${getUiFontClass()} text-[9px] text-dasi-steel-500`}>[LIVE]</span>
                  </div>
                  <h4 className={`${getDisplayFontClass()} text-lg font-bold text-white mb-1.5`}>
                    LUMBER CHOPPER
                  </h4>
                  <p className={`${getBodyFontClass()} text-xs text-dasi-steel-400 leading-normal`}>
                    Chop trees, upgrade axes, and combat pixel slimes in an arcade simulator.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                  <span className={`${getUiFontClass()} text-[10px] text-dasi-steel-500`}>1.2M DOWNLOADS</span>
                  <span className={`${getUiFontClass()} text-[10px] ${systemsInfo[selectedSystem].colorAccent} font-bold flex items-center gap-1 hover:translate-x-1 transition-transform cursor-pointer`}>
                    PLAY <ArrowRight size={10} />
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* Detailed Spec / Design Guidelines Section */}
        <div id="report-summary" className="bg-dasi-black-900 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-6 font-geist-sans">
          <div className="flex items-center gap-2 border-b border-white/5 pb-4">
            <HelpCircle className="text-dasi-alice-400" size={18} />
            <h2 className="text-base font-bold uppercase tracking-wider">Design System Rationale & Setup Guide</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm leading-relaxed">
            
            {/* System 1 specs */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-dasi-alice-400 font-orbitron font-bold text-sm">
                <div className="w-1.5 h-1.5 bg-dasi-alice-400 rounded-none animate-pulse" />
                01. NEON OVERDRIVE
              </div>
              <p className="text-xs text-dasi-steel-400">
                Ideal for modern gaming hubs with high-tech themes. The sharp, geometric letters of <strong>Orbitron</strong> command attention like in-game combat HUD overlays. <strong>Share Tech Mono</strong> completes the experience by making numbers and tags look like a terminal readout.
              </p>
              <div className="bg-dasi-black-950 p-3 rounded-lg border border-white/5 font-geist-mono text-xs flex flex-col gap-1 text-dasi-steel-400">
                <span className="text-[10px] text-dasi-steel-500 font-bold uppercase">Tailwind Setup Config:</span>
                <code>--font-display: var(--font-orbitron);</code>
                <code>--font-ui: var(--font-share-tech-mono);</code>
                <code>--font-body: var(--font-plus-jakarta-sans);</code>
              </div>
            </div>

            {/* System 2 specs */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-200/90 font-cinzel font-semibold text-sm">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                02. MYTHIC LEGEND
              </div>
              <p className="text-xs text-dasi-steel-400">
                Best suited for fantasy narrative-driven titles and grand RPGs. <strong>Cinzel</strong> reflects stone carvings and roman script heritage. Paired with <strong>Mulish</strong>, it forms a readable, premium structure with high vertical space, conveying an elite, craftsman-like studio presence.
              </p>
              <div className="bg-dasi-black-950 p-3 rounded-lg border border-white/5 font-geist-mono text-xs flex flex-col gap-1 text-dasi-steel-400">
                <span className="text-[10px] text-dasi-steel-500 font-bold uppercase">Tailwind Setup Config:</span>
                <code>--font-display: var(--font-cinzel);</code>
                <code>--font-ui: var(--font-montserrat);</code>
                <code>--font-body: var(--font-mulish);</code>
              </div>
            </div>

            {/* System 3 specs */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-cyan-400 font-russo-one text-sm">
                <div className="w-1.5 h-1.5 bg-cyan-400 transform rotate-45" />
                03. RETRO ARCADE
              </div>
              <p className="text-xs text-dasi-steel-400">
                Evokes nostalgic pixel arcade, tycoon, and mobile arcade mechanics. The thick, blocky strokes of <strong>Russo One</strong> provide instant retro gaming punch, and <strong>Silkscreen</strong> provides the pixel-perfect 8-bit console overlay, rendering numbers and status indicators beautifully.
              </p>
              <div className="bg-dasi-black-950 p-3 rounded-lg border border-white/5 font-geist-mono text-xs flex flex-col gap-1 text-dasi-steel-400">
                <span className="text-[10px] text-dasi-steel-500 font-bold uppercase">Tailwind Setup Config:</span>
                <code>--font-display: var(--font-russo-one);</code>
                <code>--font-ui: var(--font-silkscreen);</code>
                <code>--font-body: var(--font-outfit);</code>
              </div>
            </div>

          </div>

          <div className="mt-4 p-4 bg-dasi-black-950 rounded-xl border border-white/5">
            <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-white">How to Activate a System Globals-Wide:</h4>
            <ol className="list-decimal list-inside text-xs text-dasi-steel-400 flex flex-col gap-2">
              <li>Open <code className="text-dasi-alice-400">src/app/layout.tsx</code> and import the selected fonts from <code className="text-white">next/font/google</code>.</li>
              <li>Instantiate the fonts with specific subsets and assign them to CSS variables (e.g. <code className="text-white">variable: &apos;--font-display&apos;</code>).</li>
              <li>Inject the class variables inside the root <code className="text-white">&lt;html&gt;</code> element in the layout.</li>
              <li>Update <code className="text-dasi-alice-400">src/app/globals.css</code> to map the Tailwind font theme tokens to the variables. e.g.:
                <pre className="bg-dasi-black-900 p-2.5 rounded-lg border border-white/5 mt-2 font-geist-mono text-[10px] text-dasi-steel-300 font-semibold">
{`@theme {
  --font-sans: var(--font-body);
  --font-display: var(--font-display);
  --font-ui: var(--font-ui);
}`}
                </pre>
              </li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
}
