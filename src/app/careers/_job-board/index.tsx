/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, SearchX, EyeOff, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function JobBoard({ initialJobs, isAuthenticated }: { initialJobs: any[], isAuthenticated: boolean }) {
  const [activeDept, setActiveDept] = useState<string>('All');
  const [activeExp, setActiveExp] = useState<string>('All');
  const [activeType, setActiveType] = useState<string>('All');

  const { departments, experiences, types } = useMemo(() => {
    const depts = new Set<string>();
    const exps = new Set<string>();
    const typs = new Set<string>();

    initialJobs.forEach((job) => {
      const attrs = job.attributes || job;
      if (attrs.department) depts.add(attrs.department);
      if (attrs.experience !== undefined && attrs.experience !== null) exps.add(attrs.experience.toString());
      if (attrs.type) typs.add(attrs.type);
    });

    return {
      departments: ['All', ...Array.from(depts)],
      experiences: ['All', ...Array.from(exps)],
      types: ['All', ...Array.from(typs)],
    };
  }, [initialJobs]);

  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const attrs = job.attributes || job;
      const matchDept = activeDept === 'All' || attrs.department === activeDept;
      const matchExp = activeExp === 'All' || attrs.experience?.toString() === activeExp;
      const matchType = activeType === 'All' || attrs.type === activeType;
      return matchDept && matchExp && matchType;
    });
  }, [initialJobs, activeDept, activeExp, activeType]);

  return (
    <div className="flex flex-col gap-12 font-jost">

      {/* --- PREMIUM FILTER BAR --- */}
      <div className="bg-white/80 backdrop-blur-xl border border-[#14181F]/10 rounded-3xl p-2 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.06)] flex flex-col lg:flex-row lg:items-center justify-between sticky top-6 z-30">

        <div className="flex flex-wrap items-center gap-1 p-1">
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setActiveDept(dept)}
              className={`px-6 py-3 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-semibold transition-all duration-500 ${activeDept === dept
                ? 'bg-[#14181F] text-white shadow-md'
                : 'bg-transparent text-[#14181F]/50 hover:bg-[#14181F]/5 hover:text-[#14181F]'
                }`}
            >
              {dept}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3 p-3 lg:p-1 lg:pr-3 border-t lg:border-t-0 border-[#14181F]/5">
          {experiences.length > 1 && (
            <select
              value={activeExp}
              onChange={(e) => setActiveExp(e.target.value)}
              className="bg-transparent border border-[#14181F]/10 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.15em] font-semibold text-[#14181F]/70 outline-none focus:border-[#0b3579] cursor-pointer hover:bg-white transition-colors appearance-none"
            >
              <option value="All">All Experience</option>
              {experiences.filter(e => e !== 'All').map(exp => (
                <option key={exp} value={exp}>{exp}+ Years</option>
              ))}
            </select>
          )}

          {types.length > 1 && (
            <div className="relative group">
              <select
                value={activeType}
                onChange={(e) => setActiveType(e.target.value)}
                className="bg-[#FCFBF8] border border-[#14181F]/10 rounded-xl pl-4 pr-10 py-2.5 text-[11px] uppercase tracking-[0.15em] font-semibold text-[#14181F]/70 outline-none focus:border-[#0b3579]/50 cursor-pointer hover:bg-white transition-colors appearance-none"
              >
                <option value="All">All Type</option>
                {types.filter(t => t !== 'All').map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#14181F]/40 group-hover:text-[#0b3579] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- JOB LISTINGS --- */}
      <div className="flex flex-col border-t border-[#14181F]/5 relative min-h-100">
        <AnimatePresence mode="popLayout">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => {
              const attrs = job.attributes || job;
              const jobExpLabel = attrs.experience ? `${attrs.experience}+ Years` : 'Entry Level';

              const statusLabel = attrs.postStatus || 'Draft';
              const isHidden = statusLabel !== 'Published';

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  key={job.id}
                  className={isHidden ? "opacity-75 hover:opacity-100 transition-opacity" : ""}
                >
                  <Link
                    href={`/careers/${attrs.slug}`}
                    className="group relative flex flex-col md:flex-row md:items-center justify-between py-12 border-b border-[#14181F]/5 transition-all duration-500 hover:border-[#0b3579]/30"
                  >
                    <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 -mx-6 px-6 md:rounded-3xl" />

                    <div className="md:w-3/4 pr-8 md:pl-2 transition-transform duration-500 group-hover:translate-x-4">

                      {/* Metadata Badges */}
                      <div className="flex flex-wrap items-center gap-3 mb-5">

                        {/* 🚨 VISUAL STATUS INDICATOR FOR RECRUITERS 🚨 */}
                        {isAuthenticated && (
                          <>
                            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] uppercase tracking-[0.2em] font-bold border ${isHidden
                                ? 'bg-rose-50 text-rose-600 border-rose-100'
                                : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                              }`}>
                              {isHidden ? <EyeOff size={10} /> : <Eye size={10} />}
                              {statusLabel}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-[#14181F]/20"></span>
                          </>
                        )}

                        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0b3579]">
                          {attrs.department}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#14181F]/20"></span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/50">
                          {attrs.type || 'Full Time'}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-[#14181F]/20"></span>
                        <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/50">
                          {jobExpLabel}
                        </span>
                      </div>

                      <h3 className="text-3xl lg:text-4xl text-[#14181F] font-normal group-hover:text-[#0b3579] transition-colors duration-300 mb-4 tracking-tight">
                        {attrs.title}
                      </h3>

                      <p className="text-[15px] leading-relaxed text-[#565C6B] font-light line-clamp-2 max-w-3xl">
                        {attrs.jobDescription?.replace(/<[^>]*>?/gm, '').replace(/[#*`_>-]/g, '').trim().substring(0, 160)}...
                      </p>
                    </div>

                    <div className="mt-8 md:mt-0 flex shrink-0 md:pr-4">
                      <span className="inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/40 group-hover:text-[#14181F] transition-colors duration-300">
                        {isHidden ? 'Edit Draft' : 'Explore Role'}
                        <div className="w-10 h-10 rounded-full bg-[#14181F]/5 flex items-center justify-center group-hover:bg-[#14181F] group-hover:text-white transition-all duration-500 group-hover:scale-110">
                          <ArrowRight size={14} strokeWidth={2} className="transition-transform duration-500 group-hover:translate-x-0.5" />
                        </div>
                      </span>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center py-32 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-white border border-[#14181F]/5 flex items-center justify-center mb-6 shadow-[0_2px_20px_-12px_rgba(0,0,0,0.05)]">
                <SearchX size={20} className="text-[#14181F]/30" />
              </div>
              <h3 className="text-2xl font-normal text-[#14181F] mb-3 tracking-tight">No matching roles</h3>
              <p className="text-[#565C6B] font-light max-w-sm mx-auto">
                We couldn&apos;t find any open positions that match your specific filter criteria.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}