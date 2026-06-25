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
  FileText,
  Copy,
  Check,
  Layers,
  ExternalLink,
  Code
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
type UiStyle = 'flat-glow' | 'inset-pixel' | 'vector-outline';

export default function FontsSandbox() {
  // Set default typography system to 'retro' and default UI style to 'inset-pixel'
  const [selectedSystem, setSelectedSystem] = useState<TypographySystem>('retro');
  const [selectedUiStyle, setSelectedUiStyle] = useState<UiStyle>('inset-pixel');
  const [glowIntensity, setGlowIntensity] = useState<number>(4); // 1-5 scale
  const [trackingOffset, setTrackingOffset] = useState<string>('wide'); // tight, normal, wide, ultra-wide
  const [customHeadingText, setCustomHeadingText] = useState<string>('DASI GAMES');
  
  // Interactive Showcase Code Box states
  const [showCodeForStyle, setShowCodeForStyle] = useState<UiStyle | null>(null);
  const [copiedTextId, setCopiedTextId] = useState<string | null>(null);

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
      // 3D blocky text offset styled to match the glow intensity slider, colored neon cyan
      const offset1 = glowIntensity;
      const offset2 = glowIntensity + 2;
      return {
        textShadow: `${offset1}px ${offset1}px 0px rgba(6, 182, 212, 0.85), ${offset2}px ${offset2}px 0px rgba(15, 23, 42, 0.95)`,
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
      case 'retro': return 'tracking-[0.15em]'; // Wide spacing for Retro Arcade by default!
      default: return 'tracking-wide';
    }
  };

  // Copy to Clipboard Utility
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTextId(id);
    setTimeout(() => setCopiedTextId(null), 2000);
  };

  // Tech Specs of the 3 custom styles (for copy-pasting)
  const tailwindCodes = {
    'flat-glow': {
      card: `<!-- Retro-Modern Flat Glow Card -->
<div className="bg-slate-950/85 border border-cyan-500/30 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.12)] hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] hover:border-cyan-400/50 transition-all duration-300 backdrop-blur-sm p-6 flex flex-col gap-2">
  {/* Content here */}
</div>`,
      primaryBtn: `<!-- Retro-Modern Flat Glow Primary Button (No shadow line) -->
<button className="relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:shadow-[0_0_15px_rgba(6,182,212,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
  LET'S TALK
</button>`,
      secondaryBtn: `<!-- Retro-Modern Flat Glow Secondary Button -->
<button className="px-6 py-3 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-bold rounded-lg transition-all duration-300">
  View Games
</button>`
    },
    'inset-pixel': {
      card: `<!-- 8-Bit Inset-Pixel Card (Completely shadow-line free, uses inset CRT glow) -->
<div className="bg-[#0b1329] border-2 border-yellow-400 rounded-none relative p-6 shadow-[inset_0_0_15px_rgba(234,179,8,0.2)] hover:shadow-[inset_0_0_25px_rgba(234,179,8,0.35)] transition-all duration-300">
  {/* 8-Bit Corner Pixel Blocks */}
  <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-yellow-400" />
  <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-yellow-400" />
  <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-yellow-400" />
  <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-yellow-400" />
  {/* Content here */}
</div>`,
      primaryBtn: `<!-- 8-Bit Inset-Pixel Button (Dimensions created via inner insets, no bottom shadow) -->
<button className="relative px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold uppercase border-2 border-black rounded-none shadow-[inset_-3px_-3px_0px_0px_rgba(202,138,4,0.75),inset_3px_3px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-[inset_-2px_-2px_0px_0px_rgba(202,138,4,0.75),inset_2px_2px_0px_0px_rgba(255,255,255,0.9)] active:shadow-[inset_3px_3px_0px_0px_rgba(202,138,4,0.75),inset_-3px_-3px_0px_0px_rgba(255,255,255,0.9)] transition-all duration-100">
  LET'S TALK
</button>`,
      secondaryBtn: `<!-- 8-Bit Inset-Pixel Secondary Button -->
<button className="px-6 py-3 bg-transparent hover:bg-yellow-400/10 text-yellow-400 font-bold uppercase border-2 border-yellow-400 rounded-none transition-all duration-300">
  View Games
</button>`
    },
    'vector-outline': {
      card: `<!-- Neon Vector Outline Card (Minimal wireframe style) -->
<div className="bg-black/95 border border-pink-500 rounded-none relative p-6 shadow-[0_0_12px_rgba(236,72,153,0.15)] hover:shadow-[0_0_22px_rgba(236,72,153,0.35)] transition-all duration-300">
  {/* Vector Corner Bracket Overlays */}
  <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-pink-500" />
  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-pink-500" />
  <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-pink-500" />
  <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-pink-500" />
  {/* Content here */}
</div>`,
      primaryBtn: `<!-- Neon Vector Outline Button (Vector line art that glows pink on hover) -->
<button className="relative px-6 py-3 border-2 border-pink-500 bg-transparent text-pink-500 font-bold tracking-widest uppercase rounded-none hover:bg-pink-500 hover:text-black hover:shadow-[0_0_15px_rgba(236,72,153,0.85)] active:scale-95 transition-all duration-200">
  LET'S TALK
</button>`,
      secondaryBtn: `<!-- Neon Vector Outline Secondary Button -->
<button className="px-6 py-3 border border-pink-500/40 hover:border-pink-500 bg-transparent text-pink-500/70 hover:text-pink-500 rounded-none transition-all duration-200">
  View Games
</button>`
    }
  };

  return (
    <div className={`min-h-screen bg-dasi-black-950 text-dasi-black-50 p-6 md:p-12 ${fontsClass}`}>
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        
        {/* Navigation & Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-dasi-alice-400 font-geist-mono uppercase mb-1">
              <span>•</span> Dasi Games Studio UI Sandbox
            </div>
            <h1 className="text-3xl font-bold tracking-tight font-geist-sans">Typography & UI Styling Sandbox</h1>
            <p className="text-sm text-dasi-steel-400 mt-1 font-geist-sans max-w-xl">
              Preview live game pairings. This version sets the primary style to <strong>Retro Arcade</strong> with wide title spacing, showcasing 3 premium button and card designs with zero heavy shadow lines.
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
              href="#ui-showcase"
              className="px-4 py-2 bg-dasi-black-500 hover:bg-dasi-black-600 text-white rounded-lg text-xs font-semibold font-geist-sans transition-all flex items-center gap-1.5"
            >
              <Layers size={14} />
              UI Style Gallery
            </a>
          </div>
        </div>

        {/* Global Controls Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Controls Panel */}
          <div className="lg:col-span-1 bg-dasi-black-900 border border-white/5 rounded-2xl p-6 flex flex-col gap-6 font-geist-sans">
            
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <Sliders className="text-dasi-alice-400" size={16} />
              <h2 className="text-sm font-bold uppercase tracking-wider">Sandbox Settings</h2>
            </div>

            {/* Typography Selector */}
            <div className="flex flex-col gap-2">
              <span className="text-[11px] font-semibold text-dasi-steel-500 uppercase tracking-widest font-geist-mono">1. Font Pairings</span>
              
              <button
                onClick={() => {
                  setSelectedSystem('retro');
                  setSelectedUiStyle('inset-pixel');
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selectedSystem === 'retro'
                    ? 'border-cyan-400/50 bg-cyan-950/20 text-white shadow-lg'
                    : 'border-white/5 bg-transparent text-dasi-steel-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <Gamepad2 size={18} className={selectedSystem === 'retro' ? 'text-cyan-400' : ''} />
                <div>
                  <div className="text-xs font-bold flex items-center gap-1">
                    Retro Arcade <span className="text-[8px] bg-cyan-400/20 text-cyan-400 px-1 rounded font-normal">Primary</span>
                  </div>
                  <div className="text-[10px] opacity-75">Chunky Russo + Silkscreen</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedSystem('neon');
                  setSelectedUiStyle('flat-glow');
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selectedSystem === 'neon'
                    ? 'border-dasi-alice-400 bg-dasi-alice-950/30 text-white shadow-lg'
                    : 'border-white/5 bg-transparent text-dasi-steel-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <Cpu size={18} className={selectedSystem === 'neon' ? 'text-dasi-alice-400' : ''} />
                <div>
                  <div className="text-xs font-bold">Neon Overdrive</div>
                  <div className="text-[10px] opacity-75">Sci-Fi Orbitron + Share Tech</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedSystem('mythic');
                  setSelectedUiStyle('flat-glow');
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selectedSystem === 'mythic'
                    ? 'border-amber-500/50 bg-amber-950/20 text-white shadow-lg'
                    : 'border-white/5 bg-transparent text-dasi-steel-400 hover:border-white/10 hover:text-white'
                }`}
              >
                <Swords size={18} className={selectedSystem === 'mythic' ? 'text-amber-400' : ''} />
                <div>
                  <div className="text-xs font-bold">Mythic Legend</div>
                  <div className="text-[10px] opacity-75">Epic RPG Cinzel + Montserrat</div>
                </div>
              </button>

              <button
                onClick={() => {
                  setSelectedSystem('geist');
                  setSelectedUiStyle('flat-glow');
                }}
                className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                  selectedSystem === 'geist'
                    ? 'border-white/30 bg-white/5 text-white'
                    : 'border-white/5 bg-transparent text-dasi-steel-400 hover:border-white/10'
                }`}
              >
                <RefreshCw size={14} />
                <div>
                  <div className="text-xs font-bold">Default Geist</div>
                  <div className="text-[10px] opacity-75">Clean Tech Sans + Mono</div>
                </div>
              </button>
            </div>

            {/* UI Styling Variation Selector (Shadow-free) */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
              <span className="text-[11px] font-semibold text-dasi-steel-500 uppercase tracking-widest font-geist-mono">2. UI Button & Card Style</span>
              
              <button
                onClick={() => setSelectedUiStyle('inset-pixel')}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${
                  selectedUiStyle === 'inset-pixel'
                    ? 'border-yellow-400 bg-yellow-400/10 text-yellow-400'
                    : 'border-white/5 bg-transparent text-dasi-steel-400 hover:border-white/10'
                }`}
              >
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-none" />
                <span className="font-semibold">8-Bit Inset-Pixel</span>
              </button>

              <button
                onClick={() => setSelectedUiStyle('flat-glow')}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${
                  selectedUiStyle === 'flat-glow'
                    ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                    : 'border-white/5 bg-transparent text-dasi-steel-400 hover:border-white/10'
                }`}
              >
                <div className="w-2.5 h-2.5 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                <span className="font-semibold">Retro-Modern Flat Glow</span>
              </button>

              <button
                onClick={() => setSelectedUiStyle('vector-outline')}
                className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-xs transition-all ${
                  selectedUiStyle === 'vector-outline'
                    ? 'border-pink-500 bg-pink-500/10 text-pink-500'
                    : 'border-white/5 bg-transparent text-dasi-steel-400 hover:border-white/10'
                }`}
              >
                <div className="w-2.5 h-2.5 border border-pink-500 bg-transparent rotate-45" />
                <span className="font-semibold">Neon Vector Outline</span>
              </button>
            </div>

            {/* Custom Heading Input */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
              <label className="text-[11px] font-semibold text-dasi-steel-500 uppercase tracking-widest font-geist-mono">3. Custom Text Input</label>
              <input
                type="text"
                value={customHeadingText}
                onChange={(e) => setCustomHeadingText(e.target.value.toUpperCase())}
                className="w-full bg-dasi-black-950 border border-white/10 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-dasi-alice-400 font-geist-mono"
                placeholder="TYPE HEADING TEXT..."
              />
            </div>

            {/* Tracking slider */}
            <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
              <label className="text-[11px] font-semibold text-dasi-steel-500 uppercase tracking-widest font-geist-mono flex justify-between">
                <span>4. Title Letter Spacing</span>
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
                    {space}
                  </button>
                ))}
              </div>
            </div>

            {/* Glow/3D Offset Strength */}
            {selectedSystem !== 'geist' && (
              <div className="flex flex-col gap-2 border-t border-white/5 pt-4">
                <div className="flex justify-between items-center text-[11px] font-semibold text-dasi-steel-500 uppercase tracking-widest font-geist-mono">
                  <span>{selectedSystem === 'retro' ? '3D Shadow Offset' : 'Glow Intensity'}</span>
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
          <div className={`lg:col-span-3 p-6 md:p-8 flex flex-col gap-8 relative overflow-hidden transition-all duration-300 ${
            selectedUiStyle === 'flat-glow'
              ? 'bg-slate-950/85 border border-cyan-500/30 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.12)]'
              : selectedUiStyle === 'inset-pixel'
              ? 'bg-[#0b1329] border-2 border-yellow-400 rounded-none shadow-[inset_0_0_20px_rgba(234,179,8,0.1)]'
              : 'bg-black/95 border border-pink-500 rounded-none shadow-[0_0_20px_rgba(236,72,153,0.18)]'
          }`}>
            {/* Grid graphic background for retro/cyberpunk themes */}
            {selectedSystem === 'retro' && (
              <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none z-0" />
            )}
            {selectedSystem === 'neon' && (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(98,144,157,0.08)_0%,transparent_50%)] pointer-events-none z-0" />
            )}

            {/* Corner Pixel Blocks for 8-Bit */}
            {selectedUiStyle === 'inset-pixel' && (
              <>
                <div className="absolute top-0 left-0 w-3.5 h-3.5 bg-yellow-400 z-20" />
                <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-yellow-400 z-20" />
                <div className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-yellow-400 z-20" />
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-yellow-400 z-20" />
              </>
            )}

            {/* Technical Brackets for Vector Outline */}
            {selectedUiStyle === 'vector-outline' && (
              <>
                <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-pink-500 z-20" />
                <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-pink-500 z-20" />
                <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-pink-500 z-20" />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-pink-500 z-20" />
              </>
            )}

            <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-4 font-geist-sans">
              <span className="text-[10px] font-bold tracking-widest font-geist-mono text-dasi-steel-500 uppercase flex items-center gap-1.5">
                <span className={`inline-block w-2 h-2 rounded-full animate-pulse ${
                  selectedUiStyle === 'flat-glow' ? 'bg-cyan-400' : selectedUiStyle === 'inset-pixel' ? 'bg-yellow-400' : 'bg-pink-500'
                }`} />
                Live Brand Preview
              </span>
              <span className="text-xs text-dasi-steel-400 font-geist-mono flex items-center gap-2">
                UI Style: <strong className={
                  selectedUiStyle === 'flat-glow' ? 'text-cyan-400' : selectedUiStyle === 'inset-pixel' ? 'text-yellow-400' : 'text-pink-500'
                }>{selectedUiStyle.toUpperCase()}</strong>
              </span>
            </div>

            {/* MOCK HERO PREVIEW */}
            <div className="flex flex-col items-start gap-4 py-4 relative z-10">
              
              {/* UI Accent Badge (Dynamic style) */}
              <div className={`
                ${getUiFontClass()} flex items-center gap-2
                ${selectedUiStyle === 'flat-glow'
                  ? 'px-3 py-1 bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 rounded-full text-xs font-semibold'
                  : selectedUiStyle === 'inset-pixel'
                  ? 'px-3 py-1 bg-yellow-950/30 border-2 border-yellow-400 text-yellow-400 rounded-none text-xs font-semibold relative'
                  : 'px-3 py-1 bg-transparent border border-pink-500 text-pink-500 rounded-none text-xs font-semibold'
                }
              `}>
                {selectedUiStyle === 'inset-pixel' && (
                  <>
                    <div className="absolute top-0 left-0 w-1 h-1 bg-yellow-400" />
                    <div className="absolute top-0 right-0 w-1 h-1 bg-yellow-400" />
                    <div className="absolute bottom-0 left-0 w-1 h-1 bg-yellow-400" />
                    <div className="absolute bottom-0 right-0 w-1 h-1 bg-yellow-400" />
                  </>
                )}
                <Sparkles size={12} className="animate-pulse" />
                <span>[GAMEPLAY PREVIEW AVAILABLE • VER 1.0.4]</span>
              </div>

              {/* Title display */}
              <h2
                className={`${getDisplayFontClass()} ${getTrackingClass()} text-5xl md:text-7xl font-extrabold text-white leading-none tracking-wide`}
                style={getHeadingShadow()}
              >
                {customHeadingText}
              </h2>

              {/* Subheading tagline */}
              <h3 className={`${getUiFontClass()} ${
                selectedUiStyle === 'flat-glow' ? 'text-cyan-400' : selectedUiStyle === 'inset-pixel' ? 'text-yellow-400' : 'text-pink-500'
              } text-sm md:text-lg font-bold tracking-widest mt-1`}>
                Crafting unique gaming experiences
              </h3>

              {/* Description Body Paragraph */}
              <p className={`${getBodyFontClass()} text-sm md:text-base text-dasi-steel-400 max-w-2xl leading-relaxed mt-2`}>
                Dasi Games bridges art, logic, and high performance to build addictive mobile, hybrid arcade RPG, and tycoon titles. Partner with us for cutting-edge game development and premium art outsourcing solutions.
              </p>

              {/* Button CTA (Using the 3 selected variations completely shadow-line free) */}
              <div className="mt-4 flex flex-wrap gap-4">
                
                {/* Primary Button */}
                {selectedUiStyle === 'flat-glow' ? (
                  <button className="relative px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold tracking-wider text-xs uppercase rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:shadow-[0_0_22px_rgba(6,182,212,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2.5">
                    <span className={getUiFontClass()}>LET&apos;S TALK</span>
                    <ArrowRight size={14} />
                  </button>
                ) : selectedUiStyle === 'inset-pixel' ? (
                  <button className="relative px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-bold tracking-wider text-xs uppercase border-2 border-black rounded-none shadow-[inset_-3px_-3px_0px_0px_rgba(202,138,4,0.75),inset_3px_3px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-[inset_-2px_-2px_0px_0px_rgba(202,138,4,0.75),inset_2px_2px_0px_0px_rgba(255,255,255,0.9)] active:shadow-[inset_3px_3px_0px_0px_rgba(202,138,4,0.75),inset_-3px_-3px_0px_0px_rgba(255,255,255,0.9)] transition-all duration-100 flex items-center gap-2.5">
                    <span className={getUiFontClass()}>LET&apos;S TALK</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button className="relative px-6 py-3 border-2 border-pink-500 bg-transparent text-pink-500 hover:bg-pink-500 hover:text-black font-bold tracking-widest text-xs uppercase rounded-none hover:shadow-[0_0_15px_rgba(236,72,153,0.85)] active:scale-95 transition-all duration-200 flex items-center gap-2.5">
                    <span className={getUiFontClass()}>LET&apos;S TALK</span>
                    <ArrowRight size={14} />
                  </button>
                )}

                {/* Secondary Button */}
                {selectedUiStyle === 'flat-glow' ? (
                  <button className="px-6 py-3 border border-cyan-500/30 hover:border-cyan-400/50 text-cyan-400 hover:bg-cyan-500/10 font-bold text-xs rounded-lg transition-all duration-300 flex items-center gap-2">
                    <span className={getUiFontClass()}>View Games</span>
                  </button>
                ) : selectedUiStyle === 'inset-pixel' ? (
                  <button className="px-6 py-3 bg-transparent hover:bg-yellow-400/10 text-yellow-400 font-bold text-xs uppercase border-2 border-yellow-400 rounded-none transition-all duration-300 flex items-center gap-2">
                    <span className={getUiFontClass()}>View Games</span>
                  </button>
                ) : (
                  <button className="px-6 py-3 border border-pink-500/40 hover:border-pink-500 bg-transparent text-pink-500/70 hover:text-pink-500 font-bold text-xs uppercase rounded-none transition-all duration-200 flex items-center gap-2">
                    <span className={getUiFontClass()}>View Games</span>
                  </button>
                )}

              </div>
            </div>

            {/* MOCK LAYOUT ELEMENTS COMPONENT: GAMES & STATS (Matching selected style) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-white/5 relative z-10">
              
              {/* Stat Card 1 */}
              <div className={`p-5 transition-all duration-300 relative ${
                selectedUiStyle === 'flat-glow'
                  ? 'bg-slate-900/60 border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.18)]'
                  : selectedUiStyle === 'inset-pixel'
                  ? 'bg-[#0f172a] border-2 border-yellow-400 rounded-none shadow-[inset_0_0_12px_rgba(234,179,8,0.15)]'
                  : 'bg-black/80 border border-pink-500 rounded-none shadow-[0_0_10px_rgba(236,72,153,0.1)]'
              }`}>
                {/* Custom Corner Decorators */}
                {selectedUiStyle === 'inset-pixel' && (
                  <>
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-yellow-400" />
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-yellow-400" />
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-yellow-400" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-yellow-400" />
                  </>
                )}
                {selectedUiStyle === 'vector-outline' && (
                  <>
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-pink-500" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-pink-500" />
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-pink-500" />
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-pink-500" />
                  </>
                )}
                <span className={`${getUiFontClass()} text-[10px] text-dasi-steel-500 font-bold`}>STUDIO_SCALE</span>
                <div className="flex items-baseline gap-1">
                  <span className={`${getDisplayFontClass()} text-3xl font-bold text-white`}>100</span>
                  <span className={`${getUiFontClass()} text-lg ${
                    selectedUiStyle === 'flat-glow' ? 'text-cyan-400' : selectedUiStyle === 'inset-pixel' ? 'text-yellow-400' : 'text-pink-500'
                  } font-bold`}>+</span>
                </div>
                <p className={`${getBodyFontClass()} text-xs text-dasi-steel-400 leading-normal`}>
                  Premium game assets, scripts, and mobile titles deployed globally.
                </p>
              </div>

              {/* Stat Card 2 */}
              <div className={`p-5 transition-all duration-300 relative ${
                selectedUiStyle === 'flat-glow'
                  ? 'bg-slate-900/60 border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.18)]'
                  : selectedUiStyle === 'inset-pixel'
                  ? 'bg-[#0f172a] border-2 border-yellow-400 rounded-none shadow-[inset_0_0_12px_rgba(234,179,8,0.15)]'
                  : 'bg-black/80 border border-pink-500 rounded-none shadow-[0_0_10px_rgba(236,72,153,0.1)]'
              }`}>
                {selectedUiStyle === 'inset-pixel' && (
                  <>
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-yellow-400" />
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-yellow-400" />
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-yellow-400" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-yellow-400" />
                  </>
                )}
                {selectedUiStyle === 'vector-outline' && (
                  <>
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-pink-500" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-pink-500" />
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-pink-500" />
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-pink-500" />
                  </>
                )}
                <span className={`${getUiFontClass()} text-[10px] text-dasi-steel-500 font-bold`}>FOUNDING_YEAR</span>
                <div className="flex items-baseline gap-1">
                  <span className={`${getDisplayFontClass()} text-3xl font-bold text-white`}>2021</span>
                </div>
                <p className={`${getBodyFontClass()} text-xs text-dasi-steel-400 leading-normal`}>
                  Established in Tbilisi, Georgia, with a global team of developers.
                </p>
              </div>

              {/* Game Item Card Mock */}
              <div className={`p-5 transition-all duration-300 relative flex flex-col justify-between h-full ${
                selectedUiStyle === 'flat-glow'
                  ? 'bg-slate-900/60 border border-cyan-500/30 rounded-xl shadow-[0_0_15px_rgba(6,182,212,0.08)] hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.18)]'
                  : selectedUiStyle === 'inset-pixel'
                  ? 'bg-[#0f172a] border-2 border-yellow-400 rounded-none shadow-[inset_0_0_12px_rgba(234,179,8,0.15)]'
                  : 'bg-black/80 border border-pink-500 rounded-none shadow-[0_0_10px_rgba(236,72,153,0.1)]'
              }`}>
                {selectedUiStyle === 'inset-pixel' && (
                  <>
                    <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-yellow-400" />
                    <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-yellow-400" />
                    <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-yellow-400" />
                    <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-yellow-400" />
                  </>
                )}
                {selectedUiStyle === 'vector-outline' && (
                  <>
                    <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-pink-500" />
                    <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-pink-500" />
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-pink-500" />
                    <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-pink-500" />
                  </>
                )}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className={`px-2 py-0.5 bg-dasi-black-950 border border-white/5 text-[9px] ${
                      selectedUiStyle === 'flat-glow' ? 'text-cyan-400' : selectedUiStyle === 'inset-pixel' ? 'text-yellow-400' : 'text-pink-500'
                    } font-bold ${getUiFontClass()}`}>
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
                  <span className={`${getUiFontClass()} text-[10px] ${
                    selectedUiStyle === 'flat-glow' ? 'text-cyan-400' : selectedUiStyle === 'inset-pixel' ? 'text-yellow-400' : 'text-pink-500'
                  } font-bold flex items-center gap-1 hover:translate-x-1 transition-transform cursor-pointer`}>
                    PLAY <ArrowRight size={10} />
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>

        {/* INTERACTIVE UI STYLE GALLERY SECTION */}
        <div id="ui-showcase" className="bg-dasi-black-900 border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-6 font-geist-sans">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Layers className="text-cyan-400" size={20} />
              <h2 className="text-base font-bold uppercase tracking-wider">Button & UI Card Style Variations</h2>
            </div>
            <span className="text-[10px] font-semibold text-dasi-steel-400 bg-white/5 px-2.5 py-1 rounded-full uppercase font-geist-mono">
              Zero Heavy Bottom-Right Shadow Lines
            </span>
          </div>

          <p className="text-sm text-dasi-steel-400 -mt-2 max-w-3xl leading-relaxed">
            Standard retro shadow lines can clutter clean layouts. These three production-ready designs achieve depth, branding, and interactiveness through alternative techniques: diffuse glow overlays, mechanical insets, and wireframe path-glowing vectors.
          </p>

          {/* Style Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
            
            {/* Style 1 Card */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 font-bold text-xs flex items-center justify-center">1</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Retro-Modern Flat Glow</h3>
              </div>
              
              {/* Component Preview Container */}
              <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5 flex flex-col gap-6 items-start h-[280px] justify-between text-left">
                
                {/* Glow Card */}
                <div className="w-full bg-slate-950/85 border border-cyan-500/30 rounded-xl p-4 shadow-[0_0_15px_rgba(6,182,212,0.12)] hover:shadow-[0_0_22px_rgba(6,182,212,0.25)] hover:border-cyan-400/50 transition-all duration-300 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-cyan-400 tracking-widest font-mono">[TACTICAL HUD]</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase font-sans">Shield Generator</h4>
                  <p className="text-[11px] text-dasi-steel-400">Protective matrix at 100% efficiency. No external shadow offset lines.</p>
                </div>

                {/* Glow Buttons */}
                <div className="flex gap-3 w-full">
                  <button className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-[10px] uppercase rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.55)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                    Deploy
                  </button>
                  <button className="px-4 py-2.5 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 font-semibold text-[10px] uppercase rounded-lg transition-all duration-300">
                    Specs
                  </button>
                </div>
              </div>

              {/* Code Toggle & Display */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowCodeForStyle(showCodeForStyle === 'flat-glow' ? null : 'flat-glow')}
                  className="w-full py-2 bg-dasi-black-950 hover:bg-dasi-black-800 border border-white/5 hover:border-white/10 text-[11px] text-dasi-steel-300 font-bold uppercase rounded-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <Code size={12} />
                  {showCodeForStyle === 'flat-glow' ? 'Hide Code Specs' : 'View Tailwind Specs'}
                </button>
                
                {showCodeForStyle === 'flat-glow' && (
                  <div className="bg-dasi-black-950 p-4 rounded-xl border border-white/5 flex flex-col gap-3 font-mono text-[10px] text-dasi-steel-300 relative animate-fadeIn text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-cyan-400 font-bold">FLAT GLOW UTILITIES</span>
                      <button
                        onClick={() => copyToClipboard(tailwindCodes['flat-glow'].primaryBtn, 'flat-glow-btn')}
                        className="p-1 hover:bg-white/5 rounded text-dasi-steel-400 hover:text-white transition-colors flex items-center gap-1"
                      >
                        {copiedTextId === 'flat-glow-btn' ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                        <span>{copiedTextId === 'flat-glow-btn' ? 'Copied!' : 'Copy Btn'}</span>
                      </button>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap max-h-[180px] text-[9px] text-dasi-steel-400 leading-normal">
                      {tailwindCodes['flat-glow'].card}
                      {"\n\n"}
                      {tailwindCodes['flat-glow'].primaryBtn}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Style 2 Card */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-yellow-950 text-yellow-400 font-bold text-xs flex items-center justify-center">2</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">8-Bit Inset-Pixel</h3>
              </div>
              
              {/* Component Preview Container */}
              <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5 flex flex-col gap-6 items-start h-[280px] justify-between text-left">
                
                {/* Pixel Card */}
                <div className="w-full bg-[#0b1329] border-2 border-yellow-400 rounded-none p-4 shadow-[inset_0_0_12px_rgba(234,179,8,0.2)] hover:shadow-[inset_0_0_20px_rgba(234,179,8,0.35)] transition-all duration-300 flex flex-col gap-1.5 relative">
                  {/* Micro Pixel Corners */}
                  <div className="absolute top-0 left-0 w-1.5 h-1.5 bg-yellow-400" />
                  <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-yellow-400" />
                  <div className="absolute bottom-0 left-0 w-1.5 h-1.5 bg-yellow-400" />
                  <div className="absolute bottom-0 right-0 w-1.5 h-1.5 bg-yellow-400" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-yellow-400 tracking-wider font-mono">[8-BIT INV]</span>
                    <span className="text-[9px] text-yellow-400 font-bold">QTY: 04</span>
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Mega Elixir</h4>
                  <p className="text-[11px] text-dasi-steel-400">Tactile inner shadows simulate depth inside a completely flat bounding frame.</p>
                </div>

                {/* Pixel Buttons */}
                <div className="flex gap-3 w-full">
                  <button className="flex-1 px-4 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-[10px] uppercase border-2 border-black rounded-none shadow-[inset_-3px_-3px_0px_0px_rgba(202,138,4,0.75),inset_3px_3px_0px_0px_rgba(255,255,255,0.9)] hover:shadow-[inset_-2px_-2px_0px_0px_rgba(202,138,4,0.75),inset_2px_2px_0px_0px_rgba(255,255,255,0.9)] active:shadow-[inset_3px_3px_0px_0px_rgba(202,138,4,0.75),inset_-3px_-3px_0px_0px_rgba(255,255,255,0.9)] transition-all duration-100 font-mono">
                    USE ITEM
                  </button>
                  <button className="px-4 py-2.5 bg-transparent hover:bg-yellow-400/10 text-yellow-400 font-bold text-[10px] uppercase border-2 border-yellow-400 rounded-none transition-all duration-300 font-mono">
                    DROP
                  </button>
                </div>
              </div>

              {/* Code Toggle & Display */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowCodeForStyle(showCodeForStyle === 'inset-pixel' ? null : 'inset-pixel')}
                  className="w-full py-2 bg-dasi-black-950 hover:bg-dasi-black-800 border border-white/5 hover:border-white/10 text-[11px] text-dasi-steel-300 font-bold uppercase rounded-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <Code size={12} />
                  {showCodeForStyle === 'inset-pixel' ? 'Hide Code Specs' : 'View Tailwind Specs'}
                </button>
                
                {showCodeForStyle === 'inset-pixel' && (
                  <div className="bg-dasi-black-950 p-4 rounded-xl border border-white/5 flex flex-col gap-3 font-mono text-[10px] text-dasi-steel-300 relative animate-fadeIn text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-yellow-400 font-bold">INSET PIXEL UTILITIES</span>
                      <button
                        onClick={() => copyToClipboard(tailwindCodes['inset-pixel'].primaryBtn, 'inset-pixel-btn')}
                        className="p-1 hover:bg-white/5 rounded text-dasi-steel-400 hover:text-white transition-colors flex items-center gap-1"
                      >
                        {copiedTextId === 'inset-pixel-btn' ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                        <span>{copiedTextId === 'inset-pixel-btn' ? 'Copied!' : 'Copy Btn'}</span>
                      </button>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap max-h-[180px] text-[9px] text-dasi-steel-400 leading-normal">
                      {tailwindCodes['inset-pixel'].card}
                      {"\n\n"}
                      {tailwindCodes['inset-pixel'].primaryBtn}
                    </pre>
                  </div>
                )}
              </div>
            </div>

            {/* Style 3 Card */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-pink-950 text-pink-500 font-bold text-xs flex items-center justify-center">3</span>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Neon Vector Outline</h3>
              </div>
              
              {/* Component Preview Container */}
              <div className="bg-slate-950/40 p-6 rounded-2xl border border-white/5 flex flex-col gap-6 items-start h-[280px] justify-between text-left">
                
                {/* Vector Card */}
                <div className="w-full bg-black/95 border border-pink-500 rounded-none p-4 shadow-[0_0_12px_rgba(236,72,153,0.12)] hover:shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all duration-300 flex flex-col gap-1.5 relative">
                  {/* Technical Bracket Corner Overlays */}
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-pink-500" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-pink-500" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-pink-500" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-pink-500" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-pink-500 tracking-widest font-mono">// VECTOR_GRID</span>
                    <span className="text-[8px] border border-pink-500/30 px-1 text-pink-500 font-mono">SYS.OK</span>
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase font-mono">Hyperlink Node</h4>
                  <p className="text-[11px] text-dasi-steel-400">Minimal vector line art. Hot-pink glow replaces heavy drop shadow borders.</p>
                </div>

                {/* Vector Buttons */}
                <div className="flex gap-3 w-full">
                  <button className="flex-1 px-4 py-2.5 border-2 border-pink-500 bg-transparent text-pink-500 hover:bg-pink-500 hover:text-black font-bold text-[10px] tracking-widest uppercase rounded-none hover:shadow-[0_0_12px_rgba(236,72,153,0.7)] active:scale-95 transition-all duration-200">
                    CONNECT
                  </button>
                  <button className="px-4 py-2.5 border border-pink-500/40 hover:border-pink-500 bg-transparent text-pink-500/70 hover:text-pink-500 font-bold text-[10px] uppercase rounded-none transition-all duration-200">
                    PING
                  </button>
                </div>
              </div>

              {/* Code Toggle & Display */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowCodeForStyle(showCodeForStyle === 'vector-outline' ? null : 'vector-outline')}
                  className="w-full py-2 bg-dasi-black-950 hover:bg-dasi-black-800 border border-white/5 hover:border-white/10 text-[11px] text-dasi-steel-300 font-bold uppercase rounded-lg flex items-center justify-center gap-1.5 transition-all"
                >
                  <Code size={12} />
                  {showCodeForStyle === 'vector-outline' ? 'Hide Code Specs' : 'View Tailwind Specs'}
                </button>
                
                {showCodeForStyle === 'vector-outline' && (
                  <div className="bg-dasi-black-950 p-4 rounded-xl border border-white/5 flex flex-col gap-3 font-mono text-[10px] text-dasi-steel-300 relative animate-fadeIn text-left">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-pink-500 font-bold">VECTOR OUTLINE UTILITIES</span>
                      <button
                        onClick={() => copyToClipboard(tailwindCodes['vector-outline'].primaryBtn, 'vector-outline-btn')}
                        className="p-1 hover:bg-white/5 rounded text-dasi-steel-400 hover:text-white transition-colors flex items-center gap-1"
                      >
                        {copiedTextId === 'vector-outline-btn' ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} />}
                        <span>{copiedTextId === 'vector-outline-btn' ? 'Copied!' : 'Copy Btn'}</span>
                      </button>
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap max-h-[180px] text-[9px] text-dasi-steel-400 leading-normal">
                      {tailwindCodes['vector-outline'].card}
                      {"\n\n"}
                      {tailwindCodes['vector-outline'].primaryBtn}
                    </pre>
                  </div>
                )}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm leading-relaxed text-left">
            
            {/* System 1 specs */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-cyan-400 font-russo-one text-sm">
                <div className="w-1.5 h-1.5 bg-cyan-400 transform rotate-45" />
                01. RETRO ARCADE (PRIMARY)
              </div>
              <p className="text-xs text-dasi-steel-400">
                Designed for nostalgic pixel arcade, tycoon, and mobile arcade mechanics. The thick, blocky strokes of <strong>Russo One</strong> provide instant retro gaming punch, and <strong>Silkscreen</strong> provides the pixel-perfect 8-bit console overlay, rendering numbers and status indicators beautifully.
              </p>
              <div className="bg-dasi-black-950 p-3 rounded-lg border border-white/5 font-geist-mono text-xs flex flex-col gap-1 text-dasi-steel-400">
                <span className="text-[10px] text-dasi-steel-500 font-bold uppercase">Tailwind Setup Config:</span>
                <code>--font-display: var(--font-russo-one);</code>
                <code>--font-ui: var(--font-silkscreen);</code>
                <code>--font-body: var(--font-outfit);</code>
              </div>
            </div>

            {/* System 2 specs */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-dasi-alice-400 font-orbitron font-bold text-sm">
                <div className="w-1.5 h-1.5 bg-dasi-alice-400 rounded-none animate-pulse" />
                02. NEON OVERDRIVE
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

            {/* System 3 specs */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-amber-200/90 font-cinzel font-semibold text-sm">
                <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
                03. MYTHIC LEGEND
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

          </div>

          <div className="mt-4 p-4 bg-dasi-black-950 rounded-xl border border-white/5 text-left">
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
