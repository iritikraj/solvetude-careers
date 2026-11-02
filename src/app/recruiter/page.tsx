import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, User as UserIcon, Calendar, ShieldCheck } from 'lucide-react';

// Secure Server-Side Fetching
async function getRecruiterProfile(token: string) {
  try {
    const res = await fetch(`${process.env.STRAPI_API_URL}/api/users/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch profile:", error);
    return null;
  }
}

export default async function RecruiterProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('solvetude_session')?.value;

  // 1. Protect the route
  if (!token) {
    redirect('/auth/login');
  }

  // 2. Fetch user data
  const user = await getRecruiterProfile(token);

  if (!user) {
    redirect('/auth/login');
  }

  // Format the creation date if it exists
  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Unknown';

  return (
    <div className="min-h-screen bg-[#f4f7fb] p-6 md:p-12 lg:p-16 font-jost text-[#11192b] selection:bg-[#0b3579]/30">
      <div className="max-w-3xl mx-auto">

        {/* --- HEADER --- */}
        <header className="mb-12">
          <Link
            href="/recruiter/dashboard"
            className="group inline-flex items-center gap-2 text-[#11192b]/50 hover:text-[#0b3579] transition-colors mb-8 text-[11px] uppercase tracking-[0.2em] font-semibold"
          >
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1 duration-300" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl md:text-6xl font-light tracking-tight mb-3 font-serif">
            Admin <span className="text-[#0b3579] font-serif">Identity.</span>
          </h1>
          <p className="text-lg font-light text-[#11192b]/60 leading-relaxed max-w-2xl">
            Manage your recruiter credentials and platform access.
          </p>
        </header>

        {/* --- PROFILE CARD --- */}
        <div className="bg-white rounded-4xl overflow-hidden shadow-[0_2px_40px_-12px_rgba(0,0,0,0.03)] border border-[#11192b]/3 relative">

          {/* Top Abstract Graphic */}
          <div className="h-32 bg-gradient-to-br from-[#11192b] to-[#0b3579] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#b69c6b]/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          </div>

          <div className="px-8 md:px-12 pb-12">

            {/* Avatar Override */}
            <div className="relative -mt-16 mb-8 flex justify-between items-end">
              <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                <div className="w-full h-full bg-[#f4f7fb] rounded-full flex items-center justify-center border border-[#11192b]/5">
                  <span className="text-4xl font-serif text-[#0b3579] uppercase">
                    {user.username ? user.username.charAt(0) : 'R'}
                  </span>
                </div>
              </div>
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] uppercase tracking-[0.2em] font-bold border border-emerald-100">
                  <ShieldCheck size={12} /> Active Session
                </span>
              </div>
            </div>

            {/* Profile Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">

              {/* Username */}
              <div className="bg-[#f4f7fb]/50 rounded-2xl p-6 border border-[#11192b]/5">
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-2">
                  <UserIcon size={14} className="text-[#b69c6b]" />
                  Username
                </div>
                <p className="text-xl font-medium text-[#11192b]">
                  {user.username}
                </p>
              </div>

              {/* Email */}
              <div className="bg-[#f4f7fb]/50 rounded-2xl p-6 border border-[#11192b]/5">
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-2">
                  <Mail size={14} className="text-[#b69c6b]" />
                  Email Address
                </div>
                <p className="text-xl font-medium text-[#11192b]">
                  {user.email}
                </p>
              </div>

              {/* Role / ID */}
              <div className="bg-[#f4f7fb]/50 rounded-2xl p-6 border border-[#11192b]/5">
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-2">
                  <ShieldCheck size={14} className="text-[#b69c6b]" />
                  System Role
                </div>
                <p className="text-xl font-medium text-[#11192b]">
                  Recruiter (ID: {user.id})
                </p>
              </div>

              {/* Joined Date */}
              <div className="bg-[#f4f7fb]/50 rounded-2xl p-6 border border-[#11192b]/5">
                <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-[#11192b]/50 font-semibold mb-2">
                  <Calendar size={14} className="text-[#b69c6b]" />
                  Account Created
                </div>
                <p className="text-xl font-medium text-[#11192b]">
                  {joinedDate}
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}