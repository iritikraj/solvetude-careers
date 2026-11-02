import { cookies } from 'next/headers';
import { Briefcase } from 'lucide-react';
import JobBoard from './_job-board';

// 1. Secure & Cached Data Fetching
async function getJobs(isAuthenticated: boolean) {
  // If authenticated, fetch ALL jobs. If not, only fetch Published jobs.
  const endpoint = isAuthenticated
    ? `${process.env.STRAPI_API_URL}/api/job-posts?sort=createdAt:desc`
    : `${process.env.STRAPI_API_URL}/api/job-posts?filters[postStatus][$eq]=Published&sort=createdAt:desc`;

  const res = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    // We disable cache for recruiters so they see instant status changes.
    // For public users, we keep the 60-second revalidation.
    ...(isAuthenticated ? { cache: 'no-store' } : { next: { revalidate: 60 } })
  });

  if (!res.ok) {
    console.error("Failed to fetch jobs");
    return { data: [] };
  }

  return res.json();
}

export default async function CareersPage() {
  // Check if the user is a logged-in recruiter
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('solvetude_session');

  const response = await getJobs(isAuthenticated);
  const jobs = response.data || [];

  return (
    <div className="min-h-screen font-jost text-[#14181F] selection:bg-[#0b3579]/20 selection:text-[#14181F]">

      {/* ================= HERO (Editorial) ================= */}
      <section className="relative px-6 pt-12 pb-20 overflow-hidden">
        {/* Subtle glowing orb for depth */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-200 bg-[#0b3579]/3 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-light leading-[1.05] tracking-tight text-black mb-8 font-serif italic">
            Architecting <br className="hidden md:block" />
            <span className="text-[#0b3579] font-light">Era Of Innovation.</span>
          </h1>

          <p className="text-lg md:text-xl leading-relaxed text-[#565C6B] font-light max-w-2xl mx-auto">
            We are looking for exceptional talent across engineering, product, and strategy to build high-performance systems and drive global impact.
          </p>
        </div>
      </section>

      {/* ================= INTERACTIVE JOB BOARD ================= */}
      <section className="max-w-6xl mx-auto pb-24 md:pb-40 px-6 relative z-10">
        {jobs.length === 0 ? (
          <div className="text-center py-40 bg-white rounded-4xl border border-[#14181F]/3 shadow-[0_2px_40px_-12px_rgba(0,0,0,0.02)] transition-all duration-500 hover:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.06)]">
            <div className="w-16 h-16 rounded-full bg-[#FCFBF8] flex items-center justify-center mx-auto mb-8 text-[#14181F]/20">
              <Briefcase size={24} strokeWidth={1.5} />
            </div>
            <h3 className="text-3xl font-light text-[#14181F] mb-4 tracking-tight">No open positions.</h3>
            <p className="text-[16px] font-light text-[#565C6B] max-w-md mx-auto leading-relaxed">
              Our teams are currently at capacity. Follow us on LinkedIn to be notified of future opportunities.
            </p>
          </div>
        ) : (
          // Pass the authentication status to the JobBoard so it can display visual indicators for Draft jobs
          <JobBoard initialJobs={jobs} isAuthenticated={isAuthenticated} />
        )}
      </section>
    </div>
  );
}