'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, Upload, CheckCircle2, AlertCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JobUploadField {
  id: string;
  label: string;
  placeholder: string;
  accept: string;
  isRequired: boolean;
  type?: 'file' | 'url' | 'both';
}

interface Job {
  id: string;
  title: string;
  location: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  customUploads?: JobUploadField[];
  iconType?: 'default' | 'custom';
  icon?: string;
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
  const [uploadedUrls, setUploadedUrls] = useState<{ [key: string]: string }>({});
  const [activeUploadModes, setActiveUploadModes] = useState<{ [key: string]: 'file' | 'url' }>({});
  const [errorMessage, setErrorMessage] = useState('');

  // States for custom dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Dynamic dropdown subjects list
  const subjectsList = [
    'General Inquiry',
    'Business Partnership',
    'Job Application - Other',
    ...jobs.map((job) => `Job Application - ${job.title}`)
  ];

  // Helper to determine active upload fields based on selected subject
  const getUploadFields = (): JobUploadField[] => {
    const subject = formData.subject;
    if (!subject) return [];

    // Check if the subject corresponds to a job application
    if (subject.startsWith('Job Application - ')) {
      const jobTitle = subject.substring('Job Application - '.length);
      const matchingJob = jobs.find((job) => job.title === jobTitle);
      
      // If a matching job has customUploads configured, use them
      if (matchingJob?.customUploads && matchingJob.customUploads.length > 0) {
        return matchingJob.customUploads.map((field) => ({
          id: field.id,
          label: field.label,
          placeholder: field.placeholder,
          accept: field.accept,
          isRequired: field.isRequired,
        }));
      }
    }

    // Settings overrides
    if (settings?.uploadRequirements?.[subject]) {
      const reqs = settings.uploadRequirements[subject];
      return reqs.allowed.map((typeId) => {
        const spec = UPLOAD_LABELS[typeId] || {
          label: typeId.toUpperCase(),
          placeholder: 'Upload file',
          accept: '*/*',
        };
        return {
          id: typeId,
          label: spec.label,
          placeholder: spec.placeholder,
          accept: spec.accept,
          isRequired: reqs.required.includes(typeId),
        };
      });
    }

    // Default fallback rules for any Job Application
    if (subject.startsWith('Job Application')) {
      return [
        {
          id: 'cv',
          label: UPLOAD_LABELS.cv.label,
          placeholder: UPLOAD_LABELS.cv.placeholder,
          accept: UPLOAD_LABELS.cv.accept,
          isRequired: true,
        },
        {
          id: 'portfolio',
          label: UPLOAD_LABELS.portfolio.label,
          placeholder: UPLOAD_LABELS.portfolio.placeholder,
          accept: UPLOAD_LABELS.portfolio.accept,
          isRequired: false,
        },
      ];
    }

    return [];
  };

  const uploadFields = getUploadFields();
  const [activeUploadFields, setActiveUploadFields] = useState<JobUploadField[]>(uploadFields);
  const [isUploadsVisible, setIsUploadsVisible] = useState(uploadFields.length > 0);

  // Sync active upload fields when subject, jobs, or settings change
  useEffect(() => {
    if (uploadFields.length > 0) {
      setActiveUploadFields(uploadFields);
      setIsUploadsVisible(true);
    } else {
      setIsUploadsVisible(false);
      // Wait for collapse transition (500ms) before clearing the active configuration
      const timer = setTimeout(() => {
        setActiveUploadFields([]);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [formData.subject, jobs, settings]);

  // Click outside listener for custom dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Native input event listener to capture subject change triggered by other components (e.g. Careers 'Apply Now')
  useEffect(() => {
    const subjectInput = document.getElementById('subject');
    if (!subjectInput) return;

    const handleNativeInput = (e: Event) => {
      const target = e.target as HTMLSelectElement;
      setFormData((prev) => ({ ...prev, subject: target.value }));
      setUploadedFiles({}); // Reset files when subject changes
      setUploadedUrls({});
      setActiveUploadModes({});
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
      setUploadedUrls({});
      setActiveUploadModes({});
    }
  };

  const handleFileChange = (fieldId: string, file: File | null) => {
    setUploadedFiles((prev) => ({ ...prev, [fieldId]: file }));
  };

  const selectOption = (sub: string) => {
    setFormData((prev) => ({ ...prev, subject: sub }));
    setUploadedFiles({});
    setDropdownOpen(false);
  };

  useEffect(() => {
    const handleSelectSubject = (e: Event) => {
      const customEvent = e as CustomEvent<{ subject: string }>;
      if (customEvent.detail && customEvent.detail.subject) {
        selectOption(customEvent.detail.subject);
      }
    };
    window.addEventListener('dasi-select-subject', handleSelectSubject);
    return () => {
      window.removeEventListener('dasi-select-subject', handleSelectSubject);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!dropdownOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setDropdownOpen(true);
        const currentIndex = subjectsList.indexOf(formData.subject);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev + 1) % subjectsList.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev - 1 + subjectsList.length) % subjectsList.length);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < subjectsList.length) {
          selectOption(subjectsList[highlightedIndex]);
        }
        break;
      case 'Escape':
      case 'Tab':
        setDropdownOpen(false);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Client-side validation for required fields (handling both file uploads and URL inputs)
    const missingFields = uploadFields.filter((f) => {
      if (!f.isRequired) return false;
      const mode = activeUploadModes[f.id] || (f.type === 'url' ? 'url' : 'file');
      if (mode === 'url') {
        return !uploadedUrls[f.id] || !uploadedUrls[f.id].trim();
      } else {
        return !uploadedFiles[f.id];
      }
    });

    if (missingFields.length > 0) {
      setSubmitStatus('error');
      const fieldNames = missingFields.map((f) => {
        const mode = activeUploadModes[f.id] || (f.type === 'url' ? 'url' : 'file');
        return `${f.label} (${mode === 'url' ? 'URL Link' : 'File Upload'})`;
      }).join(', ');
      setErrorMessage(`Please provide the required fields: ${fieldNames}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('email', formData.email);
      data.append('subject', formData.subject);
      data.append('message', formData.message);

      // Append all configured files & URLs
      uploadFields.forEach((field) => {
        const mode = activeUploadModes[field.id] || (field.type === 'url' ? 'url' : 'file');
        if (mode === 'url') {
          const urlVal = uploadedUrls[field.id];
          if (urlVal && urlVal.trim()) {
            data.append(`url_${field.id}`, urlVal.trim());
          }
        } else {
          const file = uploadedFiles[field.id];
          if (file) {
            data.append(`file_${field.id}`, file);
          }
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
      setUploadedUrls({});
      setActiveUploadModes({});
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

            {/* Subject Custom Dropdown */}
            <div className="flex flex-col gap-1.5" ref={dropdownRef}>
              <label className="text-xs font-silkscreen tracking-wider text-alabaster-grey uppercase">
                Subject
              </label>
              
              {/* Hidden select for form submission and native change listeners compatibility */}
              <select
                id="subject"
                name="subject"
                required
                value={formData.subject}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, subject: e.target.value }));
                  setUploadedFiles({});
                }}
                className="sr-only"
                tabIndex={-1}
                aria-hidden="true"
              >
                <option value="" disabled>Select a subject</option>
                {subjectsList.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
              </select>

              <div className="relative">
                {/* Trigger Button */}
                <button
                  type="button"
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  onKeyDown={handleKeyDown}
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    const currentIndex = subjectsList.indexOf(formData.subject);
                    setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
                  }}
                  className="w-full px-4 py-3 bg-carbon-black border border-graphite-light rounded-none text-sm text-left text-bright-snow focus:outline-none focus:border-platinum-silver transition-all duration-200 font-outfit cursor-pointer flex items-center justify-between"
                >
                  <span className={formData.subject ? 'text-bright-snow' : 'text-alabaster-grey/40'}>
                    {formData.subject || 'Select a subject'}
                  </span>
                  <motion.span
                    animate={{ rotate: dropdownOpen ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="text-alabaster-grey/70 text-xs"
                  >
                    ▼
                  </motion.span>
                </button>

                {/* Floating Glassmorphic Options List */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                      role="listbox"
                      data-lenis-prevent="true"
                      onWheel={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                      className="absolute left-0 right-0 mt-1 z-50 max-h-60 overflow-y-auto overscroll-contain bg-carbon-black-2/95 backdrop-blur-xl border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_16px_40px_rgba(0,0,0,0.8)] rounded-none py-1"
                    >
                      {subjectsList.map((sub, index) => {
                        const isSelected = formData.subject === sub;
                        const isHighlighted = highlightedIndex === index;
                        return (
                          <li
                            key={sub}
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => selectOption(sub)}
                            onMouseEnter={() => setHighlightedIndex(index)}
                            className={`px-4 py-2.5 text-sm font-outfit cursor-pointer transition-all duration-150 border-l-2 flex items-center justify-between ${
                              isSelected
                                ? 'bg-slate-violet/40 text-bright-snow border-slate-violet-light font-medium'
                                : isHighlighted
                                ? 'bg-slate-violet/20 text-bright-snow border-slate-violet/50'
                                : 'bg-transparent text-alabaster-grey/80 border-transparent hover:text-bright-snow'
                            }`}
                          >
                            <span>{sub}</span>
                            {isSelected && (
                              <Check size={14} className="text-slate-violet-light" />
                            )}
                          </li>
                        );
                      })}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Conditional File Uploads Grid */}
            <motion.div
              animate={{
                height: isUploadsVisible ? 'auto' : 0,
                opacity: isUploadsVisible ? 1 : 0,
              }}
              transition={{
                height: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
                opacity: { duration: isUploadsVisible ? 0.3 : 0.15, ease: 'linear' }
              }}
              className="overflow-hidden w-full"
              style={{ originY: 0 }}
            >
              <div className="bg-carbon-black/50 border border-solid border-graphite-light/35 p-4 mt-4 flex flex-col gap-4">
                <AnimatePresence initial={false}>
                  {activeUploadFields.length > 0 && (
                    <motion.div
                      key="dropzones-content"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col gap-4 w-full"
                    >
                      <span className="text-[10px] font-silkscreen tracking-wider text-platinum-silver uppercase">
                        Required Documents
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {activeUploadFields.map((field) => {
                          const isRequired = field.isRequired;
                          const currentFile = uploadedFiles[field.id];
                          const isUploaded = !!currentFile;
                          const mode = activeUploadModes[field.id] || (field.type === 'url' ? 'url' : 'file');
                          
                          return (
                            <div
                              key={field.id}
                              className="flex flex-col gap-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] font-silkscreen tracking-wider text-alabaster-grey uppercase flex items-center gap-1">
                                  <span>{field.label}</span>
                                  {isRequired && <span className="text-rose-500">*</span>}
                                </span>
                                
                                {field.type === 'both' && (
                                  <div className="flex gap-1">
                                    <button
                                      type="button"
                                      onClick={() => setActiveUploadModes({ ...activeUploadModes, [field.id]: 'file' })}
                                      className={`px-2 py-0.5 text-[8px] font-semibold border uppercase tracking-wider cursor-pointer rounded-none ${
                                        mode === 'file'
                                          ? 'bg-slate-violet border-slate-violet text-bright-snow'
                                          : 'bg-carbon-black border-graphite-light text-alabaster-grey/50 hover:text-bright-snow'
                                      }`}
                                    >
                                      File
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setActiveUploadModes({ ...activeUploadModes, [field.id]: 'url' })}
                                      className={`px-2 py-0.5 text-[8px] font-semibold border uppercase tracking-wider cursor-pointer rounded-none ${
                                        mode === 'url'
                                          ? 'bg-slate-violet border-slate-violet text-bright-snow'
                                          : 'bg-carbon-black border-graphite-light text-alabaster-grey/50 hover:text-bright-snow'
                                      }`}
                                    >
                                      Link
                                    </button>
                                  </div>
                                )}
                              </div>

                              {mode === 'url' ? (
                                <input
                                  type="url"
                                  value={uploadedUrls[field.id] || ''}
                                  onChange={(e) => setUploadedUrls({ ...uploadedUrls, [field.id]: e.target.value })}
                                  placeholder={field.placeholder || 'https://example.com/link'}
                                  className="w-full px-3 py-4 bg-carbon-black border border-graphite-light rounded-none text-[10px] text-bright-snow placeholder-alabaster-grey/30 focus:outline-none focus:border-slate-violet font-outfit"
                                />
                              ) : (
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
                                    {currentFile ? currentFile.name : field.placeholder}
                                  </span>
                                  <span className="text-[8px] text-alabaster-grey/40 font-outfit mt-0.5">
                                    Allowed formats: {field.accept}
                                  </span>
                                  <input
                                    type="file"
                                    id={`file-${field.id}`}
                                    accept={field.accept}
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files.length > 0) {
                                        handleFileChange(field.id, e.target.files[0]);
                                      } else {
                                        handleFileChange(field.id, null);
                                      }
                                    }}
                                    className="sr-only"
                                  />
                                </motion.label>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

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
