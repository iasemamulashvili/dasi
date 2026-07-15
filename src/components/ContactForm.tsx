'use client';

import { useState, useEffect } from 'react';
import { Send, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
}

interface Settings {
  contactEmail: string;
  showStatsBox?: boolean;
  uploadRequirements?: {
    [category: string]: {
      allowed: string[];
      required: string[];
    };
  };
}

interface ContactFormProps {
  jobs?: Job[];
  settings?: Settings;
}

const UPLOAD_LABELS: { [key: string]: { label: string; placeholder: string; accept: string } } = {
  cv: { 
    label: 'Curriculum Vitae (CV)', 
    placeholder: 'Upload your CV / Resume', 
    accept: '.pdf,.doc,.docx' 
  },
  portfolio: { 
    label: 'Portfolio Document', 
    placeholder: 'Upload your Portfolio document', 
    accept: '.pdf,.doc,.docx' 
  },
  art3d: { 
    label: '3D Artwork / Demo', 
    placeholder: 'Upload 3D models or art samples', 
    accept: '.zip,.rar,.pdf,.png,.jpg,.jpeg' 
  },
  pitchdeck: { 
    label: 'Pitch Deck / GDD', 
    placeholder: 'Upload Pitch Deck or GDD', 
    accept: '.pdf,.ppt,.pptx,.zip' 
  }
};

const containerVariants = {
  hidden: {
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: '-0.75rem',
    marginBottom: '-0.75rem',
    opacity: 0,
    borderWidth: 0,
    transition: {
      height: { type: 'spring' as const, stiffness: 300, damping: 30 },
      paddingTop: { duration: 0.2 },
      paddingBottom: { duration: 0.2 },
      marginTop: { duration: 0.2 },
      marginBottom: { duration: 0.2 },
      opacity: { duration: 0.15 },
      borderWidth: { duration: 0.15 },
      when: 'afterChildren',
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  },
  visible: {
    height: 'auto',
    paddingTop: '1rem',
    paddingBottom: '1rem',
    marginTop: '0rem',
    marginBottom: '0rem',
    opacity: 1,
    borderWidth: 1,
    transition: {
      height: { type: 'spring' as const, stiffness: 300, damping: 30 },
      paddingTop: { type: 'spring' as const, stiffness: 300, damping: 30 },
      paddingBottom: { type: 'spring' as const, stiffness: 300, damping: 30 },
      marginTop: { type: 'spring' as const, stiffness: 300, damping: 30 },
      marginBottom: { type: 'spring' as const, stiffness: 300, damping: 30 },
      opacity: { duration: 0.25 },
      borderWidth: { duration: 0.2 },
      staggerChildren: 0.08,
      delayChildren: 0.05
    }
  },
  exit: {
    height: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginTop: '-0.75rem',
    marginBottom: '-0.75rem',
    opacity: 0,
    borderWidth: 0,
    transition: {
      height: { type: 'spring' as const, stiffness: 300, damping: 30 },
      paddingTop: { duration: 0.2 },
      paddingBottom: { duration: 0.2 },
      marginTop: { duration: 0.2 },
      marginBottom: { duration: 0.2 },
      opacity: { duration: 0.15 },
      borderWidth: { duration: 0.15 },
      when: 'afterChildren',
      staggerChildren: 0.05,
      staggerDirection: -1
    }
  }
};

const childVariants = {
  hidden: { opacity: 0, y: 8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring' as const,
      stiffness: 250,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    y: 6,
    scale: 0.98,
    transition: {
      duration: 0.2
    }
  }
};

export default function ContactForm({ jobs = [], settings }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Native input event listener to capture subject change triggered by other components (e.g. Careers 'Apply Now')
  useEffect(() => {
    const subjectInput = document.getElementById('subject');
    if (!subjectInput) return;

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLSelectElement;
      setFormData((prev) => ({ ...prev, subject: target.value }));
      setUploadedFiles({}); // Reset files when subject changes
    };

    subjectInput.addEventListener('input', handleNativeInput);
    subjectInput.addEventListener('change', handleNativeInput);
    return () => {
      subjectInput.removeEventListener('input', handleNativeInput);
      subjectInput.removeEventListener('change', handleNativeInput);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'subject') {
      setUploadedFiles({}); // Reset uploaded files on subject change
    }
  };

  const handleFileChange = (fieldId: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [fieldId]: file }));
  };

  // Helper to determine active upload rules based on subject configuration
  const getUploadConfig = () => {
    const subject = formData.subject;
    if (!subject) return { allowed: [], required: [] };

    if (settings?.uploadRequirements?.[subject]) {
      return settings.uploadRequirements[subject];
    }

    // Default fallback rules
    if (subject.startsWith('Job Application')) {
      return {
        allowed: ['cv', 'portfolio'],
        required: ['cv']
      };
    }
    return { allowed: [], required: [] };
  };

  const uploadConfig = getUploadConfig();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Client-side validation for required file fields
    const missingFields = uploadConfig.required.filter((typeId) => !uploadedFiles[typeId]);
    if (missingFields.length > 0) {
      setSubmitStatus('error');
      setErrorMessage(`Please upload the required file(s): ${missingFields.map((f) => UPLOAD_LABELS[f]?.label || f.toUpperCase()).join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('subject', formData.subject);
      data.append('message', formData.message);

      // Append all configured files
      uploadConfig.allowed.forEach((typeId) => {
        const file = uploadedFiles[typeId];
        if (file) {
          data.append(`file_${typeId}`, file);
        }
      });

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
      setUploadedFiles({});
    } catch (err: any) {
      console.error(err);
      setSubmitStatus('error');
      setErrorMessage(err.message || 'Failed to send message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Dynamic dropdown subjects list
  const subjectsList = [
    'General Inquiry',
    'Business Partnership',
    'Job Application - Other',
    ...jobs.map((job) => `Job Application - ${job.title}`)
  ];

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

            {/* Subject Dropdown */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="subject" className="text-xs font-silkscreen tracking-wider text-alabaster-grey uppercase">
                Subject
              </label>
              <div className="relative">
                <select
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-carbon-black border border-graphite-light rounded-none text-sm text-bright-snow focus:outline-none focus:border-platinum-silver transition-colors font-outfit cursor-pointer appearance-none"
                >
                  <option value="" disabled>Select a subject</option>
                  {subjectsList.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-alabaster-grey/70">
                  ▼
                </div>
              </div>
            </div>

            {/* Conditional File Uploads Grid */}
            <AnimatePresence>
              {uploadConfig.allowed.length > 0 && (
                <motion.div
                  key="upload-dropzones-container"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-4 bg-carbon-black/50 border-solid border-graphite-light/35 overflow-hidden px-4"
                  style={{ originY: 0 }}
                >
                  <span className="text-[10px] font-silkscreen tracking-wider text-platinum-silver uppercase">
                    Required Documents
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {uploadConfig.allowed.map((typeId) => {
                      const spec = UPLOAD_LABELS[typeId] || { label: typeId.toUpperCase(), placeholder: 'Upload file', accept: '*/*' };
                      const isRequired = uploadConfig.required.includes(typeId);
                      const currentFile = uploadedFiles[typeId];
                      const isUploaded = !!currentFile;
                      
                      return (
                        <motion.div
                          key={typeId}
                          variants={childVariants}
                          className="flex flex-col gap-1.5"
                        >
                          <span className="text-[9px] font-silkscreen tracking-wider text-alabaster-grey uppercase flex items-center gap-1">
                            <span>{spec.label}</span>
                            {isRequired && <span className="text-rose-500">*</span>}
                          </span>
                          <motion.label
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            className={`w-full flex flex-col items-center justify-center border border-dashed rounded-none px-3 py-4 cursor-pointer transition-all duration-300 focus-within:ring-2 focus-within:ring-slate-violet-light/50 focus-within:outline-none ${
                              isUploaded
                                ? 'border-muted-green bg-muted-green/5 hover:border-muted-green-light hover:bg-muted-green/10'
                                : 'border-graphite-light bg-carbon-black hover:border-platinum-silver hover:bg-carbon-black-2'
                            }`}
                          >
                            <Upload
                              size={14}
                              className={`mb-1.5 transition-colors duration-300 ${
                                isUploaded ? 'text-muted-green' : 'text-alabaster-grey/40'
                              }`}
                            />
                            <span
                              className={`text-[10px] text-center truncate max-w-full px-2 font-light font-outfit transition-colors duration-300 ${
                                isUploaded ? 'text-muted-green-light font-medium' : 'text-alabaster-grey'
                              }`}
                            >
                              {currentFile ? currentFile.name : spec.placeholder}
                            </span>
                            <span className="text-[8px] text-alabaster-grey/40 font-outfit mt-0.5">
                              Allowed formats: {spec.accept}
                            </span>
                            <input
                              type="file"
                              id={`file-${typeId}`}
                              accept={spec.accept}
                              onChange={(e) => {
                                if (e.target.files && e.target.files.length > 0) {
                                  handleFileChange(typeId, e.target.files[0]);
                                } else {
                                  handleFileChange(typeId, null);
                                }
                              }}
                              className="sr-only"
                            />
                          </motion.label>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

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
