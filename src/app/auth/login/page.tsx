/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }

      // Redirect to the intended page, or default to the recruiter dashboard
      const nextPath = searchParams.get('next') || '/recruiter/dashboard';
      router.push(nextPath);
      router.refresh(); // Force Next.js to re-evaluate the middleware and layout state

    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full bg-white border border-[#14181F]/10 px-5 py-4 text-[14px] text-[#14181F] font-jost placeholder:text-[#14181F]/30 outline-none focus:border-[#0b3579] focus:ring-1 focus:ring-[#0b3579] transition-all rounded-xl";

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white border border-[#14181F]/5 shadow-sm text-[#0b3579] mb-6">
          <Lock size={20} strokeWidth={1.5} />
        </div>
        <h1 className="text-4xl md:text-5xl font-light leading-[1.05] tracking-tight text-[#14181F] mb-4 font-serif ">
          Recruiter&nbsp;
          <span className="text-[#0b3579] font-light">Access.</span>
        </h1>
        <p className="text-[15px] font-jost text-[#565C6B] font-light">
          Enter your credentials to manage jobs.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="sr-only">Username or Email</label>
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="Username or Email"
            required
            className={inputClasses}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="sr-only">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className={inputClasses}
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-jost text-center">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex items-center justify-center bg-[#14181F] px-8 py-5 rounded-xl cursor-pointer text-[12px] uppercase tracking-[0.2em] font-semibold text-[#f4f7fb] overflow-hidden transition-all duration-500 hover:shadow-[0_8px_30px_-5px_rgba(20,24,31,0.2)] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
          <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Authenticating...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight size={16} strokeWidth={2} className="transition-transform duration-500 group-hover:translate-x-1" />
              </>
            )}
          </span>
          {!isLoading && (
            <div className="absolute inset-0 bg-[#0b3579] translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
          )}
        </button>
      </form>

      <div className="mt-10 text-center">
        <Link href="/" className="text-[12px] font-jost text-[#565C6B] hover:text-[#0b3579] transition-colors uppercase tracking-widest">
          ← Back to Platform
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] selection:bg-[#0b3579]/20 flex items-center justify-center p-6">
      <Suspense fallback={<div className="animate-pulse flex flex-col items-center"><Loader2 className="animate-spin text-[#0b3579] mb-4" /> Loading environment...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}