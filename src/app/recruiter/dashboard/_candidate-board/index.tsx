/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchX } from 'lucide-react';
import { StatusUpdater } from '@/app/recruiter/dashboard/UpdateStatus';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function CandidateBoard({ initialCandidates, strapiUrl }: { initialCandidates: any[], strapiUrl: string }) {
  const [activeRole, setActiveRole] = useState<string>('All');
  const [activeStatus, setActiveStatus] = useState<string>('All');
  const [activeSource, setActiveSource] = useState<string>('All');

  const getMediaUrl = (url: string) => {
    if (url.startsWith('http')) return url;
    return `${strapiUrl}${url}`;
  };

  // 1. Extract Unique Filters dynamically from candidates
  const { jobRoles, statuses, sources } = useMemo(() => {
    const roles = new Set<string>();
    const stats = new Set<string>();
    const srcs = new Set<string>();

    initialCandidates.forEach((cand) => {
      const attrs = cand.attributes || cand;
      const jobData = attrs.job_posts?.data?.[0]?.attributes || attrs.job_posts?.data?.[0] || attrs.job_posts?.[0];

      roles.add(jobData?.title || 'General Application');
      stats.add(attrs.candidateStatus || 'New');
      srcs.add(attrs.source || 'Direct');
    });

    return {
      jobRoles: ['All', ...Array.from(roles)],
      statuses: ['All', ...Array.from(stats)],
      sources: ['All', ...Array.from(srcs)],
    };
  }, [initialCandidates]);

  // 2. Filter Candidates
  const filteredCandidates = useMemo(() => {
    return initialCandidates.filter((cand) => {
      const attrs = cand.attributes || cand;
      const jobData = attrs.job_posts?.data?.[0]?.attributes || attrs.job_posts?.data?.[0] || attrs.job_posts?.[0];

      const appliedRole = jobData?.title || 'General Application';
      const status = attrs.candidateStatus || 'New';
      const source = attrs.source || 'Direct';

      const matchRole = activeRole === 'All' || appliedRole === activeRole;
      const matchStatus = activeStatus === 'All' || status === activeStatus;
      const matchSource = activeSource === 'All' || source === activeSource;

      return matchRole && matchStatus && matchSource;
    });
  }, [initialCandidates, activeRole, activeStatus, activeSource]);

  return (
    <div className="flex flex-col gap-10">

      {/* --- PREMIUM FILTER BAR --- */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#11192b]/10 rounded-3xl p-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row lg:items-center justify-between sticky top-6 z-30">

        {/* Role Pills (Primary Filter) */}
        <div className="flex flex-wrap items-center gap-1 p-1">
          {jobRoles.map((role) => (
            <button
              key={role}
              onClick={() => setActiveRole(role)}
              className={`px-6 py-3 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-semibold transition-all duration-500 ${activeRole === role
                  ? 'bg-[#11192b] text-white shadow-md'
                  : 'bg-transparent text-[#11192b]/50 hover:bg-[#11192b]/5 hover:text-[#11192b]'
                }`}
            >
              {role === 'All' ? 'All Roles' : role}
            </button>
          ))}
        </div>

        {/* Secondary Dropdown Filters (Status & Source) */}
        <div className="flex flex-wrap items-center gap-3 p-3 lg:p-1 lg:pr-3 border-t lg:border-t-0 border-[#11192b]/5">
          {statuses.length > 1 && (
            <select
              value={activeStatus}
              onChange={(e) => setActiveStatus(e.target.value)}
              className="bg-transparent border border-[#11192b]/10 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-semibold text-[#11192b]/70 outline-none focus:border-[#0b3579] cursor-pointer hover:bg-white transition-colors appearance-none"
            >
              <option value="All">All Statuses</option>
              {statuses.filter(s => s !== 'All').map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          )}

          {sources.length > 1 && (
            <select
              value={activeSource}
              onChange={(e) => setActiveSource(e.target.value)}
              className="bg-transparent border border-[#11192b]/10 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-semibold text-[#11192b]/70 outline-none focus:border-[#0b3579] cursor-pointer hover:bg-white transition-colors appearance-none"
            >
              <option value="All">All Sources</option>
              {sources.filter(s => s !== 'All').map(source => (
                <option key={source} value={source}>{source}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* --- CANDIDATES LIST --- */}
      <div className="grid gap-8 relative min-h-100">
        <AnimatePresence mode="popLayout">
          {filteredCandidates.map((candidate: any) => {
            const attrs = candidate.attributes || candidate;
            const { firstName, lastName, email, linkedinUrl, candidateStatus, source, dynamicAnswers, job_posts, resume } = attrs;

            const jobData = job_posts?.data?.[0]?.attributes || job_posts?.data?.[0] || job_posts?.[0];
            const appliedRole = jobData?.title || 'General Application';
            const resumeData = resume?.data?.attributes || resume?.data || resume;
            const resumeUrl = resumeData?.url ? getMediaUrl(resumeData.url) : null;

            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                key={candidate.id || candidate.documentId}
                className="bg-white rounded-3xl p-6 md:p-10 flex flex-col lg:flex-row gap-10 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.03)] border border-[#11192b]/3 transition-all duration-500 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)]"
              >
                {/* Left Column: Core Identity */}
                <div className="lg:w-1/3 flex flex-col border-b lg:border-b-0 lg:border-r border-[#11192b]/5 pb-8 lg:pb-0 lg:pr-10">
                  <div className="flex items-center justify-between mb-8">
                    <StatusUpdater
                      candidate={candidate}
                      currentStatus={candidateStatus || 'New'}
                      candidateInfo={{ firstName: firstName || 'Unknown', email: email || '', appliedRole }}
                    />
                    <div className="bg-[#f4f7fb] px-3 py-1.5 rounded-full border border-[#11192b]/5">
                      <span className="text-[10px] font-semibold text-[#11192b]/50 uppercase tracking-[0.2em]">
                        {source || 'Direct'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h2 className="text-3xl font-medium tracking-tight mb-2 font-serif text-[#11192b]">
                      {firstName} {lastName}
                    </h2>
                    <p className="text-sm uppercase tracking-[0.15em] text-[#0b3579] font-medium mb-8">
                      {appliedRole}
                    </p>

                    <div className="space-y-4 text-sm font-light">
                      {email && (
                        <a href={`mailto:${email}`} className="flex items-center gap-3 text-[#11192b]/70 hover:text-[#0b3579] transition-colors group">
                          <svg className="w-4 h-4 text-[#11192b]/30 group-hover:text-[#0b3579] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {email}
                        </a>
                      )}
                      {linkedinUrl && (
                        <a href={linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-[#11192b]/70 hover:text-[#0b3579] transition-colors group">
                          <svg className="w-4 h-4 text-[#11192b]/30 group-hover:text-[#0b3579] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>

                  {resumeUrl && (
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 flex items-center justify-center gap-2 w-full border border-[#11192b]/10 rounded-xl py-3.5 uppercase tracking-[0.15em] text-xs font-medium text-[#11192b] hover:border-[#0b3579] hover:bg-[#0b3579] hover:text-white transition-all duration-300"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      View Resume
                    </a>
                  )}
                </div>

                {/* Right Column: Dynamic AI Answers */}
                <div className="lg:w-2/3 flex flex-col">
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold whitespace-nowrap">
                      Candidate Responses
                    </h3>
                    <div className="h-px flex-1 bg-[#11192b]/5"></div>
                  </div>

                  {dynamicAnswers && Object.keys(dynamicAnswers).length > 0 ? (
                    <div className="grid sm:grid-cols-2 gap-4 auto-rows-max">
                      {Object.entries(dynamicAnswers).map(([questionId, answer]) => (
                        <div
                          key={questionId}
                          className="bg-[#f4f7fb]/60 rounded-2xl p-5 border border-[#11192b]/5 hover:bg-white hover:shadow-md hover:border-[#0b3579]/10 transition-all duration-300"
                        >
                          <p className="text-[10px] text-[#11192b]/40 font-semibold uppercase tracking-[0.15em] mb-2.5">
                            {questionId.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-[#11192b] text-[15px] font-light leading-relaxed">
                            {answer as string || <span className=" opacity-40">No response provided</span>}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 border border-dashed border-[#11192b]/10 rounded-2xl bg-[#f4f7fb]/30">
                      <svg className="w-8 h-8 text-[#11192b]/20 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-sm text-[#11192b]/40 font-light ">No dynamic questions answered.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}

          {filteredCandidates.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 text-center py-32 bg-white rounded-3xl border border-[#11192b]/5 shadow-sm"
            >
              <div className="w-16 h-16 bg-[#f4f7fb] rounded-full flex items-center justify-center mx-auto mb-6">
                <SearchX size={24} className="text-[#11192b]/30" />
              </div>
              <h3 className="text-2xl font-serif tracking-tight mb-2">No Candidates Found</h3>
              <p className="text-[#11192b]/50 font-light">No applicants match your current filter criteria.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}