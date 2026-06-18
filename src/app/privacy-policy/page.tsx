import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <Shield size={24} />
          </div>
          <h1 className="text-xl font-black text-white tracking-widest uppercase">
            Privacy Policy
          </h1>
        </div>

        <div className="flex flex-col gap-6 text-sm leading-relaxed font-light text-dasi-steel-400">
          <p>
            Last Updated: June 18, 2026
          </p>
          <p>
            At Dasi Games, we are committed to protecting the privacy of our website visitors and the users of our mobile applications. This privacy policy explains what information we collect, how we use it, and how we protect your personal data.
          </p>

          <h2 className="text-sm font-bold text-white tracking-widest uppercase mt-4 border-b border-white/5 pb-1">
            1. Information We Collect
          </h2>
          <p>
            When you contact us using our website forms or apply for job postings, we collect your name, email address, subject, message contents, and any attachments (such as your CV/resume).
          </p>

          <h2 className="text-sm font-bold text-white tracking-widest uppercase mt-4 border-b border-white/5 pb-1">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information we collect to respond to your inquiries, process your job applications, and improve our services. We do not sell or share your personal information with third parties for marketing purposes.
          </p>

          <h2 className="text-sm font-bold text-white tracking-widest uppercase mt-4 border-b border-white/5 pb-1">
            3. Data Security
          </h2>
          <p>
            We implement security measures to protect your personal information from unauthorized access, alteration, or disclosure. All data submitted via our forms is transmitted securely.
          </p>

          <h2 className="text-sm font-bold text-white tracking-widest uppercase mt-4 border-b border-white/5 pb-1">
            4. Contact Us
          </h2>
          <p>
            If you have any questions or concerns about this privacy policy or how we handle your personal data, please contact us at info@dasigames.com.
          </p>
        </div>
      </div>
    </div>
  );
}
