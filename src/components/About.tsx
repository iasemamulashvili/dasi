'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Globe, 
  Rocket, 
  MapPin, 
  Sparkles, 
  Heart, 
  Trophy, 
  Users, 
  Zap, 
  Flame, 
  Gamepad 
} from 'lucide-react';
import { AboutSettings } from '@/utils/db';

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  aboutData: AboutSettings;
}

export default function About({ aboutData }: AboutProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Dynamic count animation for numeric cards
      const countElements = document.querySelectorAll<HTMLElement>('.count-number');
      countElements.forEach((el) => {
        const targetStr = el.getAttribute('data-target') || '0';
        const target = parseFloat(targetStr);
        if (isNaN(target)) return;

        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
          },
          onUpdate: () => {
            el.innerText = Math.floor(obj.val).toString();
          },
        });
      });

      // 2. Subtle section entry fade in
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
  }, [aboutData]);

  const getIcon = (key: string, size = 24) => {
    switch (key) {
      case 'Globe': return <Globe size={size} />;
      case 'Rocket': return <Rocket size={size} />;
      case 'MapPin': return <MapPin size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'Heart': return <Heart size={size} />;
      case 'Trophy': return <Trophy size={size} />;
      case 'Users': return <Users size={size} />;
      case 'Zap': return <Zap size={size} />;
      case 'Flame': return <Flame size={size} />;
      case 'Gamepad': return <Gamepad size={size} />;
      default: return <Globe size={size} />;
    }
  };

  const spotlightCard = aboutData.cards[0];
  const listCards = aboutData.cards.slice(1);

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
            <span>•</span> {aboutData.subtitle}
          </span>
          <h2 className="text-3xl md:text-5xl font-normal text-bright-snow tracking-wide mt-2 uppercase font-russo-one retro-heading-shadow">
            {aboutData.title}
          </h2>
        </div>

        {/* Studio Stat Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mb-16 z-10">
          {/* Left column (1/3 width, md:col-span-1): Large Spotlight Card */}
          {spotlightCard && (
            <div className="md:col-span-1 p-8 bg-gradient-to-br from-carbon-black to-slate-violet/10 border-2 border-slate-violet rounded-xl flex flex-col justify-between min-h-[320px] shadow-lg shadow-slate-violet/10 about-fade-in transition-all duration-500 ease-out group hover:border-slate-violet-light/30">
              <div className="p-4 bg-carbon-black rounded-xl border border-graphite-light/60 text-platinum-silver w-fit transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105">
                {spotlightCard.iconType === 'custom' && spotlightCard.customIconUrl ? (
                  <img src={spotlightCard.customIconUrl} alt={spotlightCard.metricLabel} className="w-7 h-7 object-contain" />
                ) : (
                  getIcon(spotlightCard.defaultIconKey, 28)
                )}
              </div>
              <div className="transition-transform duration-500 ease-out group-hover:translate-y-1 mt-6">
                <span className="text-[10px] font-silkscreen text-slate-violet-light tracking-widest uppercase">
                  {spotlightCard.subtitle}
                </span>
                <p className="text-4xl md:text-5xl font-normal text-bright-snow tracking-tight font-russo-one mt-2">
                  <span className="sr-only">{spotlightCard.metricValue} {spotlightCard.metricLabel}</span>
                  <span aria-hidden="true">
                    {isNaN(parseFloat(spotlightCard.metricValue)) ? (
                      spotlightCard.metricValue
                    ) : (
                      <>
                        <span className="count-number" data-target={spotlightCard.metricValue}>0</span>
                        {" "}
                        {spotlightCard.metricLabel}
                      </>
                    )}
                  </span>
                </p>
                <p className="text-xs text-alabaster-grey/70 font-outfit leading-relaxed font-light mt-4">
                  {spotlightCard.description}
                </p>
              </div>
            </div>
          )}

          {/* Right columns (2/3 width, md:col-span-2): Vertical stack of standard facts cards */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {listCards.map((card) => (
              <div key={card.id} className="flex items-start p-5 bg-carbon-black-2 border border-graphite-light rounded-xl about-fade-in transition-all duration-500 ease-out group hover:border-slate-violet-light/30 gap-5">
                <div className="p-3.5 bg-carbon-black rounded-xl border border-graphite-light/60 text-platinum-silver shrink-0 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105">
                  {card.iconType === 'custom' && card.customIconUrl ? (
                    <img src={card.customIconUrl} alt={card.metricLabel} className="w-6 h-6 object-contain" />
                  ) : (
                    getIcon(card.defaultIconKey, 24)
                  )}
                </div>
                <div className="transition-transform duration-500 ease-out group-hover:translate-y-1">
                  <p className="text-2xl font-normal text-bright-snow tracking-tight font-russo-one">
                    <span className="sr-only">{card.metricValue} {card.subtitle}</span>
                    <span aria-hidden="true">
                      {isNaN(parseFloat(card.metricValue)) ? (
                        card.metricValue
                      ) : (
                        <>
                          <span className="count-number" data-target={card.metricValue}>0</span>
                          {card.metricLabel && (
                            <>
                              {" "}
                              {card.metricLabel}
                            </>
                          )}
                        </>
                      )}
                    </span>
                  </p>
                  <p className="text-[10px] font-silkscreen text-slate-violet-light uppercase tracking-wider mt-0.5">
                    {card.subtitle}
                  </p>
                  <p className="text-xs text-alabaster-grey/60 mt-2 font-outfit font-light leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Narrative Description */}
        <div className="max-w-3xl text-center z-10 about-fade-in">
          {aboutData.paragraphs.map((para, pIdx) => (
            <p key={pIdx} className={`text-base md:text-lg text-alabaster-grey leading-relaxed font-outfit font-light ${pIdx > 0 ? 'mt-6' : ''}`}>
              {para}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
