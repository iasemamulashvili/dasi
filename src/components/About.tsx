'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, MapPin, Sparkles } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const count1Ref = useRef<HTMLSpanElement>(null);
  const count2Ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Count animation for "100+ Games"
      const obj1 = { val: 0 };
      gsap.to(obj1, {
        val: 100,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: count1Ref.current,
          start: 'top 85%',
        },
        onUpdate: () => {
          if (count1Ref.current) {
            count1Ref.current.innerText = Math.floor(obj1.val).toString();
          }
        },
      });

      // 2. Count animation for "Founded in 2021"
      const obj2 = { val: 0 };
      gsap.to(obj2, {
        val: 2021,
        duration: 2.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: count2Ref.current,
          start: 'top 85%',
        },
        onUpdate: () => {
          if (count2Ref.current) {
            count2Ref.current.innerText = Math.floor(obj2.val).toString();
          }
        },
      });

      // Subtle section entry fade in
      gsap.fromTo(
        '.about-fade-in',
        { opacity: 0, y: 45 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative bg-dasi-black-950 border-t border-white/5 py-24 px-6 overflow-hidden"
    >
      {/* Background visual element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-dasi-alice-950/20 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-16 about-fade-in">
          <span className="text-xs font-bold tracking-widest text-dasi-alice-400 uppercase flex items-center justify-center gap-2">
            <span>•</span> OUR STUDIO STORY
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-wide mt-2 uppercase">
            ABOUT US
          </h2>
        </div>

        {/* Studio Stat Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-16 z-10">
          {/* Card 1: 100+ Games */}
          <div className="flex flex-col items-center justify-center p-8 bg-dasi-black-900 border border-white/5 rounded-2xl glass-panel glass-panel-hover text-center about-fade-in transition-all">
            <div className="p-4 bg-dasi-ink-900 rounded-full border border-white/5 text-dasi-alice-400 mb-4">
              <Rocket size={28} />
            </div>
            <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
              <span ref={count1Ref}>0</span>+
            </p>
            <p className="text-xs font-bold tracking-wider text-dasi-steel-400 mt-2 uppercase">
              Released Games
            </p>
          </div>

          {/* Card 2: Based in Tbilisi */}
          <div className="flex flex-col items-center justify-center p-8 bg-dasi-black-900 border border-white/5 rounded-2xl glass-panel glass-panel-hover text-center about-fade-in transition-all">
            <div className="p-4 bg-dasi-ink-900 rounded-full border border-white/5 text-dasi-alice-400 mb-4">
              <MapPin size={28} />
            </div>
            <p className="text-3xl md:text-4xl font-black text-white tracking-tight uppercase">
              Tbilisi
            </p>
            <p className="text-xs font-bold tracking-wider text-dasi-steel-400 mt-2 uppercase">
              Based in Georgia
            </p>
          </div>

          {/* Card 3: Founded 2021 */}
          <div className="flex flex-col items-center justify-center p-8 bg-dasi-black-900 border border-white/5 rounded-2xl glass-panel glass-panel-hover text-center about-fade-in transition-all">
            <div className="p-4 bg-dasi-ink-900 rounded-full border border-white/5 text-dasi-alice-400 mb-4">
              <Sparkles size={28} />
            </div>
            <p className="text-4xl md:text-5xl font-black text-white tracking-tight">
              <span ref={count2Ref}>0</span>
            </p>
            <p className="text-xs font-bold tracking-wider text-dasi-steel-400 mt-2 uppercase">
              Founded Year
            </p>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="max-w-3xl text-center z-10 about-fade-in">
          <p className="text-base md:text-lg text-dasi-steel-300 leading-relaxed font-light">
            Our journey began with a shared love for gaming and a drive to create exceptional experiences. We develop our own original titles, collaborate with publishers, and offer reliable outsourcing services.
          </p>
          <p className="text-base md:text-lg text-dasi-steel-300 leading-relaxed font-light mt-6">
            We are based in our cozy office in Tbilisi, Georgia. Our team values creativity, technical precision, and a collaborative spirit, ensuring each game we produce is crafted with care and meets international standards.
          </p>
        </div>
      </div>
    </section>
  );
}
