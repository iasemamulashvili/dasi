'use client';

import { useState } from 'react';
import { Send, Upload, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('subject', formData.subject);
      data.append('message', formData.message);
      if (file) {
        data.append('file', file);
      }

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || 'Something went wrong');
      }

      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setFile(null);
    } catch (err: any) {
      console.error(err);
      setSubmitStatus('error');
      setErrorMessage(err.message || 'Failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="bg-dasi-black-950 border-t border-white/5 py-24 px-6 relative">
      <div className="max-w-xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-dasi-alice-400 uppercase flex items-center justify-center gap-2">
            <span>•</span> GET IN TOUCH
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-wide mt-2 uppercase">
            CONTACT US
          </h2>
          <p className="text-sm text-dasi-steel-400 mt-4">
            Have a game project, outsourcing request, or general question? Drop us a line!
          </p>
        </div>

        {/* Form panel */}
        <div className="glass-panel p-8 rounded-2xl border border-white/5 relative z-10">
          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-start gap-3">
              <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Message Sent Successfully!</p>
                <p className="text-xs text-emerald-500/80 mt-1">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-rose-950/40 border border-rose-500/20 text-rose-400 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm">Submission Failed</p>
                <p className="text-xs text-rose-500/80 mt-1">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-bold tracking-wider text-dasi-steel-400 uppercase">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400 transition-colors"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-bold tracking-wider text-dasi-steel-400 uppercase">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400 transition-colors"
              />
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-xs font-bold tracking-wider text-dasi-steel-400 uppercase">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="Game development partnership"
                className="w-full px-4 py-3 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400 transition-colors"
              />
            </div>

            {/* Resume / Attachment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-wider text-dasi-steel-400 uppercase">
                CV / Resume (Optional)
              </label>
              <label className="w-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-xl px-4 py-6 cursor-pointer hover:border-dasi-alice-400 transition-colors bg-dasi-ink-950/30">
                <Upload size={20} className="text-dasi-steel-500 mb-2" />
                <span className="text-xs text-dasi-steel-400">
                  {file ? file.name : 'Click to upload CV (PDF/Doc)'}
                </span>
                <input
                  type="file"
                  id="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Message */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs font-bold tracking-wider text-dasi-steel-400 uppercase">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project or application..."
                className="w-full px-4 py-3 bg-dasi-ink-950/60 border border-white/5 rounded-xl text-sm text-white placeholder-dasi-steel-600 focus:outline-none focus:border-dasi-alice-400 transition-colors resize-none"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex items-center justify-center gap-2 w-full py-4 bg-dasi-black-500 hover:bg-dasi-black-600 disabled:bg-dasi-black-800 text-white font-bold tracking-widest text-sm rounded-xl transition-all shadow-lg shadow-dasi-black-950/40"
            >
              {isSubmitting ? (
                <span>SENDING...</span>
              ) : (
                <>
                  <span>SEND MESSAGE</span>
                  <Send size={14} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
