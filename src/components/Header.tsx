'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';

interface Spark {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  opacity: number;
  rotation: number;
  vrot: number;
}

interface NavSlash {
  id: string;
  label: string;
  color: string;
}

function createSparks(clientX: number, clientY: number, currentSparkIdx: number): Spark[] {
  return Array.from({ length: 16 }).map((_, i) => {
    // North-West angles roughly between -165deg and -105deg
    const pAngle = -Math.PI * 0.75 + (Math.random() - 0.5) * (Math.PI * 0.35);
    const speed = 2.5 + Math.random() * 4.5;
    const isDebris = i % 3 === 0;

    return {
      id: `spark-${currentSparkIdx}-${i}`,
      x: clientX,
      y: clientY,
      vx: Math.cos(pAngle) * speed,
      vy: Math.sin(pAngle) * speed - 0.6,
      color: (i % 6 === 0)
        ? 'oklch(0.88 0.04 45.0)' // very subtle, light peach/amber orange spark
        : 'oklch(0.96 0.005 240.0)', // premium slate-white hot spark
      size: isDebris ? (1.5 + Math.random() * 1.2) : (0.8 + Math.random() * 0.8),
      opacity: 1.0,
      rotation: Math.random() * 360,
      vrot: (Math.random() - 0.5) * 12
    };
  });
}

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const pathname = usePathname();
  const router = useRouter();

  // Cyber-Katana States
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isSlashing, setIsSlashing] = useState(false);
  const [slashedLabel, setSlashedLabel] = useState<string | null>(null);
  const [slashes, setSlashes] = useState<NavSlash[]>([]);
  const [sparks, setSparks] = useState<Spark[]>([]);

  // Refs for tracking unique IDs for sparks and slashes inside event handlers
  const slashCounter = useRef(0);
  const sparkCounter = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = ['home', 'portfolio', 'about', 'careers', 'contact'];
    const observerOptions = {
      root: null,
      rootMargin: '-120px 0px -50% 0px', // Header offset and viewport top-half zone
      threshold: 0.05,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Sparks physics calculation animation loop
  useEffect(() => {
    if (sparks.length === 0) return;
    let animationId: number;

    const updateSparks = () => {
      setSparks((prevSparks) =>
        prevSparks
          .map((spark) => ({
            ...spark,
            x: spark.x + spark.vx,
            y: spark.y + spark.vy,
            vy: spark.vy + 0.08,
            rotation: spark.rotation + spark.vrot,
            opacity: spark.opacity - 0.025,
          }))
          .filter((spark) => spark.opacity > 0)
      );
      animationId = requestAnimationFrame(updateSparks);
    };

    updateSparks();
    return () => cancelAnimationFrame(animationId);
  }, [sparks.length]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    if (!isHovering) {
      setIsHovering(true);
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    setIsOpen(false);

    if (pathname !== '/') {
      router.push(`/${targetId}`);
      return;
    }

    const element = document.getElementById(targetId.replace('#', ''));
    if (element) {
      const offset = 30; // Header height offset
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleNavLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: { label: string; href: string }) => {
    // 1. Play swing animation
    setIsSlashing(true);
    setSlashedLabel(link.label);
    
    setTimeout(() => setIsSlashing(false), 450);
    setTimeout(() => setSlashedLabel(null), 500);

    // 2. Spawn slash overlay
    slashCounter.current += 1;
    const newSlash: NavSlash = {
      id: `slash-${slashCounter.current}`,
      label: link.label,
      color: 'rgba(255, 255, 255, 0.9)', // Snow White palette
    };
    setSlashes((prev) => [...prev, newSlash]);
    setTimeout(() => {
      setSlashes((prev) => prev.filter((s) => s.id !== newSlash.id));
    }, 450);

    // 3. Spawn particle sparks
    sparkCounter.current += 1;
    const newSparks = createSparks(e.clientX, e.clientY, sparkCounter.current);
    setSparks((prev) => [...prev, ...newSparks]);

    // 4. Original navigation logic
    handleNavClick(e, link.href);
  };

  const navLinks = [
    { label: 'HOME', href: '#home', id: 'home' },
    { label: 'GAMES', href: '#portfolio', id: 'portfolio' },
    { label: 'ABOUT', href: '#about', id: 'about' },
    { label: 'CAREERS', href: '#careers', id: 'careers' },
    { label: 'CONTACT', href: '#contact', id: 'contact' },
  ];

  const slashClass = (label: string) => (slashedLabel === label ? 'link-slashed-white' : '');

  return (
    <header
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHovering ? 'buzzsaw-cursor-active' : ''
      } ${
        isScrolled
          ? 'bg-carbon-black/90 backdrop-blur-md border-b border-graphite-light py-4 shadow-lg'
          : 'bg-transparent py-6'
      }`}
    >
      <style>{`
        @media (min-width: 768px) {
          .buzzsaw-cursor-active, .buzzsaw-cursor-active * {
            cursor: none !important;
          }
        }
        
        @keyframes sawSpinSlow {
          from { transform: perspective(250px) rotateX(35deg) rotateY(25deg) rotate(60deg); }
          to { transform: perspective(250px) rotateX(35deg) rotateY(25deg) rotate(420deg); }
        }
        .animate-saw-slow {
          animation: sawSpinSlow 12s linear infinite;
        }

        @keyframes sawSlash {
          0% { transform: perspective(250px) rotateX(35deg) rotateY(25deg) rotate(60deg); opacity: 1; }
          10% { transform: perspective(250px) rotateX(40deg) rotateY(30deg) rotate(0deg); }
          30% { transform: perspective(250px) rotateX(55deg) rotateY(15deg) rotate(-480deg); }
          70% { transform: perspective(250px) rotateX(55deg) rotateY(15deg) rotate(-1020deg); }
          100% { transform: perspective(250px) rotateX(35deg) rotateY(25deg) rotate(-1020deg); }
        }
        .animate-saw-slash {
          animation: sawSlash 0.45s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
        }

        /* Horizontal centered split structure (Sliding apart) */
        .split-container {
          position: relative;
          display: inline-block;
        }
        .split-normal {
          display: inline-block;
          opacity: 1;
          transition: opacity 0s;
        }
        .split-top, .split-bottom {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0s, transform 0s;
        }
        .split-top {
          clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        }
        .split-bottom {
          clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
        }
        
        /* Snow White splits ONLY on click active slash */
        .link-slashed-white .split-normal {
          opacity: 0;
          transition: opacity 0s;
        }
        .link-slashed-white .split-top,
        .link-slashed-white .split-bottom {
          opacity: 1;
          transition: opacity 0s;
        }
        .link-slashed-white .split-top {
          transform: translateY(-4px);
          filter: brightness(1.25) drop-shadow(0 0 3.5px rgba(255, 255, 255, 0.85));
          transition: transform 0.38s cubic-bezier(0.19, 1, 0.22, 1), opacity 0s;
        }
        .link-slashed-white .split-bottom {
          transform: translateY(4px);
          filter: brightness(1.25) drop-shadow(0 0 3.5px rgba(255, 255, 255, 0.85));
          transition: transform 0.38s cubic-bezier(0.19, 1, 0.22, 1), opacity 0s;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-2 group">
          <img
            src="https://dasigames.com/Images/low_res_images/dasigames_logo(transparent).png"
            alt="Dasi Games Logo"
            className="h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavLinkClick(e, link)}
              className={`relative group-hover-slash select-none text-xs font-silkscreen tracking-widest transition-all duration-300 py-1 px-2 ${
                activeSection === link.id
                  ? 'text-bright-snow drop-shadow-[0_0_8px_rgba(255,255,255,0.75)] font-bold'
                  : 'text-alabaster-grey hover:text-bright-snow'
              } ${slashClass(link.label)}`}
            >
              <div className="split-container">
                <span className="split-normal">{link.label}</span>
                <span className="split-top" aria-hidden="true">
                  {link.label}
                </span>
                <span className="split-bottom" aria-hidden="true">
                  {link.label}
                </span>
              </div>

              {/* Slash centered horizontal neon streak overlay line */}
              {slashes.map((s) => {
                if (s.label !== link.label) return null;
                return (
                  <div
                    key={s.id}
                    className="absolute inset-x-0 top-1/2 h-[2.5px] pointer-events-none z-20 origin-center"
                    style={{
                      transform: 'translateY(-50%) scaleX(1.15)',
                      boxShadow: `0 0 10px ${s.color}, 0 0 4px #ffffff`,
                      backgroundColor: '#ffffff',
                      animation: 'fadeIn 0.35s ease-out forwards',
                    }}
                  />
                );
              })}
            </a>
          ))}
        </nav>

        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-alabaster-grey hover:text-bright-snow focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed inset-x-0 top-[72px] bg-carbon-black-2/95 backdrop-blur-lg border-b border-graphite-light transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <nav className="flex flex-col px-6 py-8 gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavLinkClick(e, link)}
              className={`relative group-hover-slash select-none text-sm font-silkscreen tracking-widest py-3 border-b border-graphite-light transition-all duration-300 ${
                activeSection === link.id
                  ? 'text-bright-snow drop-shadow-[0_0_8px_rgba(255,255,255,0.75)] font-bold'
                  : 'text-alabaster-grey hover:text-bright-snow'
              } ${slashClass(link.label)}`}
            >
              <div className="split-container">
                <span className="split-normal">{link.label}</span>
                <span className="split-top" aria-hidden="true">
                  {link.label}
                </span>
                <span className="split-bottom" aria-hidden="true">
                  {link.label}
                </span>
              </div>

              {/* Slash centered horizontal neon streak overlay line */}
              {slashes.map((s) => {
                if (s.label !== link.label) return null;
                return (
                  <div
                    key={s.id}
                    className="absolute inset-x-0 top-1/2 h-[2.5px] pointer-events-none z-20 origin-center"
                    style={{
                      transform: 'translateY(-50%) scaleX(1.15)',
                      boxShadow: `0 0 10px ${s.color}, 0 0 4px #ffffff`,
                      backgroundColor: '#ffffff',
                      animation: 'fadeIn 0.35s ease-out forwards',
                    }}
                  />
                );
              })}
            </a>
          ))}
        </nav>
      </div>

      {/* Custom Buzzsaw Cursor rendering */}
      {isHovering && (
        <div
          className="pointer-events-none fixed z-[9999] select-none hidden md:block"
          style={{
            left: `${mousePos.x}px`,
            top: `${mousePos.y}px`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className={isSlashing ? 'animate-saw-slash' : 'animate-saw-slow'}
            style={{
              transformOrigin: '50% 50%',
            }}
          >
            <svg
              viewBox="0 0 100 100"
              width="44"
              height="44"
              className="text-bright-snow filter drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]"
            >
              <circle cx="50" cy="50" r="5" fill="currentColor" />
              <circle cx="50" cy="50" r="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeDasharray="16 10" className="opacity-70" />
              <circle cx="50" cy="34" r="2.5" fill="currentColor" />
              <circle cx="50" cy="66" r="2.5" fill="currentColor" />
              <circle cx="34" cy="50" r="2.5" fill="currentColor" />
              <circle cx="66" cy="50" r="2.5" fill="currentColor" />
              <path
                d="M50 20 L53 30 L63 23 L61 34 L73 31 L67 40 L78 42 L69 49 L77 54 L67 57 L73 66 L61 64 L63 75 L53 68 L50 78 L47 68 L37 75 L39 64 L27 66 L33 57 L23 54 L31 49 L22 42 L33 40 L27 31 L39 34 L37 23 L47 30 Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Dynamic Sparks Rendering */}
      {sparks.map((spark) => {
        const travelAngle = Math.atan2(spark.vy, spark.vx) * (180 / Math.PI);
        return (
          <div
            key={spark.id}
            className="fixed pointer-events-none z-[9999]"
            style={{
              left: `${spark.x}px`,
              top: `${spark.y}px`,
              width: `${spark.size * 2.8}px`,
              height: `${spark.size}px`,
              borderRadius: '9999px',
              backgroundColor: spark.color,
              opacity: spark.opacity,
              boxShadow: `0 0 8px ${spark.color}`,
              transform: `translate(-50%, -50%) rotate(${travelAngle}deg)`,
            }}
          />
        );
      })}
    </header>
  );
}
