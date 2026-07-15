'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Rocket, MapPin, Sparkles, Globe } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const count1Ref = useRef<HTMLSpanElement>(null);
  const count2Ref = useRef<HTMLSpanElement>(null);
  const count3Ref = useRef<HTMLSpanElement>(null);

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

      // 3. Count animation for "5M+ Downloads"
      const obj3 = { val: 0 };
      gsap.to(obj3, {
        val: 5,
        duration: 2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: count3Ref.current,
          start: 'top 85%',
        },
        onUpdate: () => {
          if (count3Ref.current) {
            count3Ref.current.innerText = Math.floor(obj3.val).toString();
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
      className="relative bg-transparent border-t border-graphite-light py-24 px-6 overflow-hidden"
    >
      {/* Background visual element */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-slate-violet/10 rounded-full blur-[120px] pointer-events-none select-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        {/* Title */}
        <div className="text-center mb-16 about-fade-in">
          <span className="text-xs font-silkscreen tracking-widest text-slate-violet-light uppercase flex items-center justify-center gap-2">
            <span>•</span> Our Studio Story
          </span>
          <h2 className="text-3xl md:text-5xl font-normal text-bright-snow tracking-wide mt-2 uppercase font-russo-one retro-heading-shadow">
            About Us
          </h2>
        </div>

        {/* Studio Stat Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16 z-10">
          {/* Left column (1/3 width, md:col-span-1): Large Spotlight Card */}
          <div className="md:col-span-1 p-8 bg-gradient-to-br from-carbon-black to-slate-violet/10 border-2 border-slate-violet rounded-xl flex flex-col justify-between min-h-[320px] shadow-lg shadow-slate-violet/10 about-fade-in transition-all duration-500 ease-out group hover:border-slate-violet-light/30">
            <div className="p-4 bg-carbon-black rounded-xl border border-graphite-light/60 text-platinum-silver w-fit transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105">
              <Globe size={28} />
            </div>
            <div className="transition-transform duration-500 ease-out group-hover:translate-y-1 mt-6">
              <span className="text-[10px] font-silkscreen text-slate-violet-light tracking-widest uppercase">
                Worldwide Impact
              </span>
              <p className="text-4xl md:text-5xl font-normal text-bright-snow tracking-tight font-russo-one mt-2">
                <span className="sr-only">5M+ Downloads</span>
                <span aria-hidden="true">
                  <span ref={count3Ref}>5</span>M+ Downloads
                </span>
              </p>
              <p className="text-xs text-alabaster-grey/70 font-outfit leading-relaxed font-light mt-4">
                A colossal player base downloading and playing our original titles across Google Play and App Store.
              </p>
            </div>
          </div>

          {/* Right columns (2/3 width, md:col-span-2): Vertical stack of standard facts cards */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {/* Card 2: 100+ Games */}
            <div className="flex items-start p-5 bg-carbon-black-2 border border-graphite-light rounded-xl about-fade-in transition-all duration-500 ease-out group hover:border-slate-violet-light/30 gap-5">
              <div className="p-3.5 bg-carbon-black rounded-xl border border-graphite-light/60 text-platinum-silver shrink-0 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105">
                <Rocket size={24} />
              </div>
              <div className="transition-transform duration-500 ease-out group-hover:translate-y-1">
                <p className="text-2xl font-normal text-bright-snow tracking-tight font-russo-one">
                  <span className="sr-only">100+</span>
                  <span aria-hidden="true">
                    <span ref={count1Ref}>100</span>+
                  </span>
                </p>
                <p className="text-[10px] font-silkscreen text-slate-violet-light uppercase tracking-wider mt-0.5">
                  Released Games
                </p>
                <p className="text-xs text-alabaster-grey/60 mt-2 font-outfit font-light leading-relaxed">
                  An extensive portfolio of original titles designed for engagement and replayability.
                </p>
              </div>
            </div>

            {/* Card 3: Based in Tbilisi */}
            <div className="flex items-start p-5 bg-carbon-black-2 border border-graphite-light rounded-xl about-fade-in transition-all duration-500 ease-out group hover:border-slate-violet-light/30 gap-5">
              <div className="p-3.5 bg-carbon-black rounded-xl border border-graphite-light/60 text-platinum-silver shrink-0 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105">
                <MapPin size={24} />
              </div>
              <div className="transition-transform duration-500 ease-out group-hover:translate-y-1">
                <p className="text-2xl font-normal text-bright-snow tracking-tight uppercase font-russo-one">
                  Tbilisi
                </p>
                <p className="text-[10px] font-silkscreen text-slate-violet-light uppercase tracking-wider mt-0.5">
                  Based in Georgia
                </p>
                <p className="text-xs text-alabaster-grey/60 mt-2 font-outfit font-light leading-relaxed">
                  Located in Tbilisi, our creative headquarters serves as our core design and development hub.
                </p>
              </div>
            </div>

            {/* Card 4: Founded Year */}
            <div className="flex items-start p-5 bg-carbon-black-2 border border-graphite-light rounded-xl about-fade-in transition-all duration-500 ease-out group hover:border-slate-violet-light/30 gap-5">
              <div className="p-3.5 bg-carbon-black rounded-xl border border-graphite-light/60 text-platinum-silver shrink-0 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105">
                <Sparkles size={24} />
              </div>
              <div className="transition-transform duration-500 ease-out group-hover:translate-y-1">
                <p className="text-2xl font-normal text-bright-snow tracking-tight font-russo-one">
                  <span className="sr-only">2021</span>
                  <span aria-hidden="true">
                    <span ref={count2Ref}>2021</span>
                  </span>
                </p>
                <p className="text-[10px] font-silkscreen text-slate-violet-light uppercase tracking-wider mt-0.5">
                  Founded Year
                </p>
                <p className="text-xs text-alabaster-grey/60 mt-2 font-outfit font-light leading-relaxed">
                  Crafting memorable interactive experiences since our studio's establishment in 2021.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Narrative Description */}
        <div className="max-w-3xl text-center z-10 about-fade-in">
          <p className="text-base md:text-lg text-alabaster-grey leading-relaxed font-outfit font-light">
            Our journey began with a shared love for gaming and a drive to create exceptional experiences. We develop our own original titles, collaborate with publishers, and offer reliable outsourcing services.
          </p>
          <p className="text-base md:text-lg text-alabaster-grey leading-relaxed font-outfit font-light mt-6">
            We are based in our cozy office in Tbilisi, Georgia. Our team values creativity, technical precision, and a collaborative spirit, ensuring each game we produce is crafted with care and meets international standards.
          </p>
        </div>
      </div>
    </section>
  );
}
