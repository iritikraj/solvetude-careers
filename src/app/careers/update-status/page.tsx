'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { updateAvailability } from '@/actions/availability-actions';

function StatusUpdaterForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (!token) {
    return <div className="text-red-500">Invalid link. No token provided.</div>;
  }

  const handleSelection = async (isAvailable: boolean) => {
    setStatus('loading');

    const result = await updateAvailability(token, isAvailable);

    if (result.success) {
      setStatus('success');
      setMessage(isAvailable
        ? "Awesome! We've noted that you're still available. We'll be in touch if a matching role opens."
        : "Thanks for letting us know! Congratulations on your current role, and we wish you the best."
      );
    } else {
      setStatus('error');
      setMessage(result.error || "Failed to update status.");
    }
  };

  if (status === 'success') {
    return (
      <div className="text-center">
        <h2 className="text-2xl text-[#11192b] mb-4">Profile Updated</h2>
        <p className="text-[#11192b]/70">{message}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl text-[#11192b] uppercase tracking-widest mb-2">Update Your Status</h2>
      <p className="text-[#11192b]/70 mb-8">Are you currently open to new opportunities at Solvetude?</p>

      {status === 'error' && <p className="text-red-500 mb-6">{message}</p>}

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button
          onClick={() => handleSelection(true)}
          disabled={status === 'loading'}
          className="bg-[#11192b] text-white px-8 py-4 uppercase tracking-[0.15em] text-sm hover:bg-[#0b3579] transition-colors disabled:opacity-50"
        >
          Yes, I&apos;m available
        </button>
        <button
          onClick={() => handleSelection(false)}
          disabled={status === 'loading'}
          className="bg-transparent border border-[#11192b] text-[#11192b] px-8 py-4 uppercase tracking-[0.15em] text-sm hover:bg-[#11192b] hover:text-white transition-colors disabled:opacity-50"
        >
          No, I&apos;m hired elsewhere
        </button>
      </div>
    </div>
  );
}

export default function UpdateStatusPage() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] flex items-center justify-center p-6">
      <div className="bg-white border border-[#191817]/10 p-10 max-w-2xl w-full shadow-sm">
        {/* Next.js requires useSearchParams to be wrapped in Suspense for static generation bailouts */}
        <Suspense fallback={<div>Loading...</div>}>
          <StatusUpdaterForm />
        </Suspense>
      </div>
    </div>
  );
}