'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('dasi_cookie_consent');
    if (!consent) {
      // Delay showing consent banner slightly for smoother initial load experience
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('dasi_cookie_consent', 'granted');
    setShowBanner(false);
    // Dispatch custom event so telemetry/analytics scripts initialize dynamically
    window.dispatchEvent(new Event('dasi_cookie_consent_updated'));
  };

  const handleNecessaryOnly = () => {
    localStorage.setItem('dasi_cookie_consent', 'necessary_only');
    setShowBanner(false);
    window.dispatchEvent(new Event('dasi_cookie_consent_updated'));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 left-4 md:left-auto md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-500">
      <div className="relative p-5 rounded-2xl bg-carbon-black-2/90 border border-white/10 backdrop-blur-xl shadow-2xl shadow-black/80 flex flex-col gap-4">
        <button
          onClick={handleNecessaryOnly}
          className="absolute top-3 right-3 p-1 text-alabaster-grey/60 hover:text-bright-snow transition-colors"
          aria-label="Dismiss cookie notice"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-slate-violet/20 border border-slate-violet/30 text-slate-violet-light shrink-0">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="flex flex-col gap-1">
            <h4 className="text-sm font-semibold tracking-wide text-bright-snow flex items-center gap-2">
              Cookie & Data Privacy
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </h4>
            <p className="text-xs text-alabaster-grey/80 leading-relaxed">
              We use necessary cookies for studio metrics and telemetry. Choose your privacy preference below.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleAcceptAll}
            className="flex-1 py-2 px-3 text-xs font-semibold text-carbon-black bg-bright-snow hover:bg-white rounded-lg transition-all duration-200 shadow-md hover:scale-[1.02] active:scale-[0.98]"
          >
            Accept All
          </button>
          <button
            onClick={handleNecessaryOnly}
            className="flex-1 py-2 px-3 text-xs font-semibold text-alabaster-grey/90 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-all duration-200 hover:text-bright-snow"
          >
            Necessary Only
          </button>
        </div>
      </div>
    </div>
  );
}
