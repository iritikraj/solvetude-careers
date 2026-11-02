'use server';

import { revalidatePath } from 'next/cache';

export async function toggleJobStatus(documentId: string, currentStatus: string) {
  const newStatus = currentStatus === 'Published' ? 'Draft' : 'Published';

  const res = await fetch(`${process.env.STRAPI_API_URL}/api/job-posts/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify({ data: { postStatus: newStatus } })
  });

  if (!res.ok) throw new Error('Failed to update job status');

  revalidatePath('/careers');
  revalidatePath('/recruiter/dashboard');
  revalidatePath(`/careers/[slug]`, 'page');

  return newStatus;
}

export async function deleteJob(documentId: string) {
  const res = await fetch(`${process.env.STRAPI_API_URL}/api/job-posts/${documentId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
    }
  });

  if (!res.ok) throw new Error('Failed to delete job');

  revalidatePath('/careers');
  revalidatePath('/recruiter/dashboard');

  return true;
}

export async function updateJobDetails(documentId: string, formData: FormData) {
  const title = formData.get('title') as string;
  const department = formData.get('department') as string;
  const type = formData.get('type') as string;
  const experience = parseInt(formData.get('experience') as string, 10);
  const jobDescription = formData.get('jobDescription') as string;

  // Extract and parse the updated schema
  const formSchemaRaw = formData.get('formSchema') as string;
  const formSchema = formSchemaRaw ? JSON.parse(formSchemaRaw) : undefined;

  const payload = {
    data: {
      title,
      department,
      type,
      experience,
      jobDescription,
      ...(formSchema && { formSchema })
    }
  };

  const res = await fetch(`${process.env.STRAPI_API_URL}/api/job-posts/${documentId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.STRAPI_API_TOKEN}`,
    },
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to update job: ${JSON.stringify(err)}`);
  }

  revalidatePath('/careers');
  revalidatePath('/recruiter/dashboard');
  revalidatePath(`/careers/[slug]`, 'page');

  return { success: true };
}