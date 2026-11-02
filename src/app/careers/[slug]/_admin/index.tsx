'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Edit2, EyeOff, Eye, Trash2, Loader2 } from 'lucide-react';
import { toggleJobStatus, deleteJob } from '@/actions/job-management';
import { toast } from 'sonner';

export function JobAdminActions({ documentId, jobSlug, initialStatus }: { documentId: string, jobSlug: string, initialStatus: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      const newStatus = await toggleJobStatus(documentId, status);
      toast.success(`Job status updated to ${newStatus}`);
      setStatus(newStatus);
    } catch (error) {
      console.error("Failed to update status", error);
      toast.error("Failed to update job status");
    }
    setIsUpdating(false);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this job post?")) return;

    setIsDeleting(true);
    try {
      await deleteJob(documentId);
      router.push('/recruiter/dashboard');
    } catch (error) {
      console.error("Failed to delete job", error);
      setIsDeleting(false);
    }
  };

  return (
    <div className="inline-flex items-center gap-1 p-1 bg-[#14181F] rounded-full shadow-md">
      <div className="px-4 py-1.5 flex items-center gap-2 border-r border-white/10">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">
          Admin
        </span>
      </div>

      {/* FIXED ROUTING: Now points to the correct slug-based edit page */}
      <button
        onClick={() => router.push(`/careers/${jobSlug}/edit`)}
        className="cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-white/70 hover:bg-white/10 hover:text-white transition-all"
      >
        <Edit2 size={10} /> Edit
      </button>

      <button
        onClick={handleToggleStatus}
        disabled={isUpdating}
        className={`cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] transition-all ${status === 'Published'
          ? 'text-[#4370b7] hover:bg-[#4370b7]/20'
          : 'text-emerald-400 hover:bg-emerald-400/20'
          }`}
      >
        {isUpdating ? <Loader2 size={10} className="animate-spin" /> : (status === 'Published' ? <EyeOff size={10} /> : <Eye size={10} />)}
        {status === 'Published' ? 'Unpublish' : 'Publish'}
      </button>

      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="cursor-pointer flex items-center gap-2 px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] text-red-400/70 hover:bg-red-400/20 hover:text-red-400 transition-all"
      >
        {isDeleting ? <Loader2 size={10} className="animate-spin" /> : <Trash2 size={10} />}
      </button>
    </div>
  );
}