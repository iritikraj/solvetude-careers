import { notFound } from 'next/navigation';
import EditJobClient from './_client';

async function getJobBySlug(slug: string) {
  const res = await fetch(`${process.env.STRAPI_API_URL}/api/job-posts?filters[slug][$eq]=${slug}`, {
    headers: { 'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}` },
    cache: 'no-store'
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.length > 0 ? json.data[0] : null;
}

export default async function EditJobPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const job = await getJobBySlug(resolvedParams.slug);

  if (!job) {
    notFound();
  }

  const attrs = job.attributes || job;

  return <EditJobClient documentId={job.documentId || attrs.documentId} initialData={attrs} />;
}