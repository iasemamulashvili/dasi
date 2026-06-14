'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { loginAction } from '../actions';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);

      const result = await loginAction(null, formData);
      if (result && result.error) {
        setError(result.error);
        setLoading(false);
      }
    } catch (err: any) {
      setError('An unexpected error occurred.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dasi-black-950 flex flex-col justify-center items-center px-6 py-12 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute w-[500px] h-[500px] bg-dasi-alice-950/20 rounded-full blur-[120px] pointer-events-none select-none z-0" />

      {/* Back to Home Link */}
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-bold tracking-widest text-dasi-steel-500 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} />
        BACK TO SITE
      </Link>

      {/* Login Card */}
      <div className="w-full max-w-md bg-dasi-black-900 border border-white/5 rounded-2xl p-8 glass-panel z-10 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="p-4 bg-dasi-ink-900 border border-white/5 text-dasi-alice-400 rounded-2xl glow-border-cyan">
            <Terminal size={32} />
          </div>
          <h1 className="text-2xl font-black text-white tracking-widest text-center uppercase">
            ADMIN CONSOLE
          </h1>
          <p className="text-xs text-dasi-steel-500 tracking-wider uppercase">
            Dasi Games Content Manager
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-rose-950/40 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Authentication Failed</p>
              <p className="text-rose-500/80 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Username */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dasi-steel-500">
                <User size={16} />
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="w-full pl-12 pr-4 py-3 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400 transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold tracking-widest text-dasi-steel-400 uppercase">
              Password
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-dasi-steel-500">
                <Lock size={16} />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-12 pr-4 py-3 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400 transition-colors"
              />
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-dasi-black-500 hover:bg-dasi-black-600 disabled:bg-dasi-black-800 text-white font-bold tracking-widest text-sm rounded-xl transition-all shadow-lg shadow-dasi-black-950/40 mt-4 cursor-pointer"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>
        </form>
      </div>

      <p className="mt-8 text-[10px] tracking-widest text-dasi-steel-600 uppercase select-none">
        Secure Encryption System
      </p>
    </div>
  );
}
