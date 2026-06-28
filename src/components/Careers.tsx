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
    <section id="careers" className="bg-transparent border-t border-graphite-light py-24 px-6 relative">
      <div className="absolute bottom-1/2 right-0 w-80 h-80 bg-slate-violet/10 rounded-full blur-[100px] pointer-events-none select-none" />

      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-silkscreen tracking-widest text-slate-violet-light uppercase flex items-center justify-center gap-2">
            <span>•</span> Career Opportunities
          </span>
          <h2 className="text-3xl md:text-5xl font-normal text-bright-snow tracking-wide mt-2 uppercase font-russo-one retro-heading-shadow">
            Join Our Team
          </h2>
          <p className="text-sm text-alabaster-grey mt-4 max-w-lg mx-auto font-outfit font-light">
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
                className={`inset-pixel-card border transition-all duration-300 group ${
                  isOpen ? 'border-platinum-silver' : 'border-graphite-light hover:border-platinum-silver-light'
                }`}
              >
                {/* Accordion Header */}
                <button
                  onClick={() => toggleJob(job.id)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg border transition-colors ${
                      isOpen ? 'bg-carbon-black border-slate-violet text-platinum-silver' : 'bg-carbon-black-2 border-graphite-light text-alabaster-grey'
                    }`}>
                      <Briefcase size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-silkscreen text-bright-snow tracking-wide uppercase">{job.title}</h3>
                      <p className="text-xs text-alabaster-grey/70 flex items-center gap-1 mt-1.5 font-outfit font-light">
                        <MapPin size={12} />
                        {job.location}
                      </p>
                    </div>
                  </div>

                  <div className={`text-alabaster-grey transition-transform duration-300 ${isOpen ? 'rotate-180 text-platinum-silver' : ''}`}>
                    <ChevronDown size={20} />
                  </div>
                </button>

                {/* Accordion Content (Fluid Height using CSS grid rows) */}
                <div
                  className={`grid transition-all duration-500 ease-in-out ${
                    isOpen ? 'grid-rows-[1fr] opacity-100 border-t border-graphite-light' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 flex flex-col gap-6 text-sm text-alabaster-grey">
                      {/* Description */}
                      <p className="leading-relaxed text-alabaster-grey font-outfit font-light">
                        {job.description}
                      </p>

                      {/* Split Responsibilities / Requirements */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                        {/* Responsibilities */}
                        {job.responsibilities && job.responsibilities.length > 0 && (
                          <div>
                            <h4 className="text-xs font-silkscreen tracking-widest text-bright-snow uppercase mb-3 border-b border-graphite-light pb-2.5">
                              Key Responsibilities
                            </h4>
                            <ul className="list-disc pl-4 flex flex-col gap-2 font-outfit font-light text-alabaster-grey">
                              {job.responsibilities.map((resp, index) => (
                                <li key={index}>{resp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Requirements */}
                        {job.requirements && job.requirements.length > 0 && (
                          <div>
                            <h4 className="text-xs font-silkscreen tracking-widest text-bright-snow uppercase mb-3 border-b border-graphite-light pb-2.5">
                              Requirements
                            </h4>
                            <ul className="list-disc pl-4 flex flex-col gap-2 font-outfit font-light text-alabaster-grey">
                              {job.requirements.map((req, index) => (
                                <li key={index}>{req}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex justify-start mt-4 border-t border-graphite-light pt-6">
                        <button
                          onClick={() => handleApplyClick(job.title)}
                          className="inset-pixel-btn-primary px-6 py-3 text-xs"
                        >
                          Apply Now
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
