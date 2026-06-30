'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function Hero() {
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
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const parentRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const carriedLetters = useRef<number[]>([]);
  const targets = useRef<{ x: number; y: number }[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });

  const titleText = "DASI GAMES";

  useEffect(() => {
    const handleScroll = () => {
      if (carriedLetters.current.length === 0) return;
      carriedLetters.current.forEach((index, i) => {
        const parent = parentRefs.current[index];
        if (!parent) return;
        const rect = parent.getBoundingClientRect();
        const targetViewportX = mousePos.current.x + 20 + (i * 6);
        const targetViewportY = mousePos.current.y - 15 - (i * 15);
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

      // --- Multi-Layer Parallax ---
      const handleMouseMoveParallax = (e: MouseEvent) => {
        if (window.innerWidth < 768) return;
        const { clientX, clientY } = e;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const moveX = (clientX - centerX) / centerX; // value between -1 and 1
        const moveY = (clientY - centerY) / centerY;

        // Background moves very slightly
        gsap.to(layerBgRef.current, {
          x: moveX * 15,
          y: moveY * 15,
          duration: 1,
          ease: 'power2.out',
        });

        // Midground moves moderately
        gsap.to(layerMidRef.current, {
          x: moveX * -35,
          y: moveY * -35,
          duration: 1.2,
          ease: 'power2.out',
        });

        // Foreground/tagline overlay moves faster in opposite direction
        gsap.to(layerForeRef.current, {
          x: moveX * -50,
          y: moveY * -50,
          duration: 1.5,
          ease: 'power2.out',
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
            const currentX = gsap.getProperty(letter, 'x') as number || 0;
            const currentY = gsap.getProperty(letter, 'y') as number || 0;

            const targetRot = (i - (carriedLetters.current.length - 1) / 2) * 6;
            const ease = 0.18 - (i * 0.012);

            // Subtle brand gradient trail in OKLCH: Slate-Violet at cursor -> Deep Graphite at tail
            const totalCarried = carriedLetters.current.length;
            const ratio = totalCarried > 1 ? i / (totalCarried - 1) : 0;
            const targetLightness = 0.68 - ratio * 0.13; // 0.68 down to 0.55
            const targetChroma = 0.10 - ratio * 0.04;    // 0.10 down to 0.06
            const targetHue = 264;                        // Consistent slate-violet/graphite hue

            gsap.set(letter, {
              x: currentX + (target.x - currentX) * ease,
              y: currentY + (target.y - currentY) * ease,
              rotation: targetRot,
              scale: 0.95 - (i * 0.015),
              zIndex: 100 - i,
              filter: `drop-shadow(0 ${4 + i * 2}px ${8 + i * 3}px rgba(0, 0, 0, 0.45))`,
              '--letter-l': targetLightness,
              '--letter-c': targetChroma,
              '--letter-h': targetHue,
            });
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

  const handleContainerMouseMove = (e: React.MouseEvent) => {
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

    parentRefs.current.forEach((parent, index) => {
      const letter = letterRefs.current[index];
      if (!parent || !letter) return;

      const rect = parent.getBoundingClientRect();

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

          // Update target immediately on collection
          const stackIdx = carriedLetters.current.length - 1;
          const targetViewportX = e.clientX + 20 + (stackIdx * 6);
          const targetViewportY = e.clientY - 15 - (stackIdx * 15);
          targets.current[index] = {
            x: targetViewportX - rect.left,
            y: targetViewportY - rect.top,
          };

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
    }, 1200);

    gsap.fromTo('.wind-line',
      { scaleX: 0, x: 20, opacity: 0.8 },
      {
        scaleX: 2.2,
        x: -240,
        opacity: 0,
        stagger: 0.08,
        duration: 0.9,
        ease: 'power2.out',
        overwrite: 'auto',
      }
    );

    letterRefs.current.forEach((letter, index) => {
      if (letter && carriedLetters.current.includes(index)) {
        const stackIdx = carriedLetters.current.indexOf(index);
        const tl = gsap.timeline({ delay: stackIdx * 0.04 });
        
        tl.to(letter, {
          x: '-=150',
          y: '+=random(-25, 25)',
          rotation: 'random(-60, 60)',
          duration: 0.28,
          ease: 'power1.out',
        })
        .to(letter, {
          // Wind Release Flash (Soft Sage Green/Slate)
          '--letter-l': 0.75,
          '--letter-c': 0.08,
          '--letter-h': 165,
          duration: 0.15,
          overwrite: 'auto',
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
      }
    });

    carriedLetters.current = [];
    setCollectedCount(0);
  };

  const handleLetTalkClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offset = 80;
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

      {/* Parallax Layer 2: Midground Game Art */}
      <div
        ref={layerMidRef}
        className="absolute right-0 bottom-0 top-0 w-full md:w-[60%] opacity-25 pointer-events-none select-none z-10 flex items-end justify-end"
      >
        <img
          src="https://dasigames.com/Images/banner_image.webp"
          alt="Game Characters Banner"
          className="h-[80%] max-h-[700px] w-auto object-contain object-bottom select-none pointer-events-none filter drop-shadow-[0_0_50px_rgba(109,109,128,0.15)]"
        />
      </div>

      {/* Parallax Layer 3: Tagline & Interactive content */}
      <div
        ref={layerForeRef}
        className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col items-start justify-center gap-6"
      >
        {/* Playful Interactive Header Alert */}
        {collectedCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-carbon-black-2 border border-graphite-light text-xs font-silkscreen text-platinum-silver animate-pulse">
            <Sparkles size={12} />
            <span>Carrying {collectedCount} letters! Hover over RELEASE to snap them back!</span>
          </div>
        )}

        {/* Gamified Collectable Title & Drop Zone Container */}
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-8 flex-wrap w-full">
          <h1
            ref={titleRef}
            className="text-5xl md:text-8xl font-normal tracking-wider select-none flex flex-wrap font-russo-one"
          >
            {titleText.split('').map((char, index) => {
              if (char === ' ') return <span key={index} className="w-6 md:w-10">&nbsp;</span>;
              const isCarried = collectedCount > 0 && carriedLetters.current.includes(index);
              return (
                <span
                  key={index}
                  ref={(el) => {
                    parentRefs.current[index] = el;
                  }}
                  className="relative inline-block select-none"
                >
                  {/* Holographic Outline Placeholder (Ghost Layer) - Normal Document Flow */}
                  <span
                    className={`inline-block select-none transition-all duration-500 ease-out ${
                      isCarried ? 'opacity-100 scale-95' : 'opacity-0 scale-100 pointer-events-none'
                    }`}
                    style={{
                      color: 'oklch(0.65 0.15 264 / 0.12)', // 12% opacity solid brand violet (ghost silhouette)
                    }}
                  >
                    {char}
                  </span>

                  {/* Interactive Carried Letter - Absolute Overlay */}
                  <span
                    ref={(el) => {
                      letterRefs.current[index] = el;
                    }}
                    onMouseEnter={(e) => {
                      if (collectedCount === 0 || !carriedLetters.current.includes(index)) {
                        gsap.to(e.currentTarget, {
                          '--letter-l': 0.88,
                          '--letter-c': 0.02,
                          '--letter-h': 240,
                          duration: 0.2,
                        });
                      }
                    }}
                    onMouseLeave={(e) => {
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
                      isCarried ? 'pointer-events-none' : ''
                    }`}
                    style={{ 
                      transformStyle: 'preserve-3d',
                      pointerEvents: isCarried ? 'none' : 'auto'
                    }}
                  >
                    {char}
                  </span>
                </span>
              );
            })}
          </h1>
          
          {/* Drop Zone (dashed game box with integrated wall fan) */}
          <div
            ref={dumpZoneRef}
            onMouseEnter={handleDumpZoneMouseEnter}
            className={`inline-flex items-center gap-3 pl-5 pr-2 py-2 border-dashed border-2 rounded-xl text-sm font-sans tracking-widest transition-all duration-300 relative select-none [text-shadow:none] mt-4 md:mt-0 ${
              collectedCount > 0
                ? 'border-platinum-silver text-platinum-silver bg-carbon-black-2/90 scale-105'
                : 'border-graphite-light text-alabaster-grey/70 bg-transparent hover:border-platinum-silver hover:text-bright-snow'
            }`}
          >
            <span>RELEASE</span>

            {/* Integrated Wall Fan mounted to the right border */}
            <div className="relative flex items-center justify-center pl-1">
              {/* Wind Particles (hidden unless blowing) */}
              <div className="absolute right-full mr-2 w-28 h-8 pointer-events-none overflow-hidden flex flex-col justify-around">
                <div className="wind-line w-full h-[1.5px] bg-gradient-to-l from-platinum-silver to-transparent opacity-0 origin-right" />
                <div className="wind-line w-full h-[2.5px] bg-gradient-to-l from-platinum-silver to-transparent opacity-0 origin-right" />
                <div className="wind-line w-full h-[1px] bg-gradient-to-l from-platinum-silver to-transparent opacity-0 origin-right" />
              </div>

              {/* Fan SVG (Heavy Dual Bracket Industrial Fan) */}
              <svg
                className={`w-11 h-11 transition-all duration-300 ${
                  collectedCount > 0 ? 'text-platinum-silver scale-105' : 'text-alabaster-grey/60'
                }`}
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M54 16 c1.5 0 3 1.5 3 4 v24 c0 2.5 -1.5 4 -3 4" strokeWidth="3" />
                <path d="M54 32 h-6" strokeWidth="3.5" />
                <path d="M48 32 c-4 0 -8 -4 -8 -10" strokeWidth="3" />
                <path d="M40 22 h-6 v-6 h6 z" fill="currentColor" className="opacity-40" />
                <circle cx="24" cy="20" r="18" strokeWidth="2.5" />
                <circle cx="24" cy="20" r="15" strokeWidth="1" strokeDasharray="3 2" className="opacity-40" />
                <g
                  className={`origin-[24px_20px] ${
                    isBlowing
                      ? 'animate-[spin_0.12s_linear_infinite]'
                      : collectedCount > 0
                      ? 'animate-[spin_1.2s_linear_infinite]'
                      : 'hover:animate-[spin_0.5s_linear_infinite]'
                  }`}
                >
                  <circle cx="24" cy="20" r="4.5" fill="currentColor" />
                  <g transform="rotate(0, 24, 20)">
                    <path d="M24 20 c-4 -3 -6 -11 -4 -13 c3 1 6 6 4 13" fill="currentColor" strokeWidth="1.5" />
                  </g>
                  <g transform="rotate(120, 24, 20)">
                    <path d="M24 20 c-4 -3 -6 -11 -4 -13 c3 1 6 6 4 13" fill="currentColor" strokeWidth="1.5" />
                  </g>
                  <g transform="rotate(240, 24, 20)">
                    <path d="M24 20 c-4 -3 -6 -11 -4 -13 c3 1 6 6 4 13" fill="currentColor" strokeWidth="1.5" />
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Kinetic Entrance Tagline */}
        <div className="overflow-hidden">
          <p className="text-xl md:text-3xl font-light tracking-wide text-bright-snow/90 flex flex-wrap gap-x-2">
            {"Crafting unique gaming experiences".split(' ').map((word, wIdx) => (
              <span key={wIdx} className="inline-block overflow-hidden">
                {word.split('').map((char, cIdx) => (
                  <span key={cIdx} className="entrance-char inline-block origin-bottom-left">
                    {char}
                  </span>
                ))}
              </span>
            ))}
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

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none opacity-50">
        <span className="text-[9px] tracking-widest text-alabaster-grey/50 font-silkscreen uppercase">Scroll to Explore</span>
        <div className="w-[1.5px] h-10 bg-gradient-to-b from-slate-violet-light to-transparent animate-pulse" />
      </div>
    </section>
  );
}
