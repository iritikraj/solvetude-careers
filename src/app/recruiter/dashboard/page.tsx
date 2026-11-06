/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from 'next/link';
import { LinkedInImporter } from '@/app/recruiter/dashboard/LinkedInImporter';
import CandidateBoard from './_candidate-board';

// 1. Secure Data Fetching
async function getCandidates() {
  const res = await fetch(
    `${process.env.STRAPI_API_URL}/api/candidates?populate[job_posts][fields][0]=title&populate[resume][fields][0]=url&sort=createdAt:desc`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      cache: 'no-store'
    }
  );

  if (!res.ok) throw new Error('Failed to fetch candidates');
  return res.json();
}

async function getActiveJobs() {
  const res = await fetch(`${process.env.STRAPI_API_URL}/api/job-posts?fields[0]=title`, {
    headers: { 'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}` },
    cache: 'no-store'
  });
  if (!res.ok) return { data: [] };
  return res.json();
}

export default async function HRDashboard() {
  const response = await getCandidates();
  const candidates = response.data || [];

  const jobsResponse = await getActiveJobs();
  const activeJobs = (jobsResponse.data || []).map((job: any) => ({
    id: job.id,
    title: job.attributes?.title || job.title || 'Untitled Job'
  }));

  // Pass the base URL so the client component can resolve media URLs correctly
  const strapiUrl = process.env.STRAPI_API_URL || '';

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6 md:p-12 lg:p-16 font-jost text-[#11192b] selection:bg-[#0b3579]/30">
      <div className="max-w-7xl mx-auto">

        {/* --- PREMIUM HEADER --- */}
        <header className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6 pb-8">
          <div className="max-w-xl">
            <h1 className="text-5xl md:text-6xl leading-[1.05] tracking-tight mb-3 font-serif ">
              Applicant <span className='text-[#0b3579] font-serif'>Tracking</span>
            </h1>
            <p className="text-lg font-light text-[#11192b]/60 leading-relaxed">
              Manage your candidates, review dynamic submissions, and curate your top talent.
            </p>
          </div>

          <Link
            href="/recruiter/create-job"
            className="group relative inline-flex items-center justify-center bg-[#11192b] text-white px-8 py-4 rounded-full uppercase tracking-[0.15em] text-xs font-medium overflow-hidden transition-all duration-300 hover:shadow-[0_8px_25px_-5px_rgba(17,25,43,0.3)] hover:-translate-y-0.5"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4 transition-transform group-hover:rotate-90 duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Job
            </span>
            <div className="absolute inset-0 bg-[#0f2953] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          </Link>
        </header>

        <CandidateBoard initialCandidates={candidates} strapiUrl={strapiUrl} />
      </div>


      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-[#11192b]/5">
        <LinkedInImporter activeJobs={activeJobs} />
      </div>

    </div>
  );
}