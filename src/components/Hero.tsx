'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';
import ScrollLogoCanvas from './ScrollLogoCanvas';

export interface HeroProps {
  logoComponent?: React.ReactNode | ((heroContainerRef: React.RefObject<HTMLDivElement | null>) => React.ReactNode);
}

export default function Hero({ logoComponent }: HeroProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const ctaContainerRef = useRef<HTMLDivElement>(null);
  const ctaBtnRef = useRef<HTMLButtonElement>(null);
  const dumpZoneRef = useRef<HTMLDivElement>(null);

  // Parallax layers refs
  const layerBgRef = useRef<HTMLDivElement>(null);
  const layerMidRef = useRef<HTMLDivElement>(null);
  const layerForeRef = useRef<HTMLDivElement>(null);

  // Letter Collector state
  const [collectedCount, setCollectedCount] = useState(0);
  const [isBlowing, setIsBlowing] = useState(false);
  const [isEntrancing, setIsEntrancing] = useState(true);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const parentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const carriedLetters = useRef<number[]>([]);
  const targets = useRef<{ x: number; y: number }[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const letterTimelines = useRef<(gsap.core.Timeline | null)[]>([]);

  const titleText = "DASI GAMES";

  useEffect(() => {
    const handleScroll = () => {
      if (carriedLetters.current.length === 0) return;
      const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
      const xOffset = isMobile ? 4 : 6;
      const yOffset = isMobile ? 8 : 15;
      
      // Batch read bounding boxes first
      const rects = carriedLetters.current.map(index => {
        const parent = parentRefs.current[index];
        return parent ? parent.getBoundingClientRect() : null;
      });

      carriedLetters.current.forEach((index, i) => {
        const parent = parentRefs.current[index];
        const rect = rects[i];
        if (!parent || !rect) return;
        const targetViewportX = mousePos.current.x + 20 + (i * xOffset);
        const targetViewportY = mousePos.current.y - 15 - (i * yOffset);
        targets.current[index] = {
          x: targetViewportX - rect.left,
          y: targetViewportY - rect.top,
        };
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // --- Kinetic Entrance Animations ---
      gsap.fromTo(
        '.entrance-char',
        { opacity: 0, y: 50, rotateX: -60 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          stagger: 0.03,
          duration: 1.2,
          ease: 'power4.out',
          onComplete: () => {
            setIsEntrancing(false);
          }
        }
      );

      gsap.fromTo(
        descriptionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.6, ease: 'power3.out' }
      );

      gsap.fromTo(
        ctaContainerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.2, delay: 0.8, ease: 'power3.out' }
      );

      // --- Multi-Layer Parallax (Throttled for 120 FPS Performance) ---
      let rafId: number;
      const handleMouseMoveParallax = (e: MouseEvent) => {
        if (window.innerWidth < 768) return;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          const { clientX, clientY } = e;
          const centerX = window.innerWidth / 2;
          const centerY = window.innerHeight / 2;
          const moveX = (clientX - centerX) / centerX;
          const moveY = (clientY - centerY) / centerY;

          gsap.to(layerBgRef.current, {
            x: moveX * 15,
            y: moveY * 15,
            duration: 0.6,
            overwrite: 'auto',
            ease: 'power2.out',
          });

          gsap.to(layerMidRef.current, {
            x: moveX * -35,
            y: moveY * -35,
            duration: 0.8,
            overwrite: 'auto',
            ease: 'power2.out',
          });

          gsap.to(layerForeRef.current, {
            x: moveX * -50,
            y: moveY * -50,
            duration: 1.0,
            overwrite: 'auto',
            ease: 'power2.out',
          });
        });
      };

      window.addEventListener('mousemove', handleMouseMoveParallax);

      // --- Magnetic CTA Button ---
      const handleCtaMouseMove = (e: MouseEvent) => {
        if (window.innerWidth < 768) return;
        const btn = ctaBtnRef.current;
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

        if (dist < 120) {
          const x = (e.clientX - btnCenterX) * 0.35;
          const y = (e.clientY - btnCenterY) * 0.35;

          gsap.to(btn, {
            x,
            y,
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out',
          });
        } else {
          gsap.to(btn, {
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.5,
            ease: 'elastic.out(1, 0.3)',
          });
        }
      };

      window.addEventListener('mousemove', handleCtaMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMoveParallax);
        window.removeEventListener('mousemove', handleCtaMouseMove);
      };
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // --- Letter Collector Animation Loop ---
  useEffect(() => {
    let animationId: number;

    const updateLetterPositions = () => {
      if (carriedLetters.current.length > 0) {
        carriedLetters.current.forEach((index, i) => {
          const letter = letterRefs.current[index];
          const target = targets.current[index];
          if (letter && target) {
            // Read position from our cached property on the DOM node, falling back to GSAP properties for initialization
            const currentX = (letter as any)._x !== undefined 
              ? (letter as any)._x 
              : (gsap.getProperty(letter, 'x') as number || 0);
            const currentY = (letter as any)._y !== undefined 
              ? (letter as any)._y 
              : (gsap.getProperty(letter, 'y') as number || 0);

            const targetRot = (i - (carriedLetters.current.length - 1) / 2) * 6;
            const ease = 0.18 - (i * 0.012);

            // Subtle chromatic tint trail: Rose-White at cursor -> Ice-Blue-White at tail
            const totalCarried = carriedLetters.current.length;
            const ratio = totalCarried > 1 ? i / (totalCarried - 1) : 0;
            const targetLightness = 0.90 - ratio * 0.15; // Bright, near-white (0.90 down to 0.75)
            const targetChroma = 0.04;                   // Very delicate, high-end tint
            const targetHue = 380 - ratio * 130;         // Rose (20) -> Lavender -> Ice-Blue (250)

            const nextX = currentX + (target.x - currentX) * ease;
            const nextY = currentY + (target.y - currentY) * ease;

            // Cache position on the DOM node to prevent style read layout thrashing
            (letter as any)._x = nextX;
            (letter as any)._y = nextY;

            // Apply direct DOM style modifications
            const scale = 0.95 - (i * 0.015);
            letter.style.transform = `translate3d(${nextX}px, ${nextY}px, 0) scale(${scale}) rotate(${targetRot}deg)`;
            letter.style.zIndex = `${100 - i}`;
            letter.style.filter = `drop-shadow(0 ${4 + i * 2}px ${8 + i * 3}px rgba(0, 0, 0, 0.45))`;
            letter.style.setProperty('--letter-l', `${targetLightness}`);
            letter.style.setProperty('--letter-c', `${targetChroma}`);
            letter.style.setProperty('--letter-h', `${targetHue}`);
          }
        });
      }
      animationId = requestAnimationFrame(updateLetterPositions);
    };

    updateLetterPositions();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  const handleLetterClick = (index: number) => {
    if (isEntrancing || isBlowing) return; // Block collection while letters are returning to home
    const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
    if (!isMobile) return;

    if (carriedLetters.current.includes(index)) return;

    carriedLetters.current.push(index);
    setCollectedCount(carriedLetters.current.length);

    const letter = letterRefs.current[index];
    const parent = parentRefs.current[index];
    if (letter && parent) {
      const rect = parent.getBoundingClientRect();
      const stackIdx = carriedLetters.current.length - 1;

      // Kill any active timeline on this letter to prevent overwrite/snap conflicts
      if (letterTimelines.current[index]) {
        letterTimelines.current[index]?.kill();
        letterTimelines.current[index] = null;
      }
      // Kill any active returning/release animations on the letter and its placeholder
      gsap.killTweensOf(letter);
      gsap.killTweensOf(`.letter-placeholder-${index}`);

      // Update mousePos to the tapped letter's center if it hasn't been set yet (positioned higher to prevent overlapping carrying alert pill)
      if (mousePos.current.x === 0 && mousePos.current.y === 0) {
        mousePos.current = { x: rect.left + rect.width / 2, y: rect.top - 80 };
      }

      const targetViewportX = mousePos.current.x + 20 + (stackIdx * 4);
      const targetViewportY = mousePos.current.y - 15 - (stackIdx * 8);

      targets.current[index] = {
        x: targetViewportX - rect.left,
        y: targetViewportY - rect.top,
      };

      // Animate placeholder opacity
      gsap.to(`.letter-placeholder-${index}`, {
        opacity: 1,
        scale: 0.95,
        duration: 0.3,
        overwrite: 'auto'
      });

      gsap.to(letter, {
        scale: 1.3,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent) => {
    if (isEntrancing || isBlowing) return; // Block interaction while letters are returning to home
    if (window.innerWidth < 768 || ('ontouchstart' in window)) return;
    
    // Bulletproof Release: Check if the mouse is inside the RELEASE box bounding box
    if (carriedLetters.current.length > 0 && dumpZoneRef.current) {
      const dumpRect = dumpZoneRef.current.getBoundingClientRect();
      if (
        e.clientX >= dumpRect.left &&
        e.clientX <= dumpRect.right &&
        e.clientY >= dumpRect.top &&
        e.clientY <= dumpRect.bottom
      ) {
        handleDumpZoneMouseEnter();
        return;
      }
    }
    
    mousePos.current = { x: e.clientX, y: e.clientY };

    // Batch read bounding boxes to prevent layout thrashing in mousemove loop
    const rects = parentRefs.current.map(parent => {
      return parent ? parent.getBoundingClientRect() : null;
    });

    parentRefs.current.forEach((parent, index) => {
      const letter = letterRefs.current[index];
      const rect = rects[index];
      if (!parent || !letter || !rect) return;

      if (carriedLetters.current.includes(index)) {
        // Calculate target relative to its parent container
        const stackIdx = carriedLetters.current.indexOf(index);
        const targetViewportX = e.clientX + 20 + (stackIdx * 6);
        const targetViewportY = e.clientY - 15 - (stackIdx * 15);

        targets.current[index] = {
          x: targetViewportX - rect.left,
          y: targetViewportY - rect.top,
        };
      } else {
        // Proximity check using exact viewport coordinates
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

        if (dist < 45) {
          carriedLetters.current.push(index);
          setCollectedCount(carriedLetters.current.length);

          // Kill any active timeline on this letter to prevent overwrite/snap conflicts
          if (letterTimelines.current[index]) {
            letterTimelines.current[index]?.kill();
            letterTimelines.current[index] = null;
          }
          // Kill any active returning/release animations on the letter and its placeholder
          gsap.killTweensOf(letter);
          gsap.killTweensOf(`.letter-placeholder-${index}`);

          // Update target immediately on collection
          const stackIdx = carriedLetters.current.length - 1;
          const targetViewportX = e.clientX + 20 + (stackIdx * 6);
          const targetViewportY = e.clientY - 15 - (stackIdx * 15);
          targets.current[index] = {
            x: targetViewportX - rect.left,
            y: targetViewportY - rect.top,
          };

          // Animate placeholder opacity
          gsap.to(`.letter-placeholder-${index}`, {
            opacity: 1,
            scale: 0.95,
            duration: 0.3,
            overwrite: 'auto'
          });

          gsap.to(letter, {
            scale: 1.3,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
          });
        }
      }
    });
  };

  const handleDumpZoneMouseEnter = () => {
    if (carriedLetters.current.length === 0) return;

    setIsBlowing(true);
    setTimeout(() => {
      setIsBlowing(false);
    }, 2000); // Extended to cover full return animation sequence safely

    gsap.fromTo('.wind-line',
      { scaleX: 0, x: 10, opacity: 0.8 },
      {
        scaleX: 1.5,
        x: -180, // Blow to the left edge of the release box
        opacity: 0,
        stagger: 0.05,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      }
    );

    // Clear coordinates cache so subsequent animations read clean starting locations
    letterRefs.current.forEach((letter) => {
      if (letter) {
        (letter as any)._x = undefined;
        (letter as any)._y = undefined;
      }
    });

    letterRefs.current.forEach((letter, index) => {
      if (letter && carriedLetters.current.includes(index)) {
        const stackIdx = carriedLetters.current.indexOf(index);
        const tl = gsap.timeline({ 
          delay: stackIdx * 0.04,
          onComplete: () => {
            letterTimelines.current[index] = null;
          }
        });
        letterTimelines.current[index] = tl;
        
        tl.to(letter, {
          x: '-=150',
          y: '+=random(-25, 25)',
          rotation: 'random(-60, 60)',
          duration: 0.28,
          ease: 'power1.out',
        })
        .to(letter, {
          // Wind Release Flash (Soft Silver-White)
          '--letter-l': 0.92,
          '--letter-c': 0.01,
          '--letter-h': 0,
          duration: 0.15,
        })
        .to(letter, {
          // Decelerate, return to home, and smoothly fade back to Bright Snow
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          '--letter-l': 0.95,
          '--letter-c': 0.01,
          '--letter-h': 0,
          duration: 0.8,
          ease: 'power3.out',
        });

        // Fade out the placeholder at the end of the return-home animation!
        tl.to(`.letter-placeholder-${index}`, {
          opacity: 0,
          scale: 1,
          duration: 0.3,
        }, "-=0.3");
      }
    });

    carriedLetters.current = [];
    // Delay closing the release box and stopping the fan by 900ms to let the wind finish blowing
    setTimeout(() => {
      setCollectedCount(0);
    }, 900);
  };

  const handleLetTalkClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offset = 30;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = contactSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section
      id="home"
      ref={containerRef}
      onMouseMove={handleContainerMouseMove}
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-transparent pt-20"
    >
      {/* Parallax Layer 1: Background environment */}
      <div
        ref={layerBgRef}
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(109,109,128,0.2)_0%,rgba(24,24,24,1)_80%)] opacity-80"
      />

      {/* Parallax Layer 3: Tagline & Interactive content */}
      <div
        ref={layerForeRef}
        className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col justify-center min-h-[calc(100vh-80px)] pt-24 md:pt-0"
      >
        {/* Left Column Content Wrapper (expanded max-w to allow full width for title and release box) */}
        <div className="max-w-5xl lg:max-w-6xl flex flex-col items-start justify-center gap-6 w-full">
        {/* Cyberpunk HUD Game-style Alert Pill */}
        {collectedCount > 0 && (
          <div className="flex items-center gap-3 px-4 py-2 bg-carbon-black-2/80 backdrop-blur-md border border-slate-violet/30 rounded-xl text-xs font-silkscreen text-bright-snow shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all duration-300 animate-fadeIn select-none border-l-4 border-l-slate-violet-light">
            <img
              src="/Images/dasigames_logo.png"
              alt="Dasi Logo"
              className="w-4 h-4 object-contain filter drop-shadow-[0_0_4px_rgba(168,85,247,0.5)]"
              style={{
                transform: `rotate(${collectedCount * 180}deg)`,
                transition: 'transform 500ms ease'
              }}
            />
            <span className="tracking-wider text-slate-violet-light font-bold">
              Carrying {collectedCount} {collectedCount === 1 ? 'letter' : 'letters'} • Hover RELEASE to launch!
            </span>
          </div>
        )}

        {/* Gamified Collectable Title & Drop Zone Container */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 md:gap-6 md:flex-nowrap w-full">
          <h1
            ref={titleRef}
            aria-label="DASI GAMES"
            className="text-5xl md:text-8xl font-normal tracking-wider select-none flex flex-wrap font-russo-one md:w-auto shrink-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <span aria-hidden="true" className="flex flex-wrap md:w-auto">
              {titleText.split('').map((char, index) => {
                if (char === ' ') return <span key={index} className="w-6 md:w-10">&nbsp;</span>;
                const isCarried = collectedCount > 0 && carriedLetters.current.includes(index);
                return (
                  <span
                    key={index}
                    ref={(el) => {
                      parentRefs.current[index] = el;
                    }}
                    className="relative inline-block"
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    {/* Holographic Outline Placeholder (Ghost Layer) - Normal Document Flow */}
                    <span
                      className={`letter-placeholder-${index} inline-block select-none transition-all duration-500 ease-out pointer-events-none`}
                      style={{
                        opacity: 0,
                        color: 'oklch(0.12 0.01 0)', // Slightly less black recess
                        textShadow: '0 1px 1px oklch(0.95 0.01 0 / 0.15), 0 -1px 1.5px oklch(0 0 0 / 0.8)', // 3D engraved bevel
                      }}
                    >
                      {char}
                    </span>

                    {/* Interactive Carried Letter - Absolute Overlay */}
                    <span
                      ref={(el) => {
                        letterRefs.current[index] = el;
                      }}
                      onClick={() => handleLetterClick(index)}
                      onMouseEnter={(e) => {
                        if (isEntrancing || isBlowing) return;
                        if (collectedCount === 0 || !carriedLetters.current.includes(index)) {
                          gsap.to(e.currentTarget, {
                            '--letter-l': 0.88,
                            '--letter-c': 0.01,
                            '--letter-h': 0,
                            duration: 0.2,
                          });
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (isEntrancing || isBlowing) return;
                        if (collectedCount === 0 || !carriedLetters.current.includes(index)) {
                          gsap.to(e.currentTarget, {
                            '--letter-l': 0.95,
                            '--letter-c': 0.01,
                            '--letter-h': 0,
                            duration: 0.25,
                          });
                        }
                      }}
                      className={`absolute inset-0 cursor-grab active:cursor-grabbing interactive-letter select-none entrance-char ${
                        (isEntrancing || isCarried || isBlowing) ? 'pointer-events-none' : ''
                      }`}
                      style={{ 
                        transformStyle: 'preserve-3d',
                        pointerEvents: (isEntrancing || isCarried || isBlowing) ? 'none' : 'auto'
                      }}
                    >
                      {char}
                    </span>
                  </span>
                );
              })}
            </span>
          </h1>
          
          {/* Release Box Container with collapsing spacing on mobile */}
          <div className={`w-full md:w-auto transition-all duration-500 ease-out overflow-hidden ${
            collectedCount > 0
              ? 'max-h-28 mt-6 md:mt-0 opacity-100'
              : 'max-h-0 mt-0 opacity-0 pointer-events-none'
          }`}>
            <div
              ref={dumpZoneRef}
              onMouseEnter={handleDumpZoneMouseEnter}
              onClick={handleDumpZoneMouseEnter}
              className={`flex items-center justify-between gap-5 px-5 h-14 min-w-[175px] border-dashed border-2 rounded-xl text-xs font-silkscreen tracking-widest transition-all duration-300 relative select-none overflow-hidden [text-shadow:none] shrink-0 ${
                collectedCount > 0
                  ? 'border-platinum-silver text-platinum-silver bg-carbon-black-2/90'
                  : 'border-graphite-light text-alabaster-grey/70 bg-transparent'
              } ${
                isBlowing
                  ? 'border-muted-green bg-muted-green/10 text-muted-green'
                  : 'hover:border-platinum-silver hover:text-bright-snow'
              }`}
            >
              <span>RELEASE</span>

              {/* Wind Particles (hidden unless blowing) - contained inside the release box */}
              <div className="absolute inset-y-0 left-4 right-14 pointer-events-none overflow-hidden flex flex-col justify-around">
                <div className="wind-line w-full h-[1.5px] bg-gradient-to-l from-platinum-silver to-transparent opacity-0 origin-right" />
                <div className="wind-line w-full h-[2.5px] bg-gradient-to-l from-platinum-silver to-transparent opacity-0 origin-right" />
                <div className="wind-line w-full h-[1.5px] bg-gradient-to-l from-platinum-silver to-transparent opacity-0 origin-right" />
                <div className="wind-line w-full h-[2px] bg-gradient-to-l from-platinum-silver to-transparent opacity-0 origin-right" />
              </div>

              {/* Integrated Wall Fan with ample padding on all sides */}
              <div className="relative flex items-center justify-center shrink-0">
                {/* Fan SVG (Option F: Vortex Singularity - Flush Centrifugal Spiral) */}
                <svg
                  className={`w-8 h-8 transition-all duration-300 ${
                    collectedCount > 0 ? 'text-platinum-silver scale-105' : 'text-alabaster-grey/60'
                  }`}
                  viewBox="0 0 64 64"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Outer casing */}
                  <circle cx="32" cy="32" r="27" strokeWidth="1.5" />
                  <circle cx="32" cy="32" r="24" strokeWidth="0.75" strokeDasharray="2 2" className="opacity-40" />
                  {/* Vortex Blades Group */}
                  <g
                    className={`origin-[32px_32px] ${
                      isBlowing
                        ? 'animate-[spin_0.15s_linear_infinite]'
                        : collectedCount > 0
                        ? 'animate-[spin_2s_linear_infinite]'
                        : 'hover:animate-[spin_0.8s_linear_infinite]'
                    }`}
                  >
                    <circle cx="32" cy="32" r="4" fill="currentColor" />
                    {[0, 60, 120, 180, 240, 300].map((angle) => (
                      <g key={angle} transform={`rotate(${angle}, 32, 32)`}>
                        <path d="M 32 32 C 32 18, 22 10, 16 13 C 12 15, 18 25, 32 32" fill="currentColor" stroke="none" />
                      </g>
                    ))}
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Kinetic Entrance Tagline with baseline descender padding */}
        <div className="py-2 overflow-visible">
          <p 
            aria-label="Crafting unique gaming experiences"
            className="text-xl md:text-3xl font-light tracking-wide text-bright-snow/90 flex flex-wrap gap-x-2 leading-relaxed pb-1"
          >
            <span aria-hidden="true" className="flex flex-wrap gap-x-2 pb-1">
              {"Crafting unique gaming experiences".split(' ').map((word, wIdx) => (
                <span key={wIdx} className="inline-block py-1">
                  {word.split('').map((char, cIdx) => (
                    <span key={cIdx} className="entrance-char inline-block origin-bottom-left py-0.5">
                      {char}
                    </span>
                  ))}
                </span>
              ))}
            </span>
          </p>
        </div>

        {/* Subtitle */}
        <p
          ref={descriptionRef}
          className="max-w-xl text-base text-alabaster-grey leading-relaxed font-outfit font-light"
        >
          Dasi Games bridges art, logic, and high performance to build addictive mobile, hybrid arcade RPG, and tycoon titles. Partner with us for cutting-edge game development solutions.
        </p>

        {/* CTA Container */}
        <div ref={ctaContainerRef} className="mt-4">
          <button
            ref={ctaBtnRef}
            onClick={handleLetTalkClick}
            className="inset-pixel-btn-primary inline-flex items-center gap-3 px-8 py-4 text-sm"
          >
            LET'S TALK
            <ArrowRight size={18} />
          </button>
        </div>
        </div>

        {/* Right Column: Dynamic Scroll-driven Canvas / Custom Logo Slot (z-10 beneath z-20 title/release box) */}
        <div
          ref={layerMidRef}
          className="relative md:absolute w-full max-w-[280px] sm:max-w-[320px] md:max-w-[480px] lg:max-w-[540px] mx-auto md:mx-0 md:right-0 md:bottom-0 lg:right-4 lg:bottom-2 md:w-[38vw] lg:w-[36vw] xl:w-[34vw] h-[240px] sm:h-[280px] md:h-[68%] lg:h-[72%] my-4 md:my-0 flex items-center justify-center md:items-end md:justify-end pointer-events-none select-none z-10"
        >
          {typeof logoComponent === 'function' ? logoComponent(containerRef) : (logoComponent || <ScrollLogoCanvas heroContainerRef={containerRef} />)}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none opacity-50">
        <span className="text-[9px] tracking-widest text-alabaster-grey/50 font-silkscreen uppercase">Scroll to Explore</span>
        <div className="w-[1.5px] h-10 bg-gradient-to-b from-slate-violet-light to-transparent animate-pulse" />
      </div>
    </section>
  );
}
