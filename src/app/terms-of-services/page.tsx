import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfServicesPage() {
  return (
    <div className="min-h-screen bg-dasi-black-950 text-dasi-steel-300 flex flex-col justify-center items-center px-6 py-16 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-dasi-alice-950/10 rounded-full blur-[120px] pointer-events-none select-none z-0" />

      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold tracking-widest text-dasi-steel-500 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        BACK TO SITE
      </Link>

      <div className="w-full max-w-2xl bg-dasi-black-900 border border-white/5 rounded-2xl p-8 md:p-12 glass-panel z-10 shadow-2xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-dasi-ink-900 border border-white/5 text-dasi-alice-400 rounded-xl">
            <FileText size={24} />
          </div>
          <h1 className="text-xl font-black text-white tracking-widest uppercase">
            Terms of Services
          </h1>
        </div>

        <div className="flex flex-col gap-6 text-sm leading-relaxed font-light text-dasi-steel-400">
          <p>
            Last Updated: June 18, 2026
          </p>
          <p>
            Welcome to the Dasi Games website. By accessing or using our website, you agree to comply with and be bound by the following terms of services. Please review these terms carefully before browsing.
          </p>

          <h2 className="text-sm font-bold text-white tracking-widest uppercase mt-4 border-b border-white/5 pb-1">
            1. Use of Content
          </h2>
          <p>
            All materials on this website, including game artwork, titles, text descriptions, layout elements, and code are the intellectual property of Dasi Games. You may not copy, distribute, or modify any content without our express written consent.
          </p>

          <h2 className="text-sm font-bold text-white tracking-widest uppercase mt-4 border-b border-white/5 pb-1">
            2. Job Applications
          </h2>
          <p>
            When applying for job listings through this website, you agree to provide accurate, complete, and truthful information, including your CV and portfolio links.
          </p>

          <h2 className="text-sm font-bold text-white tracking-widest uppercase mt-4 border-b border-white/5 pb-1">
            3. Disclaimer
          </h2>
          <p>
            This website and its content are provided on an "as is" basis without warranties of any kind. While we strive to maintain accurate information and store functionality, we do not guarantee uninterrupted access or error-free operations.
          </p>

          <h2 className="text-sm font-bold text-white tracking-widest uppercase mt-4 border-b border-white/5 pb-1">
            4. Changes to Terms
          </h2>
          <p>
            We reserve the right to modify these terms of services at any time. Your continued use of the website after changes are posted constitutes your acceptance of the updated terms.
          </p>
        </div>
      </div>
    </div>
  );
}
