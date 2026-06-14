'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Play, Download } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (e: React.MouseEvent<HTMLButtonElement>, targetId: string) => {
    e.preventDefault();
    if (pathname !== '/') {
      router.push(`/${targetId}`);
      return;
    }

    const element = document.getElementById(targetId.replace('#', ''));
    if (element) {
      const offset = 80;
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

  return (
    <footer className="bg-dasi-black-950 border-t border-white/5 py-16 px-6 text-dasi-steel-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* General / Address */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold tracking-widest text-sm border-b border-dasi-alice-500/10 pb-2 mb-2">
            DASI GAMES
          </h4>
          <p className="text-sm leading-relaxed">
            201 Shalva Nutsubidze Street<br />
            0186 Tbilisi<br />
            Georgia
          </p>
          <div className="flex flex-col gap-2 mt-4 text-xs">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-services" className="hover:text-white transition-colors">
              Terms of Services
            </Link>
          </div>
        </div>

        {/* Sitemap */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold tracking-widest text-sm border-b border-dasi-alice-500/10 pb-2 mb-2">
            SITE MAP
          </h4>
          <div className="flex flex-col items-start gap-2 text-sm">
            <button onClick={(e) => handleNavClick(e, '#home')} className="hover:text-white transition-colors focus:outline-none">
              HOME
            </button>
            <button onClick={(e) => handleNavClick(e, '#games')} className="hover:text-white transition-colors focus:outline-none">
              GAMES
            </button>
            <button onClick={(e) => handleNavClick(e, '#about')} className="hover:text-white transition-colors focus:outline-none">
              ABOUT
            </button>
            <button onClick={(e) => handleNavClick(e, '#careers')} className="hover:text-white transition-colors focus:outline-none">
              CAREER
            </button>
            <button onClick={(e) => handleNavClick(e, '#contact')} className="hover:text-white transition-colors focus:outline-none">
              CONTACT
            </button>
          </div>
        </div>

        {/* Follow Us */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold tracking-widest text-sm border-b border-dasi-alice-500/10 pb-2 mb-2">
            FOLLOW US
          </h4>
          <div className="flex gap-4">
            <a
              href="https://www.linkedin.com/company/dasi-games/mycompany/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-dasi-ink-900 border border-white/5 rounded-lg hover:border-dasi-alice-500 hover:text-white transition-all duration-300"
              aria-label="LinkedIn Profile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
            </a>
            <a
              href="https://www.facebook.com/DasiGames/?_rdr"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-dasi-ink-900 border border-white/5 rounded-lg hover:border-dasi-alice-500 hover:text-white transition-all duration-300"
              aria-label="Facebook Page"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>

        {/* Platforms */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white font-bold tracking-widest text-sm border-b border-dasi-alice-500/10 pb-2 mb-2">
            PLATFORMS
          </h4>
          <div className="flex flex-col gap-3">
            <a
              href="https://play.google.com/store/apps/dev?id=5818328852601157830&hl=en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-dasi-ink-900 border border-white/5 rounded-lg hover:border-dasi-alice-500 hover:text-white transition-all duration-300 group"
            >
              <Play size={18} className="text-dasi-alice-400 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col items-start">
                <span className="text-[10px] tracking-wider text-dasi-steel-500 uppercase">Get it on</span>
                <span className="text-xs font-bold text-white uppercase">Google Play</span>
              </div>
            </a>
            <a
              href="https://apps.apple.com/us/developer/luka-kvirikashvili/id1708577865"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 bg-dasi-ink-900 border border-white/5 rounded-lg hover:border-dasi-alice-500 hover:text-white transition-all duration-300 group"
            >
              <Download size={18} className="text-dasi-alice-400 group-hover:scale-110 transition-transform" />
              <div className="flex flex-col items-start">
                <span className="text-[10px] tracking-wider text-dasi-steel-500 uppercase">Download on the</span>
                <span className="text-xs font-bold text-white uppercase">App Store</span>
              </div>
            </a>
          </div>
        </div>
      </div>
      
      {/* Copyright */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 text-center text-xs text-dasi-steel-500 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>&copy; {new Date().getFullYear()} Dasi Games. All rights reserved.</p>
        <p className="tracking-widest">CRAFTED FOR UNIQUE EXPERIENCE</p>
      </div>
    </footer>
  );
}
