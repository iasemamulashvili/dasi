'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './BackgroundGrid.module.css';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

type IconType = 'shield' | 'gamepad' | 'cube' | 'phone' | 'code' | 'triangles';

interface ScatteredIcon {
  type: IconType;
  top: string;
  left?: string;
  right?: string;
  scale?: string;
  rot: string;
  floatDir: 'clockwise' | 'counter';
}

// 23 custom icons scattered down the vertical length of the page to match the exact density in the screenshot
const backgroundIcons: ScatteredIcon[] = [
  { type: 'triangles', top: '2%', left: '12%', rot: '-15deg', floatDir: 'clockwise', scale: '80px' },
  { type: 'shield', top: '4%', right: '15%', rot: '10deg', floatDir: 'counter', scale: '140px' },
  { type: 'gamepad', top: '9%', left: '6%', rot: '-12deg', floatDir: 'clockwise', scale: '120px' },
  { type: 'cube', top: '12%', left: '45%', rot: '8deg', floatDir: 'counter', scale: '110px' },
  { type: 'phone', top: '14%', right: '10%', rot: '15deg', floatDir: 'clockwise', scale: '120px' },
  { type: 'shield', top: '20%', left: '10%', rot: '-10deg', floatDir: 'clockwise', scale: '130px' },
  { type: 'triangles', top: '23%', right: '40%', rot: '5deg', floatDir: 'counter', scale: '90px' },
  { type: 'gamepad', top: '27%', right: '8%', rot: '18deg', floatDir: 'clockwise', scale: '115px' },
  { type: 'phone', top: '32%', left: '5%', rot: '-15deg', floatDir: 'counter', scale: '110px' },
  { type: 'code', top: '34%', left: '42%', rot: '12deg', floatDir: 'clockwise', scale: '100px' },
  { type: 'gamepad', top: '40%' , left: '12%', rot: '-8deg', floatDir: 'counter', scale: '125px' },
  { type: 'shield', top: '43%', right: '12%', rot: '14deg', floatDir: 'clockwise', scale: '135px' },
  { type: 'triangles', top: '49%', left: '4%', rot: '-20deg', floatDir: 'counter', scale: '85px' },
  { type: 'phone', top: '52%', left: '44%', rot: '5deg', floatDir: 'clockwise', scale: '120px' },
  { type: 'code', top: '54%', right: '6%', rot: '22deg', floatDir: 'counter', scale: '105px' },
  { type: 'shield', top: '60%', left: '8%', rot: '-12deg', floatDir: 'clockwise', scale: '130px' },
  { type: 'cube', top: '63%', right: '8%', rot: '10deg', floatDir: 'counter', scale: '115px' },
  { type: 'triangles', top: '67%', left: '60%', rot: '-5deg', floatDir: 'clockwise', scale: '95px' },
  { type: 'triangles', top: '72%', left: '3%', rot: '15deg', floatDir: 'counter', scale: '80px' },
  { type: 'code', top: '75%', left: '35%', rot: '-10deg', floatDir: 'clockwise', scale: '110px' },
  { type: 'gamepad', top: '78%', right: '5%', rot: '25deg', floatDir: 'counter', scale: '120px' },
  { type: 'cube', top: '84%', left: '6%', rot: '-18deg', floatDir: 'clockwise', scale: '115px' },
  { type: 'shield', top: '88%', right: '15%', rot: '8deg', floatDir: 'counter', scale: '140px' },
];

export default function BackgroundGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.parallax-item');
      
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { y: -40 },
          {
            y: 40,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const renderIconSvg = (type: IconType) => {
    switch (type) {
      case 'shield':
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M 20 20 L 80 20 L 80 50 C 80 72 65 88 50 95 C 35 88 20 72 20 50 Z" />
            <polygon points="44,26 56,26 50,36" fill="currentColor" stroke="none" />
            <polygon points="14,10 24,14 18,20" fill="currentColor" stroke="none" />
            <polygon points="86,10 76,14 82,20" fill="currentColor" stroke="none" />
          </svg>
        );
      case 'gamepad':
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M 25 30 H 75 C 88 30 95 42 90 58 L 82 82 C 80 88 72 90 66 84 L 56 74 C 52 70 48 70 44 74 L 34 84 C 28 90 20 88 18 82 L 10 58 C 5 42 12 30 25 30 Z" />
            <path d="M 20 52 H 40 M 30 42 V 62" strokeWidth="2.5" />
            <circle cx="70" cy="44" r="3" fill="none" />
            <circle cx="62" cy="52" r="3" fill="none" />
            <circle cx="78" cy="52" r="3" fill="none" />
            <circle cx="70" cy="60" r="3" fill="none" />
            <line x1="43" y1="50" x2="47" y2="54" strokeWidth="1.8" />
            <line x1="53" y1="50" x2="57" y2="54" strokeWidth="1.8" />
          </svg>
        );
      case 'cube':
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <polygon points="50,15 80,32.5 80,67.5 50,85 20,67.5 20,32.5" />
            <line x1="50" y1="50" x2="50" y2="15" />
            <line x1="50" y1="50" x2="80" y2="67.5" />
            <line x1="50" y1="50" x2="20" y2="67.5" />
            <path d="M 45 22 L 50 15 L 55 22" />
            <path d="M 74 67.5 L 80 67.5 L 80 61" />
            <path d="M 26 67.5 L 20 67.5 L 20 61" />
          </svg>
        );
      case 'phone':
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <rect x="24" y="10" width="52" height="80" rx="8" />
            <rect x="28" y="18" width="44" height="62" rx="2" />
            <line x1="44" y1="14" x2="56" y2="14" strokeWidth="1.5" />
            <circle cx="38" cy="14" r="1.2" fill="currentColor" stroke="none" />
            <line x1="42" y1="84" x2="58" y2="84" strokeWidth="2.5" />
          </svg>
        );
      case 'code':
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <path d="M 32 32 L 14 50 L 32 68" />
            <path d="M 68 32 L 86 50 L 68 68" />
            <line x1="44" y1="74" x2="56" y2="26" />
          </svg>
        );
      case 'triangles':
        return (
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <polygon points="50,16 82,72 18,72" />
            <polygon points="76,22 88,32 84,18" fill="currentColor" stroke="none" />
            <polygon points="24,38 34,46 20,50" fill="currentColor" stroke="none" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className={styles.container} aria-hidden="true">
      {/* 1. Fine repeating technical CSS grid backdrop */}
      <div className={styles.grid} />

      {/* 2. Scattered Vector Icon Decorations */}
      {backgroundIcons.map((icon, index) => {
        const positionStyles = {
          '--top': icon.top,
          '--left': icon.left || 'auto',
          '--right': icon.right || 'auto',
          '--scale': icon.scale || '120px',
        } as React.CSSProperties;

        const rotationStyles = {
          '--rot': icon.rot,
        } as React.CSSProperties;

        const floatClass = icon.floatDir === 'clockwise' ? styles.floatClockwise : styles.floatCounter;

        return (
          <div
            key={index}
            className={`${styles.parallaxWrapper} parallax-item`}
            style={positionStyles}
          >
            <div
              className={`${styles.iconWrapper} ${floatClass}`}
              style={rotationStyles}
            >
              {renderIconSvg(icon.type)}
            </div>
          </div>
        );
      })}
    </div>
  );
}

