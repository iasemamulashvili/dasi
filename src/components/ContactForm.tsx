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
    <section id="contact" className="bg-transparent border-t border-graphite-light py-24 px-6 relative">
      <div className="max-w-xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-silkscreen tracking-widest text-slate-violet-light uppercase flex items-center justify-center gap-2">
            <span>•</span> Get in Touch
          </span>
          <h2 className="text-3xl md:text-5xl font-normal text-bright-snow tracking-wide mt-2 uppercase font-russo-one retro-heading-shadow">
            Contact Us
          </h2>
          <p className="text-sm text-alabaster-grey mt-4 font-outfit font-light">
            Have a game project, outsourcing request, or general question? Drop us a line!
          </p>
        </div>

        {/* Form panel */}
        <div className="inset-pixel-card p-8 relative z-10">
          {/* 8-Bit Corner Pixel Blocks */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-graphite-light z-30" />
          <div className="absolute top-0 right-0 w-2 h-2 bg-graphite-light z-30" />
          <div className="absolute bottom-0 left-0 w-2 h-2 bg-graphite-light z-30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-graphite-light z-30" />

          {submitStatus === 'success' && (
            <div className="mb-6 p-4 bg-carbon-black border border-muted-green text-muted-green rounded-none flex items-start gap-3">
              <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-silkscreen text-xs uppercase">Message Sent Successfully!</p>
                <p className="text-xs text-muted-green-light mt-1 font-outfit font-light">
                  Thank you for reaching out. We will get back to you shortly.
                </p>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="mb-6 p-4 bg-carbon-black border border-red-500/35 text-red-400 rounded-none flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-silkscreen text-xs uppercase">Submission Failed</p>
                <p className="text-xs text-red-400/80 mt-1 font-outfit font-light">{errorMessage}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs font-silkscreen tracking-wider text-alabaster-grey uppercase">
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
                className="w-full px-4 py-3 bg-carbon-black border border-graphite-light rounded-none text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-platinum-silver transition-colors font-outfit"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs font-silkscreen tracking-wider text-alabaster-grey uppercase">
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
                className="w-full px-4 py-3 bg-carbon-black border border-graphite-light rounded-none text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-platinum-silver transition-colors font-outfit"
              />
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-xs font-silkscreen tracking-wider text-alabaster-grey uppercase">
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
                className="w-full px-4 py-3 bg-carbon-black border border-graphite-light rounded-none text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-platinum-silver transition-colors font-outfit"
              />
            </div>

            {/* Resume / Attachment */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-silkscreen tracking-wider text-alabaster-grey uppercase">
                CV / Resume (Optional)
              </label>
              <label className="w-full flex flex-col items-center justify-center border-2 border-dashed border-graphite-light bg-carbon-black rounded-none px-4 py-6 cursor-pointer hover:border-platinum-silver transition-colors">
                <Upload size={20} className="text-alabaster-grey/50 mb-2" />
                <span className="text-xs text-alabaster-grey font-outfit">
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
              <label htmlFor="message" className="text-xs font-silkscreen tracking-wider text-alabaster-grey uppercase">
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
                className="w-full px-4 py-3 bg-carbon-black border border-graphite-light rounded-none text-sm text-bright-snow placeholder-alabaster-grey/40 focus:outline-none focus:border-platinum-silver transition-colors resize-none font-outfit"
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="inset-pixel-btn-primary mt-2 w-full py-4 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
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
