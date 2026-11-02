
'use client';

import { updateCandidateStatus } from '@/actions/cadidate-actions';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  ChevronDown,
  Clock,
  Eye,
  CheckCircle2,
  XCircle,
  BriefcaseBusiness,
  Loader2,
} from 'lucide-react';

interface StatusUpdaterProps {
  candidate: any;
  currentStatus: string;
  candidateInfo: {
    firstName: string;
    email: string;
    appliedRole: string;
  };
}

const statusConfig: Record<string, {
  icon: React.ElementType;
  style: string;
}> = {
  New: {
    icon: Clock,
    style: 'bg-slate-50 text-slate-700 border-slate-200',
  },
  Reviewing: {
    icon: Eye,
    style: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  Shortlisted: {
    icon: CheckCircle2,
    style: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Rejected: {
    icon: XCircle,
    style: 'bg-red-50 text-red-700 border-red-200',
  },
  Hired: {
    icon: BriefcaseBusiness,
    style: 'bg-blue-50 text-blue-700 border-blue-200',
  },
};

export function StatusUpdater({
  candidate,
  currentStatus,
  candidateInfo,
}: StatusUpdaterProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState(currentStatus);

  const currentConfig = statusConfig[status] || statusConfig.New;
  const StatusIcon = currentConfig.icon;

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    const previousStatus = status;

    setIsUpdating(true);
    setStatus(newStatus);

    try {
      const result = await updateCandidateStatus(
        candidate.documentId,
        newStatus,
        candidateInfo
      );

      if (!result.success) {
        throw new Error(result.error || 'Failed to update status');
      }

      toast.success(`Candidate status updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status', error);
      toast.error('Failed to update status');
      setStatus(previousStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="relative inline-flex">
      <div
        className={`
          relative inline-flex items-center gap-2
          rounded-full border px-3 py-1.5
          transition-all duration-200
          ${currentConfig.style}
          ${isUpdating ? 'opacity-60' : 'hover:shadow-sm'}
        `}
      >
        {isUpdating ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <StatusIcon size={14} strokeWidth={2.2} />
        )}

        <select
          value={status}
          onChange={handleStatusChange}
          disabled={isUpdating}
          aria-label="Update candidate status"
          className="
            appearance-none bg-transparent
            pr-5 text-[11px] font-bold
            uppercase tracking-wider
            outline-none cursor-pointer
            disabled:cursor-not-allowed
          "
        >
          <option value="New">New</option>
          <option value="Reviewing">Reviewing</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Rejected">Rejected</option>
          <option value="Hired">Hired</option>
        </select>

        <div className="pointer-events-none absolute right-2 flex items-center">
          <ChevronDown
            size={13}
            strokeWidth={2.5}
            className="opacity-70"
          />
        </div>
      </div>
    </div>
  );
}
