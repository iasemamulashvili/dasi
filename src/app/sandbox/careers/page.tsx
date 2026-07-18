'use client';

import { useState } from 'react';
import { 
  MapPin, 
  Upload, 
  Palette, 
  ArrowLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface MockupField {
  id: string;
  label: string;
  placeholder: string;
  accept: string;
  isRequired: boolean;
  type: 'file' | 'url' | 'both';
}

export default function CareersSandboxPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeModes, setActiveModes] = useState<{ [key: string]: 'file' | 'url' }>({
    portfolio: 'file'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    portfolioUrl: '',
    linkedinUrl: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState<{ [key: string]: File | null }>({});
  
  // Status feedback states
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMsg, setStatusMsg] = useState('');

  const mockupFields: MockupField[] = [
    {
      id: 'resume',
      label: 'Resume / CV',
      placeholder: 'Upload PDF or DOCX up to 5MB',
      accept: '.pdf,.doc,.docx',
      isRequired: true,
      type: 'file'
    },
    {
      id: 'portfolio',
      label: 'Portfolio Reel or link',
      placeholder: 'Link to Vimeo/ArtStation, or PDF up to 10MB',
      accept: '.pdf,.zip,.mp4',
      isRequired: true,
      type: 'both'
    },
    {
      id: 'linkedin',
      label: 'LinkedIn Profile',
      placeholder: 'https://linkedin.com/in/username',
      accept: '',
      isRequired: false,
      type: 'url'
    }
  ];

  const handleFileChange = (fieldId: string, file: File | null) => {
    setUploadedFiles(prev => ({ ...prev, [fieldId]: file }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('idle');

    // Validation
    if (!formData.name.trim() || !formData.email.trim()) {
      setStatus('error');
      setStatusMsg('Name and email are required fields.');
      return;
    }

    // Check required fields
    const missing: string[] = [];
    mockupFields.forEach((field) => {
      if (!field.isRequired) return;

      const mode = activeModes[field.id] || (field.type === 'url' ? 'url' : 'file');
      if (mode === 'url') {
        const val = field.id === 'portfolio' ? formData.portfolioUrl : '';
        if (!val || !val.trim()) {
          missing.push(`${field.label} (URL Link)`);
        }
      } else {
        if (!uploadedFiles[field.id]) {
          missing.push(`${field.label} (File Upload)`);
        }
      }
    });

    if (missing.length > 0) {
      setStatus('error');
      setStatusMsg(`Please satisfy all required fields: ${missing.join(', ')}`);
      return;
    }

    setStatus('success');
    setStatusMsg('Mock application validated successfully! All file/URL combination constraints satisfied.');
  };

  return (
    <div className="min-h-screen bg-carbon-black text-alabaster-grey p-6 font-outfit">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-graphite-light pb-6 mt-4">
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/dashboard" 
              className="p-2.5 bg-carbon-black-2 hover:bg-graphite border border-graphite-light rounded-xl text-bright-snow transition-all"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-bright-snow font-russo-one uppercase tracking-wider">Careers Sandbox Page</h1>
              <p className="text-xs text-slate-violet-light tracking-widest font-silkscreen uppercase mt-1">Mockup Accordion & Input Types Validation</p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-violet/20 border border-slate-violet/30 text-slate-violet-light px-3 py-1 rounded-full font-silkscreen">
            SANDBOX LAB
          </span>
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-br from-carbon-black-2 to-slate-violet/5 border border-graphite-light p-6 rounded-2xl space-y-3">
          <h2 className="text-sm font-bold text-bright-snow font-silkscreen uppercase tracking-wider">Testing Objectives</h2>
          <ul className="list-disc pl-5 text-xs text-alabaster-grey/80 space-y-2">
            <li>
              <strong>Brand Logo Toggle:</strong> The accordion below uses the Dasi Games transparent brand logo as the toggle indicator (with rotation and scale animations) leaving the live arrow indicator untouched.
            </li>
            <li>
              <strong>Custom Field Combinations:</strong> We test three different types of custom fields: Resume (File Upload Only), Portfolio (Either File or URL Toggle), and LinkedIn (URL Input Only).
            </li>
            <li>
              <strong>Interactive Validator:</strong> Expand the listing, toggle between file and link modes, fill in the fields, and click Submit to test the interactive frontend validation logic.
            </li>
          </ul>
        </div>

        {/* Mockup Accordion Listing */}
        <div className="bg-carbon-black-2 border border-graphite-light rounded-2xl overflow-hidden shadow-lg shadow-black/30">
          
          {/* Accordion Header */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer hover:bg-carbon-black/40 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg border transition-colors ${
                isOpen ? 'bg-carbon-black border-slate-violet text-platinum-silver' : 'bg-carbon-black-2 border-graphite-light text-alabaster-grey'
              }`}>
                <Palette size={20} />
              </div>
              <div>
                <h3 className="text-lg font-silkscreen text-bright-snow tracking-wide uppercase">Gameplay Animator (Mockup)</h3>
                <p className="text-xs text-alabaster-grey/70 flex items-center gap-1 mt-1.5 font-light">
                  <MapPin size={12} />
                  Tbilisi, Georgia (On-site / Hybrid)
                </p>
              </div>
            </div>

            {/* Brand Logo Toggle Indicator */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold text-slate-violet-light font-silkscreen hidden sm:inline uppercase">
                {isOpen ? 'Click to Close' : 'Click to View'}
              </span>
              <div className="p-2 bg-carbon-black rounded-lg border border-graphite-light/80">
                <img 
                  src="/Images/dasigames_logo.png" 
                  alt="Dasi Logo Toggle"
                  className={`w-5 h-5 object-contain transition-transform duration-500 ease-out ${
                    isOpen ? 'rotate-[360deg] scale-125 brightness-125' : 'hover:scale-110'
                  }`}
                />
              </div>
            </div>
          </button>

          {/* Accordion Content (Fluid Height using CSS Grid rows) */}
          <div
            className={`grid transition-all duration-500 ease-in-out ${
              isOpen ? 'grid-rows-[1fr] opacity-100 border-t border-graphite-light' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
            }`}
          >
            <div className="overflow-hidden">
              <div className="p-6 flex flex-col gap-6 text-sm text-alabaster-grey">
                <div>
                  <h4 className="text-xs font-silkscreen tracking-widest text-bright-snow uppercase mb-2">Role Description</h4>
                  <p className="leading-relaxed text-alabaster-grey/80 font-light text-xs">
                    We are seeking a talented Gameplay Animator to breathe life into our characters and creatures. You will collaborate closely with designers and coders to implement dynamic animations that feel responsive and fluid in-game.
                  </p>
                </div>

                {/* Form Container */}
                <div className="border-t border-graphite-light/50 pt-6 space-y-4">
                  <h4 className="text-xs font-silkscreen tracking-widest text-bright-snow uppercase">Mock Application Form</h4>
                  
                  <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold text-bright-snow uppercase">Your Name</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 bg-carbon-black border border-graphite-light rounded-lg text-xs text-bright-snow focus:outline-none focus:border-slate-violet"
                          placeholder="George Dev"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-semibold text-bright-snow uppercase">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 bg-carbon-black border border-graphite-light rounded-lg text-xs text-bright-snow focus:outline-none focus:border-slate-violet"
                          placeholder="george@dasigames.com"
                        />
                      </div>
                    </div>

                    {/* Render Mockup Input Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-graphite-light/35 pt-4">
                      {mockupFields.map((field) => {
                        const mode = activeModes[field.id] || (field.type === 'url' ? 'url' : 'file');
                        const currentFile = uploadedFiles[field.id];
                        const isUploaded = !!currentFile;

                        return (
                          <div key={field.id} className="flex flex-col gap-1.5 bg-carbon-black/20 p-4 border border-graphite-light rounded-xl">
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] font-silkscreen tracking-wider text-alabaster-grey uppercase flex items-center gap-1">
                                <span>{field.label}</span>
                                {field.isRequired && <span className="text-rose-500">*</span>}
                              </span>

                              {field.type === 'both' && (
                                <div className="flex gap-1">
                                  <button
                                    type="button"
                                    onClick={() => setActiveModes({ ...activeModes, [field.id]: 'file' })}
                                    className={`px-2 py-0.5 text-[8px] font-semibold border uppercase tracking-wider cursor-pointer ${
                                      mode === 'file'
                                        ? 'bg-slate-violet border-slate-violet text-bright-snow'
                                        : 'bg-carbon-black border-graphite-light text-alabaster-grey/50 hover:text-bright-snow'
                                    }`}
                                  >
                                    File
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActiveModes({ ...activeModes, [field.id]: 'url' })}
                                    className={`px-2 py-0.5 text-[8px] font-semibold border uppercase tracking-wider cursor-pointer ${
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
                                required={field.isRequired}
                                value={field.id === 'portfolio' ? formData.portfolioUrl : formData.linkedinUrl}
                                onChange={(e) => {
                                  if (field.id === 'portfolio') {
                                    setFormData({ ...formData, portfolioUrl: e.target.value });
                                  } else {
                                    setFormData({ ...formData, linkedinUrl: e.target.value });
                                  }
                                }}
                                placeholder={field.placeholder}
                                className="w-full px-3 py-2.5 bg-carbon-black border border-graphite-light rounded-lg text-[10px] text-bright-snow placeholder-alabaster-grey/30 focus:outline-none focus:border-slate-violet"
                              />
                            ) : (
                              <label className={`w-full flex flex-col items-center justify-center border border-dashed rounded-lg px-3 py-3.5 cursor-pointer transition-all duration-300 ${
                                isUploaded
                                  ? 'border-muted-green bg-muted-green/5 hover:bg-muted-green/10'
                                  : 'border-graphite-light bg-carbon-black hover:border-bright-snow'
                              }`}>
                                <Upload size={14} className={`mb-1 transition-colors ${isUploaded ? 'text-muted-green' : 'text-alabaster-grey/40'}`} />
                                <span className={`text-[10px] text-center truncate max-w-full px-2 font-light ${isUploaded ? 'text-muted-green-light font-medium' : 'text-alabaster-grey'}`}>
                                  {currentFile ? currentFile.name : field.placeholder}
                                </span>
                                <span className="text-[8px] text-alabaster-grey/40 mt-0.5">Accepts: {field.accept}</span>
                                <input
                                  type="file"
                                  accept={field.accept}
                                  required={field.isRequired && mode === 'file'}
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                      handleFileChange(field.id, e.target.files[0]);
                                    } else {
                                      handleFileChange(field.id, null);
                                    }
                                  }}
                                  className="hidden"
                                />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Status Feedback Banner */}
                    {status !== 'idle' && (
                      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                        status === 'success' 
                          ? 'bg-muted-green/10 border-muted-green/30 text-muted-green-light'
                          : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      }`}>
                        {status === 'success' ? <CheckCircle size={16} className="mt-0.5 shrink-0" /> : <AlertCircle size={16} className="mt-0.5 shrink-0" />}
                        <p className="text-xs leading-relaxed font-light">{statusMsg}</p>
                      </div>
                    )}

                    <div className="flex justify-start">
                      <button
                        type="submit"
                        className="bg-slate-violet hover:bg-slate-violet-light text-bright-snow font-semibold px-6 py-2.5 rounded-xl transition-all text-xs cursor-pointer uppercase shadow-lg shadow-slate-violet/20"
                      >
                        Submit Mock Application
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
