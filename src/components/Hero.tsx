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
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const collectedLetters = useRef<Set<number>>(new Set());
  const mousePos = useRef({ x: 0, y: 0 });

  const titleText = "DASI GAMES";

  useEffect(() => {
    // 1. GSAP Context for safety and cleanup
    const ctx = gsap.context(() => {
      // --- Kinetic Entrance Animations ---
      // Split letters in description tagline
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
        const btn = ctaBtnRef.current;
        if (!btn) return;

        const rect = btn.getBoundingClientRect();
        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);

        if (dist < 120) {
          // Attract button toward cursor
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
          // Snap back
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
      if (collectedLetters.current.size > 0) {
        collectedLetters.current.forEach((index) => {
          const letter = letterRefs.current[index];
          if (letter) {
            const rect = letter.getBoundingClientRect();
            const currentX = gsap.getProperty(letter, 'x') as number || 0;
            const currentY = gsap.getProperty(letter, 'y') as number || 0;

            // 1. Calculate static home coordinates in viewport space
            const homeViewportX = rect.left - currentX;
            const homeViewportY = rect.top - currentY;

            // 2. Set target position in viewport space (bottom-right of cursor, aligned by top-left bounds to prevent overlap)
            const angle = (index / titleText.length) * Math.PI * 2 + (Date.now() * 0.003);
            const radius = 3; // Tight cluster radius
            const targetViewportX = mousePos.current.x + 30 + Math.cos(angle) * radius;
            const targetViewportY = mousePos.current.y + 30 + Math.sin(angle) * radius;

            // 3. Compute relative offsets for GSAP
            const relTargetX = targetViewportX - homeViewportX;
            const relTargetY = targetViewportY - homeViewportY;

            // 4. Interpolate toward target (0.12 factor for smoother trailing lag behind cursor)
            gsap.set(letter, {
              x: currentX + (relTargetX - currentX) * 0.12,
              y: currentY + (relTargetY - currentY) * 0.12,
              rotation: currentX * 0.1,
              scale: 0.9,
              color: '#62909d',
              zIndex: 100,
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

  // Track global mouse position for letters
  const handleContainerMouseMove = (e: React.MouseEvent) => {
    mousePos.current = { x: e.clientX, y: e.clientY };

    // Check if we hover over a letter to "collect" it
    letterRefs.current.forEach((letter, index) => {
      if (!letter || collectedLetters.current.has(index)) return;

      const rect = letter.getBoundingClientRect();
      const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2));

      // Trigger collection if mouse gets very close (within 40px)
      if (dist < 40) {
        collectedLetters.current.add(index);
        setCollectedCount(collectedLetters.current.size);

        // Soundless pop bounce
        gsap.to(letter, {
          scale: 1.3,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
        });
      }
    });
  };

  // Dump letters back when cursor enters the anchor zone
  const handleDumpZoneMouseEnter = () => {
    if (collectedLetters.current.size === 0) return;

    // Return all letters to slots
    letterRefs.current.forEach((letter, index) => {
      if (letter && collectedLetters.current.has(index)) {
        // Explode outward then snap back to original position with stream lag
        const tl = gsap.timeline({ delay: index * 0.05 });
        tl.to(letter, {
          x: '+=random(-30, 30)',
          y: '+=random(-30, 30)',
          rotation: 'random(-90, 90)',
          duration: 0.2,
          ease: 'power2.out',
        }).to(letter, {
          x: 0,
          y: 0,
          rotation: 0,
          scale: 1,
          color: '#ebf0fa',
          duration: 0.6,
          ease: 'power4.out',
        });
      }
    });

    collectedLetters.current.clear();
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
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-dasi-black-950 pt-20"
    >
      {/* Parallax Layer 1: Background environment */}
      <div
        ref={layerBgRef}
        className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(20,41,82,0.4)_0%,rgba(7,14,29,1)_80%)] opacity-80"
      />

      {/* Background Graphic Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />

      {/* Parallax Layer 2: Midground Game Art */}
      <div
        ref={layerMidRef}
        className="absolute right-0 bottom-0 top-0 w-full md:w-[60%] opacity-25 pointer-events-none select-none z-10 flex items-end justify-end"
      >
        <img
          src="https://dasigames.com/Images/banner_image.webp"
          alt="Game Characters Banner"
          className="h-[80%] max-h-[700px] w-auto object-contain object-bottom select-none pointer-events-none filter drop-shadow-[0_0_50px_rgba(51,102,204,0.15)]"
        />
      </div>

      {/* Parallax Layer 3: Tagline & Interactive content */}
      <div
        ref={layerForeRef}
        className="relative z-20 max-w-7xl mx-auto px-6 w-full flex flex-col items-start justify-center gap-6"
      >
        {/* Playful Interactive Header Alert */}
        {collectedCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-1 bg-dasi-alice-950/40 border border-dasi-alice-500/20 rounded-full text-xs font-semibold text-dasi-alice-400 animate-pulse">
            <Sparkles size={12} />
            <span>Carrying {collectedCount} letters! Hover over RELEASE to snap them back!</span>
          </div>
        )}

        {/* Gamified Collectable Title */}
        <h1
          ref={titleRef}
          className="text-5xl md:text-8xl font-black tracking-wider text-dasi-black-50 select-none flex flex-wrap"
        >
          {titleText.split('').map((char, index) => {
            if (char === ' ') return <span key={index} className="w-6 md:w-10">&nbsp;</span>;
            return (
              <span
                key={index}
                ref={(el) => {
                  letterRefs.current[index] = el;
                }}
                className="inline-block cursor-grab active:cursor-grabbing hover:text-dasi-alice-400 select-none duration-75 relative"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {char}
              </span>
            );
          })}
          
          {/* Drop Zone (dashed game box with letter slot icon) */}
          <div
            ref={dumpZoneRef}
            onMouseEnter={handleDumpZoneMouseEnter}
            className={`inline-flex items-center gap-2 ml-4 md:ml-8 px-4 py-2 border-dashed border-2 rounded-xl text-xs font-bold transition-all duration-300 ${
              collectedCount > 0
                ? 'border-dasi-alice-400 text-dasi-alice-400 bg-dasi-alice-950/40 glow-border-cyan scale-105 animate-pulse'
                : 'border-white/10 text-dasi-steel-500 bg-transparent hover:border-white/25'
            }`}
          >
            <svg
              className={`w-4 h-4 transition-all duration-300 ${
                collectedCount > 0 ? 'text-dasi-alice-400 scale-110' : 'text-dasi-steel-500'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m5 15 4-8 4 8M6 13h6" />
              <path d="M2 6V2h4M18 2h4v4M22 18v4h-4M6 22H2v-4" strokeDasharray="1.5 1.5" className="opacity-80" />
            </svg>
            <span>RELEASE</span>
          </div>
        </h1>

        {/* Kinetic Entrance Tagline */}
        <div className="overflow-hidden">
          <p className="text-xl md:text-3xl font-light tracking-wide text-dasi-black-100 flex flex-wrap gap-x-2">
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
          className="max-w-xl text-base text-dasi-steel-400 leading-relaxed font-normal"
        >
          Dasi Games bridges art, logic, and high performance to build addictive mobile, hybrid arcade RPG, and tycoon titles. Partner with us for cutting-edge game development solutions.
        </p>

        {/* CTA Container */}
        <div ref={ctaContainerRef} className="mt-4">
          <button
            ref={ctaBtnRef}
            onClick={handleLetTalkClick}
            className="flex items-center gap-3 px-8 py-4 bg-dasi-black-500 hover:bg-dasi-black-600 text-white font-bold tracking-widest text-sm rounded-lg shadow-xl shadow-dasi-black-800/50 hover:shadow-dasi-black-700/60 transition-all duration-300"
          >
            LET'S TALK
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none opacity-50">
        <span className="text-[10px] tracking-widest text-dasi-steel-500 font-bold uppercase">Scroll to Explore</span>
        <div className="w-[1.5px] h-10 bg-gradient-to-b from-dasi-alice-400 to-transparent animate-pulse" />
      </div>
    </section>
  );
}
