'use client';

import { useState } from 'react';
import { importLinkedInCandidates } from '@/actions/import-actions';

export function LinkedInImporter({ activeJobs }: { activeJobs: { id: number, title: string }[] }) {
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' });

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUploading(true);
    setStatus({ type: 'idle', message: '' });

    const formData = new FormData(e.currentTarget);
    const result = await importLinkedInCandidates(formData);

    if (result.success) {
      setStatus({
        type: 'success',
        message: `Successfully imported ${result.count} out of ${result.total} candidates.`
      });
      e.currentTarget.reset();
    } else {
      setStatus({ type: 'error', message: result.error || "Upload failed." });
    }

    setIsUploading(false);
  };

  return (
    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.03)] border border-[#11192b]/3 transition-all duration-500 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] font-jost text-[#11192b]">

      {/* Header Section */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-14 h-14 rounded-full bg-[#f4f7fb] flex items-center justify-center border border-[#11192b]/5">
          <svg className="w-6 h-6 text-[#0b3579]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-medium tracking-tight mb-1">Import from LinkedIn</h2>
          <p className="text-sm text-[#11192b]/50 font-light">Upload your Talent Hub CSV to sync candidates.</p>
        </div>
      </div>

      {/* Status Messages */}
      {status.message && (
        <div className={`p-5 mb-8 rounded-[16px] text-sm font-medium flex items-start gap-3 transition-all duration-300 ${status.type === 'success'
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

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="space-y-8">

        {/* Job Selection */}
        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-3">
            Target Job Post
          </label>
          <div className="relative group">
            <select
              name="jobId"
              required
              defaultValue=""
              className="w-full bg-[#f4f7fb]/60 border border-[#11192b]/10 rounded-[16px] p-4 pr-12 text-[#11192b] text-sm font-light outline-none appearance-none cursor-pointer focus:bg-white focus:border-[#0b3579]/50 focus:ring-1 focus:ring-[#0b3579]/30 transition-all duration-300"
            >
              <option value="" disabled className="text-[#11192b]/40">Select the job they applied for...</option>
              {activeJobs.map((job) => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#11192b]/30 group-hover:text-[#0b3579] transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
              </svg>
            </div>
          </div>
        </div>

        {/* CSV File Input */}
        <div>
          <label className="block text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-3">
            LinkedIn CSV Export
          </label>
          <div className="relative">
            <input
              type="file"
              name="csvFile"
              accept=".csv"
              required
              className="block w-full text-sm text-[#11192b]/60 bg-[#f4f7fb]/60 border border-[#11192b]/10 rounded-[16px] p-2 cursor-pointer focus:outline-none focus:border-[#0b3579]/50 focus:bg-white transition-all duration-300
                file:mr-6 file:py-3 file:px-6 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:uppercase file:tracking-[0.15em] 
                file:bg-[#11192b]/5 file:text-[#11192b] hover:file:bg-[#11192b] hover:file:text-white file:transition-all file:duration-300 file:cursor-pointer"
            />
          </div>
          <p className="text-xs text-[#11192b]/40 font-light mt-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-[#11192b]/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Export applicants from LinkedIn Talent Hub and upload the raw CSV.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className="group relative w-full inline-flex items-center justify-center bg-[#11192b] text-white px-8 py-4 rounded-2xl uppercase tracking-[0.15em] text-xs font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_8px_25px_-5px_rgba(17,25,43,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 hover:-translate-y-0.5"
        >
          <span className="relative z-10 flex items-center gap-3">
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Parsing & Importing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 transition-transform group-hover:-translate-y-1 group-hover:scale-110 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Import Candidates
              </>
            )}
          </span>
          {!isUploading && (
            <div className="absolute inset-0 bg-[#0b3579] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          )}
        </button>

      </form>
    </div>
  );
}