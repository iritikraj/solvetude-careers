import { notFound } from 'next/navigation';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { DynamicApplicationForm } from '@/components/DynamicApplicationForm';
import { ArrowLeft, Briefcase } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { JobAdminActions } from './_admin';

// 1. Fetch the specific job by its slug
async function getJobBySlug(slug: string) {
  const res = await fetch(`${process.env.STRAPI_API_URL}/api/job-posts?filters[slug][$eq]=${slug}`, {
    method: 'GET',
    cache: 'no-store',
    headers: {
      'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.length > 0 ? json.data[0] : null;
}

export default async function JobDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);

  const attrs = job?.attributes || job; // SAFE EXTRACTION

  // Check authentication status to reveal recruiter controls
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('solvetude_session');

  // CRITICAL UPDATE: Only 404 if the job doesn't exist, OR if it's unpublished AND the user is not a logged-in recruiter.
  if (!job || (attrs.postStatus !== 'Published' && !isAuthenticated)) {
    notFound();
  }

  const { title, department, jobDescription, formSchema, postStatus } = attrs;

  return (
    <div className="min-h-screen font-jost text-[#14181F] selection:bg-[#0b3579]/20 selection:text-[#14181F]">

      {/* ================= HEADER (Editorial) ================= */}
      <header className="relative pt-12 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 translate-x-1/4 -translate-y-1/4 w-200 h-200 bg-[#0b3579]/3 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <div
          className="absolute inset-0 opacity-[0.15] pointer-events-none -z-10"
          style={{
            backgroundImage: 'radial-gradient(#14181F 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />

        <div className="max-w-4xl mx-auto relative z-10">

          {/* Top Row: Navigation and Admin HUD split across the screen */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
            <Link
              href="/careers"
              className="group inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#14181F]/50 hover:text-[#0b3579] transition-colors duration-300"
            >
              <ArrowLeft size={14} strokeWidth={1.5} className="transition-transform duration-500 group-hover:-translate-x-1" />
              Back to Openings
            </Link>

            {/* Recruiter Admin HUD */}
            {isAuthenticated && (
              <JobAdminActions documentId={job.documentId || attrs.documentId} jobSlug={attrs.slug} initialStatus={postStatus} />
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <div className="inline-flex items-center gap-2 bg-white/60 border border-[#14181F]/10 px-4 py-2 rounded-full backdrop-blur-sm">
              <Briefcase size={12} className="text-[#0b3579]" />
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/70">
                {department}
              </span>
            </div>

            {/* Added Job Type Tag */}
            {attrs.type && (
              <>
                <span className="w-8 h-px bg-[#14181F]/10 hidden sm:block"></span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#0b3579]">
                  {attrs.type}
                </span>
              </>
            )}

            {/* Added Experience Tag */}
            {attrs.experience !== undefined && attrs.experience !== null && (
              <>
                <span className="w-8 h-px bg-[#14181F]/10 hidden sm:block"></span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/50">
                  {attrs.experience}+ Years Exp.
                </span>
              </>
            )}

            <span className="w-8 h-px bg-[#14181F]/10 hidden sm:block"></span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#14181F]/50">
              Remote / On-Site
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-medium font-serif  tracking-tight leading-[1.05] text-[#14181F]">
            {title}
          </h1>
        </div>
      </header>

      {/* ================= MAIN CONTENT (Single Column) ================= */}
      <main className="max-w-4xl mx-auto px-6 md:px-0 pb-20 md:pb-32 flex flex-col gap-20 md:gap-32">
        {/* Top Section: Job Description */}
        <div>
          <div className="max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ node, ...props }) => <h1 className="text-4xl font-medium text-[#14181F] mt-12 mb-6" {...props} />,
                h2: ({ node, ...props }) => <h2 className="text-3xl font-medium text-[#14181F] mt-12 mb-5 tracking-tight" {...props} />,
                h3: ({ node, ...props }) => <h3 className="text-2xl font-light text-[#14181F] mt-8 mb-4 tracking-tight" {...props} />,
                p: ({ node, ...props }) => <p className="text-[16px] font-light text-[#565C6B] leading-[1.8] mb-6" {...props} />,
                ul: ({ node, ...props }) => <ul className="flex flex-col gap-3 mb-8 mt-2" {...props} />,
                li: ({ node, ...props }) => (
                  <li className="flex items-start gap-4 text-[16px] font-light text-[#565C6B] leading-[1.7]">
                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[#0b3579]/60 shrink-0"></span>
                    <span className="flex-1">{props.children}</span>
                  </li>
                ),
                strong: ({ node, ...props }) => <strong className="font-medium text-[#14181F]" {...props} />,
                a: ({ node, ...props }) => <a className="text-[#0b3579] hover:text-[#14181F] underline decoration-1 underline-offset-4 transition-colors" {...props} />
              }}
            >
              {jobDescription}
            </ReactMarkdown>
          </div>
        </div>

        {/* Bottom Section: AI-Generated Application Form */}
        <div>
          <div className="bg-white rounded-4xl border border-[#14181F]/4 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.04)] overflow-hidden transition-shadow duration-500 hover:shadow-[0_20px_60px_-12px_rgba(0,0,0,0.08)]">
            <div className="relative bg-[#14181F] px-10 py-8 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#0b3579]/20 rounded-full blur-2xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
              <h3 className="relative z-10 text-[11px] text-[#FCFBF8] uppercase tracking-[0.3em] font-semibold flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#0b3579] animate-pulse"></span>
                Submit Credentials
              </h3>
            </div>
            <div className="p-8 md:p-12 bg-white">
              <DynamicApplicationForm jobId={job.id} formSchema={formSchema} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}