'use client';

import { useState } from 'react';
import { ChevronDown, Briefcase, MapPin } from 'lucide-react';
import { Job } from '@/utils/db';

export default function Careers({ initialJobs }: { initialJobs: Job[] }) {
  const [openJobId, setOpenJobId] = useState<string | null>(null);

  const toggleJob = (id: string) => {
    setOpenJobId(openJobId === id ? null : id);
  };

  const handleApplyClick = (jobTitle: string) => {
    // Scroll to contact form
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = contactSection.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });

      // Pre-fill subject field if it exists
      setTimeout(() => {
        const subjectInput = document.getElementById('subject') as HTMLInputElement;
        const messageInput = document.getElementById('message') as HTMLTextAreaElement;
        if (subjectInput) {
          subjectInput.value = `Job Application - ${jobTitle}`;
          // Dispatch input event to ensure React state updates if there is one
          subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (messageInput) {
          messageInput.focus();
        }
      }, 800);
    }
  };

  return (
    <section id="careers" className="bg-dasi-black-950 border-t border-white/5 py-24 px-6 relative">
      <div className="absolute bottom-1/2 right-0 w-80 h-80 bg-dasi-alice-950/10 rounded-full blur-[100px] pointer-events-none select-none" />

      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-dasi-alice-400 uppercase flex items-center justify-center gap-2">
            <span>•</span> CAREER OPPORTUNITIES
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-wide mt-2 uppercase">
            JOIN OUR TEAM
          </h2>
          <p className="text-sm text-dasi-steel-400 mt-4 max-w-lg mx-auto">
            Join us in our adventure, push your limits, and let's create something extraordinary together in our Tbilisi studio.
          </p>
        </div>

        {/* Jobs Accordion */}
        <div className="flex flex-col gap-4">
          {initialJobs.map((job) => {
            const isOpen = openJobId === job.id;
            return (
              <div
                key={job.id}
                className={`border rounded-2xl glass-panel transition-all duration-300 ${
                  isOpen ? 'border-dasi-alice-500/30' : 'border-white/5 hover:border-white/10'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleJob(job.id)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl border transition-colors ${
                      isOpen ? 'bg-dasi-alice-950/40 border-dasi-alice-500/20 text-dasi-alice-400' : 'bg-dasi-ink-900 border-white/5 text-dasi-steel-400'
                    }`}>
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-wide">{job.title}</h3>
                      <p className="text-xs text-dasi-steel-500 flex items-center gap-1 mt-1">
                        <MapPin size={12} />
                        {job.location}
                      </p>
                    </div>
                  </div>

                  <div className={`text-dasi-steel-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-dasi-alice-400' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {/* Accordion Content (Fluid Height using CSS grid rows) */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 border-t border-white/5' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 flex flex-col gap-6 text-sm text-dasi-steel-300">
                      {/* Description */}
                      <p className="leading-relaxed text-dasi-steel-300 font-light">
                        {job.description}
                      </p>

                      {/* Split Responsibilities / Requirements */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        {/* Responsibilities */}
                        {job.responsibilities && job.responsibilities.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-3 border-b border-white/5 pb-1">
                              Key Responsibilities
                            </h4>
                            <ul className="list-disc pl-4 flex flex-col gap-2 font-light">
                              {job.responsibilities.map((resp, index) => (
                                <li key={index}>{resp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Requirements */}
                        {job.requirements && job.requirements.length > 0 && (
                          <div>
                            <h4 className="text-xs font-bold tracking-widest text-white uppercase mb-3 border-b border-white/5 pb-1">
                              Requirements
                            </h4>
                            <ul className="list-disc pl-4 flex flex-col gap-2 font-light">
                              {job.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-start mt-4 border-t border-white/5 pt-6">
                        <button
                          onClick={() => handleApplyClick(job.title)}
                          className="px-6 py-3 bg-dasi-alice-500 hover:bg-dasi-alice-600 text-white font-bold tracking-widest text-xs rounded-lg transition-colors shadow-lg shadow-dasi-alice-950/40"
                        >
                          APPLY NOW
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
