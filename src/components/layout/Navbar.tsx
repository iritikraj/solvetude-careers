import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, LayoutDashboard } from 'lucide-react';
import { cookies } from 'next/headers';
import { LogoutButton } from '@/app/auth/_logout';

export default async function Navbar() {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.has('solvetude_session');

  return (
    <nav className="sticky top-0 z-50 w-full bg-[#0f2953] backdrop-blur-2xl border-b border-white/5 transition-all">
      <div className="mx-auto max-w-7xl px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/solvetude-logo.png"
            alt="Solvetude"
            width={120}
            height={40}
            className="object-contain"
          />
        </Link>

        {/* Links & CTA */}
        <div className="flex items-center gap-8">
          <Link
            href="/careers"
            className="hidden md:block text-[11px] uppercase tracking-[0.2em] font-semibold text-white/60 hover:text-white transition-colors"
          >
            View Jobs
          </Link>

          {/* Conditional Auth State: Premium Segmented Pill */}
          {isAuthenticated ? (
            <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md shadow-inner">
              <Link
                href="/recruiter/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#0f2953] transition-transform hover:scale-[1.02] shadow-sm"
              >
                <LayoutDashboard size={14} />
                Dashboard
              </Link>

              <LogoutButton />
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-transparent px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white transition-all hover:border-white hover:bg-white hover:text-[#0f2953]"
            >
              Rec. Login
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

      </div>
    </nav>
  );
}