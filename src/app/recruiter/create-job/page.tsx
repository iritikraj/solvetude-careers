'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createJobPostWithAI } from '@/actions/job-actions';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// Dynamically import the Markdown editor with SSR disabled
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function CreateJobPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  // State to hold the rich Markdown content
  const [jobDescription, setJobDescription] = useState<string>("## About the Role:\n\nWrite your description here...\n\n## Key Responsibilities:\n\n1. Point one\n2. Point two");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    setStatus({ type: 'idle', message: '' });

    const formData = new FormData(e.currentTarget);

    // Inject the Markdown state into the FormData before sending to the Server Action
    formData.set('jobDescription', jobDescription);

    // Call the Gemini Server Action
    const result = await createJobPostWithAI(formData);

    if (result.success) {
      setStatus({ type: 'success', message: 'Job successfully generated and published!' });
      formRef.current?.reset();
      setJobDescription("");

      // Optional: Redirect back to dashboard after a short delay
      setTimeout(() => router.push('/recruiter/dashboard'), 2000);
    } else {
      setStatus({ type: 'error', message: result.error || 'Failed to generate job.' });
    }

    setIsGenerating(false);
  };

  const inputClasses = "w-full bg-[#f4f7fb]/60 border border-[#11192b]/10 rounded-[16px] p-4 text-[#11192b] text-sm font-light outline-none focus:bg-white focus:border-[#0b3579]/50 focus:ring-1 focus:ring-[#0b3579]/30 transition-all duration-300 placeholder:text-[#11192b]/30";

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6 md:p-12 lg:p-16 font-jost text-[#11192b] selection:bg-[#0b3579]/30">
      <div className="max-w-4xl mx-auto">

        {/* --- HEADER --- */}
        <header className="mb-12">
          <Link
            href="/recruiter/dashboard"
            className="group inline-flex items-center gap-2 text-[#11192b]/50 hover:text-[#0b3579] transition-colors mb-8"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="text-[11px] uppercase tracking-[0.2em] font-semibold">Back to Dashboard</span>
          </Link>

          <h1 className="text-4xl md:text-6xl tracking-tight mb-3 font-serif ">
            List Job
          </h1>
          <p className="text-lg font-light text-[#11192b]/60 leading-relaxed max-w-2xl">
            Paste your job description and raw questions. Gemini will automatically structure the application form and publish the listing.
          </p>
        </header>

        {/* --- FORM CONTAINER --- */}
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.03)] border border-[#11192b]/3">

          {status.message && (
            <div className={`p-5 mb-10 rounded-2xl text-sm font-medium flex items-start gap-3 transition-all duration-300 ${status.type === 'success'
              ? 'bg-emerald-50/50 text-emerald-700 border border-emerald-100'
              : 'bg-red-50/50 text-red-700 border border-red-100'
              }`}>
              {status.type === 'success' ? (
                <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {status.message}
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">

            {/* Top Row: Title & Department */}
            {/* Top Row: Title, Department, Type, Experience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#11192b]/20 group-focus-within:bg-[#0b3579] transition-colors duration-300"></span>
                  Job Title <span className="text-[#d10808]">*</span>
                </label>
                <input type="text" name="title" required placeholder="e.g. Senior Frontend Engineer" className={inputClasses} />
              </div>

              <div className="group">
                <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#11192b]/20 group-focus-within:bg-[#0b3579] transition-colors duration-300"></span>
                  Department <span className="text-[#d10808]">*</span>
                </label>
                <input type="text" name="department" required placeholder="e.g. Engineering" className={inputClasses} />
              </div>

              {/* NEW: Job Type */}
              <div className="group">
                <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#11192b]/20 group-focus-within:bg-[#0b3579] transition-colors duration-300"></span>
                  Job Type <span className="text-[#d10808]">*</span>
                </label>
                <select name="type" required className={inputClasses + " appearance-none cursor-pointer"}>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
              </div>

              {/* NEW: Experience */}
              <div className="group">
                <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#11192b]/20 group-focus-within:bg-[#0b3579] transition-colors duration-300"></span>
                  Years of Experience <span className="text-[#d10808]">*</span>
                </label>
                <input
                  type="number"
                  name="experience"
                  min="0"
                  required
                  placeholder="e.g. 3"
                  className={inputClasses}
                />
              </div>
            </div>

            <div data-color-mode="light">
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-3">
                Job Description <span className="text-[#d10808]">*</span>
              </label>

              <div className="rounded-2xl overflow-hidden border border-[#11192b]/10 hover:border-[#0b3579]/50 transition-colors duration-300">
                <MDEditor
                  value={jobDescription}
                  onChange={(val) => setJobDescription(val || '')}
                  height={400}
                  className="w-full rounded-none! border-0! font-jost"
                  previewOptions={{
                    className: "prose prose-sm max-w-none font-jost"
                  }}
                />
              </div>
            </div>

            {/* AI Instructions Box */}
            <div className="relative overflow-hidden bg-linear-to-br from-[#0b3579]/5 to-[#f4f7fb] p-8 rounded-[20px] border border-[#0b3579]/10 group">
              <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none transition-transform duration-500 group-hover:scale-110">
                <svg className="w-24 h-24 text-[#0b3579]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L9.5 9.5L2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2zm0 4.5l1.2 3.8l3.8 1.2l-3.8 1.2L12 16.5l-1.2-3.8l-3.8-1.2l3.8-1.2L12 6.5z" />
                </svg>
              </div>

              <label className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/70 font-semibold mb-3 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0b3579] animate-pulse"></span>
                AI Form Instructions <span className="text-[#11192b]/40 font-normal lowercase tracking-normal">(Optional)</span>
              </label>
              <p className="text-sm font-light text-[#11192b]/60 mb-6 max-w-2xl relative z-10 leading-relaxed">
                Brain-dump what you want to ask the candidate. The AI will translate this into professional form fields. (First Name, Last Name, Email, LinkedIn, and Resume are included automatically). Leave blank if you only need the standard fields.
              </p>
              <textarea
                name="rawQuestions"
                rows={4}
                placeholder="e.g. Find out their notice period. Ask them to describe a complex Next.js bug they solved."
                className={`${inputClasses} bg-white/60 focus:bg-white resize-y min-h-25 relative z-10`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isGenerating}
              className="group cursor-pointer relative w-full inline-flex items-center justify-center bg-[#11192b] text-white px-8 py-5 rounded-2xl uppercase tracking-[0.15em] text-xs font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_8px_25px_-5px_rgba(17,25,43,0.3)] disabled:opacity-50 disabled:cursor-wait disabled:hover:shadow-none disabled:hover:translate-y-0 hover:-translate-y-0.5 mt-4"
            >
              <span className="relative z-10 flex items-center gap-3">
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gemini is Generating Form...
                  </>
                ) : (
                  <>
                    Generate & Publish Job Post
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </span>
              {!isGenerating && (
                <div className="absolute inset-0 bg-[#0b3579] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}